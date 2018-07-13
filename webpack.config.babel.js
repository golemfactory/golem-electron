var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = {
    mode: 'none',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        main: [
            'babel-polyfill',
            'webpack-hot-middleware/client',
            './src/main'
        ],
        frame: [
            'babel-polyfill',
            'webpack-hot-middleware/client',
            './src/main.frame'
        ],
        doc: [
            'babel-polyfill',
            'webpack-hot-middleware/client',
            './src/main.doc'
        ]
    },
    node: {
        fs: 'empty',
        tls: 'empty'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/static/'
    },
    resolve: {
        alias: {
          'handlebars' : 'handlebars/dist/handlebars.js'
        }
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            inject: true,
            chunks: ['main'],
            filename: '../index.html',
            template: 'template.html'
        }),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            inject: true,
            chunks: ['frame'],
            filename: '../index.frame.html',
            template: 'template.html'
        }),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            inject: true,
            chunks: ['doc'],
            filename: '../index.documentation.html',
            template: 'template.html'
        }),
        new HtmlWebpackHarddiskPlugin()
    //new webpack.ContextReplacementPlugin(/bindings$/, /^$/)
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'src'),
            exclude: /node_modules/,
            options: {
                cacheDirectory: true,
                plugins: ['transform-decorators-legacy', "react-hot-loader/babel", "transform-class-properties"],
                presets: ['react', 'env', 'stage-0']
            }
        },
            {
                // Test expects a RegExp! Note the slashes!
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
                // Include accepts either a path or an array of paths.
                include: path.join(__dirname, 'src/scss')
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?[a-z0-9]+)?$/,
                use: ["file-loader"]
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
                use: ["file-loader"]
            }]
    }
};
