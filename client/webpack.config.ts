import 'dotenv/config';

import { resolve, join } from 'node:path';
import { DefinePlugin } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { CustomRuntime } from './webpack/plugins/CustomRuntime';

import {dependencies} from './package.json';

type Env = {
    isDev: boolean;
    isServer: boolean;
};

const {
    NODE_ENV,
    HMR_ENDPOINT,
} = process.env;
const isDev = NODE_ENV === 'development';

const server = resolve(__dirname, 'build', 'server');
const client = resolve(__dirname, 'build', 'client');
const externals = (object) => Object.keys(object).reduce((acc, key) => {
    acc[key] = 'commonjs ' + key;
    return acc;
}, {})

const config = ({ isServer, isDev = false }: Env) => {
    const env = isServer ? 'server' : 'client';

    return {
        mode: isDev ? 'development' : 'production',
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
            filename: isServer ? 'server/[name].cjs' : isDev ? 'client/[name].js' : 'client/[name].[contenthash:8].js',
            chunkFilename: isServer ? 'server/[name].cjs' : isDev ? 'client/[name].js' : 'client/[name].[contenthash:8].js',
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
                '~/i18n': resolve(__dirname, './src/i18n'),
                '~/models': resolve(__dirname, './src/models'),
                '~/resolvers': resolve(__dirname, './src/resolvers'),
                '~/configs': resolve(__dirname, './src/configs'),
                // '~@doc-tools/transform/dist/css/yfm.css': require.resolve('@doc-tools/transform/dist/css/yfm.css'),
            },
            fallback: isServer ? {} : {
                'stream': false,
                'util': false,
                'url': false,
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
                use: 'babel-loader',
                exclude: /node_modules\/(?!@modelsjs)/
            }, {
                test: /\.css$/,
                use:  [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                        options: {
                            esModule: false,
                            emit: !isServer
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: (path) => path.endsWith(".module.css"),
                            }
                        }
                    }
                ],
            } ],
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

                            if (key.endsWith('.js')) {
                                acc.scripts.push(manifest[key]);
                            }

                            return acc;
                        }, {
                            styles: [],
                            scripts: []
                        });
                    return `module.exports = (${ Manifest.toString() })(${ JSON.stringify(data, null, 2) })`;
                },
                sort: (fileA) => {
                    if (fileA.name.includes('app')) {
                        return 1;
                    } else if (!fileA.name.includes('app')) {
                        return -1;
                    }
                    return 0;
                }
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'static'
            // }),
            // new StatoscopeWebpackPlugin(),
            new MiniCSSExtractPlugin({
                filename: join(env, isDev ? '[name].[contenthash:8].css' : '[name].css'),
                ignoreOrder: true,
            }),
            isServer && new CustomRuntime()
        ].filter(Boolean),
        cache: {
            type: 'filesystem',
            cacheDirectory: resolve(isServer ? 'cache/server' : 'cache/client')
        },
        optimization: {
            minimize: !isDev && !isServer,
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxSize: 2000000
            }
        },
        ...(!isServer ? {
            devServer: {
                port: 3001,
                client: {
                    overlay: false,
                    webSocketURL: HMR_ENDPOINT || `wss://localhost/static/ws`,
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
    config({ isDev, isServer: true }),
    config({ isDev, isServer: false }),
];
