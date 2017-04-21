var path = require('path');
var webpack = require('webpack');

module.exports = {
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
    plugins: [
        new webpack.HotModuleReplacementPlugin()
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
