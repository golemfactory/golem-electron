var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    //devtool: 'cheap-module-eval-source-map',
    entry: [
        'babel-polyfill',
        './src/main'
    ],
    node: {
        fs: 'empty',
        tls: 'empty'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
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
                presets: ['react', "es2015", 'stage-0']
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
                test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
                use: ["file-loader"]
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
                use: ["file-loader"]
            }]
    }
};
