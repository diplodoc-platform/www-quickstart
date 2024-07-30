module.exports = {
    presets: [
        ['@babel/preset-env', {
            exclude: [
                '@babel/plugin-transform-regenerator'
            ]
        }],
        '@babel/preset-typescript',
        '@babel/preset-react'
    ],
    plugins: [
        [ '@babel/plugin-proposal-decorators', {
            decoratorsBeforeExport: true
        } ]
    ]
};