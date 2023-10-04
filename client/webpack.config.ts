import 'dotenv/config';

import { resolve } from 'node:path';
import { DefinePlugin } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin'
// import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { CustomRuntime } from './webpack/plugins/CustomRuntime';

import {dependencies} from './package.json';

type Env = {
    isDev: boolean;
    isServer: boolean;
};

const server = resolve(__dirname, 'build', 'server');
const client = resolve(__dirname, 'build', 'client');
const externals = (object) => Object.keys(object).reduce((acc, key) => {
    acc[key] = 'commonjs ' + key;
    return acc;
}, {})

const config = ({ isServer, isDev = false }: Env) => {
    return {
        mode: 'development',
        target: isServer ? 'node' : 'web',
        devtool: 'source-map',
        entry: {
            'app': './src/app',
            ...(isServer ? {
                'models': './src/api/models',
                'actions': './src/api/actions',
            } : {})
        },
        output: {
            path: resolve(__dirname, 'build'),
            publicPath: isServer ? '' : 'auto',
            filename: isServer ? 'server/[name].cjs' : 'client/[name].cjs',
            chunkFilename: '[name].cjs',
            ...(isServer ? {
                iife: false,
                libraryTarget: 'commonjs2',
            } : {})
        },
        externals: isServer ? externals(dependencies) : {},
        resolve: {
            extensions: [
                isServer && '.server.tsx',
                isServer && '.server.ts',
                '.tsx',
                '.ts',
                '...'
            ].filter(Boolean),
            enforceExtension: false,
            // fallback: {
            //     '@doc-tools/transform/*': false
            // },
            mainFields: [ 'main', 'module' ],
            alias: {
                'react': require.resolve('react'),
                'react-dom/client': require.resolve('react-dom/client'),
                'react-dom/server': isServer
                    ? require.resolve('react-dom/server.node')
                    : require.resolve('react-dom/server.browser'),
                '~/assets': resolve(__dirname, './src/assets'),
                '~/utils': resolve(__dirname, './src/utils'),
                '~/models': resolve(__dirname, './src/models'),
                '~/resolvers': resolve(__dirname, './src/resolvers'),
                '~/configs': resolve(__dirname, './src/configs'),
                '~@doc-tools/transform/dist/css/yfm.css': require.resolve('@doc-tools/transform/dist/css/yfm.css'),
            },
            fallback: isServer ? {} : {
                'stream': false,
                'util': false,
            }
        },
        module: {
            rules: [ {
                test: /\.svg$/,
                type: 'asset/source',
            }, {
                test: /\.[tj]sx?$/,
                resolve: {
                    fullySpecified: false,
                },
                use: [ {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/env',
                            '@babel/react',
                            '@babel/typescript'
                        ],
                        plugins: [
                            [ '@babel/plugin-proposal-decorators', {
                                decoratorsBeforeExport: true
                            } ]
                        ]
                    }
                } ],
                exclude: /node_modules\/(?!@modelsjs)/
            } ],
        },
        experiments: {
            css: {
                exportsOnly: isServer,
            }
        },
        plugins: [
            new DefinePlugin({
                'process.env': {
                    SERVER: isServer,
                }
            }),
            !isServer && new WebpackManifestPlugin({
                fileName: 'client/manifest.cjs',
                writeToFileEmit: true,
                serialize: (manifest) => {
                    const data = Object.keys(manifest)
                        .filter((key) => !key.endsWith('.map'))
                        .reduce((acc, key) => {
                            if (key.endsWith('.css')) {
                                acc.styles.push(manifest[key]);
                            }

                            if (key.endsWith('.cjs')) {
                                acc.scripts.push(manifest[key]);
                            }

                            return acc;
                        }, {
                            styles: [],
                            scripts: []
                        });
                    return `module.exports = (${ Manifest.toString() })(${ JSON.stringify(data, null, 2) })`;
                }
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'static'
            // }),
            // new StatoscopeWebpackPlugin(),
            // new MiniCSSExtractPlugin({
            //     filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
            //     chunkFilename: isDev ? '[name].css' : '[name].[contenthash:8].css',
            //     ignoreOrder: true,
            // }),
            isServer && new CustomRuntime()
        ].filter(Boolean),
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
            }
        },
        ...(!isServer ? {
            devServer: {
                port: 3001,
                client: {
                    overlay: false,
                    webSocketURL: 'wss://localhost/static/ws',
                },
                devMiddleware: {
                    writeToDisk: (path) => path.startsWith(server) && !path.includes('.hot-update.js')
                }
            },
        } : {})

    };
};

function Manifest(manifest) {
    return function(root) {
        if (root) {
            root = root.replace(/\/$/, '');
            manifest.scripts = manifest.scripts.map((key) => key.replace(/^auto/, root));
            manifest.styles = manifest.styles.map((key) => key.replace(/^auto/, root));
        }

        return manifest;
    }
}

export default [
    config({ isDev: true, isServer: true }),
    config({ isDev: true, isServer: false }),
];