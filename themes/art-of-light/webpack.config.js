const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    watch: true,
    // ignoreWarnings: [{ file: /core.scss$/, message: /^DEPRECATION WARNING/, }, (warning, compilation) => true],
    resolveLoader: {
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.js', '.json'],
        mainFields: ['loader', 'main'],
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[name].css'
                },
                use: [
                    // Creates `style` nodes from JS strings
                    // MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    // Compiles Sass to CSS

                    "sass-loader",
                    // "style-loader",
                    // "css-loader",
                    // MiniCssExtractPlugin.loader,
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
        ],
    },
};