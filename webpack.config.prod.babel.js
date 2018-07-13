var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    //devtool: 'cheap-module-eval-source-map',
    mode: 'none',
    entry: {
        main: [
            'babel-polyfill',
            './src/main'
        ],
        frame: [
            'babel-polyfill',
            './src/main.frame'
        ],
        doc: [
            'babel-polyfill',
            './src/main.doc'
        ]
    },
    node: {
        fs: 'empty',
        tls: 'empty'
    },
    output: {
        path: path.join(__dirname, 'app'),
        filename: '[name].bundle.js',
        publicPath: './app/'
    },
    resolve: {
        alias: {
          'handlebars' : 'handlebars/dist/handlebars.js'
        }
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['main'],
            filename: '../index.html',
            template: 'template.html'
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['frame'],
            filename: '../index.frame.html',
            template: 'template.html'
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['doc'],
            filename: '../index.documentation.html',
            template: 'template.html'
        }),
        new CompressionPlugin({ // <-- don't forget to activate gzip on web server
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new BundleAnalyzerPlugin() // <--- Cool stuff to see package size of the modules
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'src'),
            exclude: /node_modules/,
            options: {
                cacheDirectory: true,
                plugins: ['transform-decorators-legacy', "transform-class-properties"],
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
                use: ["file-loader?name=fonts/[hash].[ext]"]
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.json$/,
                use: ["file-loader?name=images/[hash].[ext]"]
            }]
    }
};
