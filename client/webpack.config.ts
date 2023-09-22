import { resolve } from 'node:path';
import { DefinePlugin } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { CustomRuntime } from './webpack/plugins/CustomRuntime';

type Env = {
    isDev: boolean;
    isServer: boolean;
};

const server = resolve(__dirname, 'build', 'server');
const client = resolve(__dirname, 'build', 'client');

const config = ({ isServer, isDev = false }: Env) => {
    return {
        mode: 'development',
        target: isServer ? 'node' : 'web',
        devtool: 'source-map',
        entry: {
            'app': './src/app',
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
        externals: isServer ? {
            'stream': 'commonjs stream',
            'util': 'commonjs util',
        } : {},
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
            mainFields: ["main", "module"],
            alias: {
                'react': require.resolve('react'),
                'react-dom/client': require.resolve('react-dom/client'),
                'react-dom/server': isServer
                    ? require.resolve('react-dom/server.node')
                    : require.resolve('react-dom/server.browser'),
                '~/utils':  resolve(__dirname, './src/utils'),
                '~/models':  resolve(__dirname, './src/models'),
                '~/resolvers': resolve(__dirname, './src/resolvers'),
                '~/configs': resolve(__dirname, './src/configs')
            },
            fallback: isServer ? {} : {
                'stream': false,
                'util': false,
            }
        },
        module: {
            rules: [ {
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
                exclude: /node_modules/,
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
                    SERVER: isServer
                }
            }),
            new WebpackManifestPlugin({
                fileName: isServer ? 'server/manifest.json' : 'client/manifest.json',
                writeToFileEmit: true
            }),
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

export default [
    config({ isDev: true, isServer: true }),
    config({ isDev: true, isServer: false }),
];