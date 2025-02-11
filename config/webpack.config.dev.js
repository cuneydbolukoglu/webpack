const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); // Ekledik

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const appPackageJson = require('../package.json');
const appHtml = resolveApp('./public/index.html');
const { proxy, menuName } = appPackageJson;

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            require.resolve('react-refresh/babel'), // HMR için React Refresh eklendi
                        ],
                    },
                },
            },
            {
                test: /\.(scss|css)$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(ico|gif|png|jpg|jpeg|svg)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'assets/images/[name].[ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                loader: 'url-loader',
                options: {
                    limit: 50000,
                    mimeType: 'application/font-ttf',
                    name: 'assets/fonts/[name].[ext]',
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: 'media/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.PUBLIC_URL': JSON.stringify(''),
            'process.env.MENU_NAME': JSON.stringify(menuName),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, appHtml),
            filename: 'index.html',
            favicon: './public/favicon.ico',
        }),
        new ReactRefreshWebpackPlugin(), // Eklenen plugin
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, '../public'),
        },
        port: 3000,
        open: true,
        host: 'localhost',
        hot: true, // Hot Module Replacement
        compress: true,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: proxy,
            },
        ],
    },
};
