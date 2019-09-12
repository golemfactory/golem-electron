const path = require('path');
const sass = require('sass');
const Fiber = require('fibers');
const webpack = require('webpack');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const modes = {
    DEV: 'development',
    PROD: 'production'
};

let gitVersion = require('child_process')
    .execSync('git describe --tags')
    .toString();

module.exports = (env, argv) => ({
    devtool: argv.mode === modes.DEV ? 'cheap-module-eval-source-map' : false,
    entry: {
        main: [
            '@babel/polyfill',
            argv.mode === modes.DEV ? 'webpack/hot/only-dev-server' : false,
            argv.mode === modes.DEV
                ? 'webpack-dev-server/client?http://0.0.0.0:3002'
                : false,
            './src/main'
        ].filter(Boolean),
        frame: [
            '@babel/polyfill',
            argv.mode === modes.DEV ? 'webpack/hot/only-dev-server' : false,
            argv.mode === modes.DEV
                ? 'webpack-dev-server/client?http://0.0.0.0:3002'
                : false,
            './src/main.frame'
        ].filter(Boolean),
        doc: [
            '@babel/polyfill',
            argv.mode === modes.DEV ? 'webpack/hot/only-dev-server' : false,
            argv.mode === modes.DEV
                ? 'webpack-dev-server/client?http://0.0.0.0:3002'
                : false,
            './src/main.doc'
        ].filter(Boolean)
    },
    node: {
        fs: 'empty',
        tls: 'empty'
    },
    output: {
        path: path.join(__dirname, argv.mode === modes.DEV ? 'dist' : 'app'),
        filename: '[name].bundle.js',
        publicPath: argv.mode === modes.DEV ? '/static/' : './app/'
    },
    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.js',
            'react-dom': '@hot-loader/react-dom'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            // <-- key to reducing React's size
            'process.env': {
                NODE_ENV: JSON.stringify(argv.mode || 'development')
            },
            __VERSION__: JSON.stringify(gitVersion)
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
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
        new HtmlWebpackHarddiskPlugin(),
        /*In case of Lodash errors @see https://github.com/lodash/lodash-webpack-plugin*/
        new HappyPack({
            id: 'jsx',
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        plugins: [
                            [
                                '@babel/plugin-proposal-decorators',
                                {
                                    legacy: true
                                }
                            ],
                            argv.mode === modes.DEV
                                ? 'react-hot-loader/babel'
                                : false,
                            '@babel/plugin-proposal-class-properties'
                        ].filter(Boolean),
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
            ],
            threadPool: happyThreadPool
        }),
        new HappyPack({
            id: 'css',
            loaders: ['style-loader', 'css-loader'],
            threadPool: happyThreadPool
        }),
        argv.mode === modes.PROD &&
            new CompressionPlugin({
                // <-- don't forget to activate gzip on web server
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            })
        //new webpack.ContextReplacementPlugin(/bindings$/, /^$/),
        //new BundleAnalyzerPlugin() // <--- Cool stuff to see package size of the modules
    ].filter(Boolean),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'happypack/loader?id=jsx',
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                // Test expects a RegExp! Note the slashes!
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: sass,
                            fiber: Fiber
                        }
                    }
                ],
                // Include accepts either a path or an array of paths.
                include: path.join(__dirname, 'src/scss')
            },
            {
                test: /\.css$/,
                use: 'happypack/loader?id=css'
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?[a-z0-9]+)?$/,
                use: ['file-loader']
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
                use: ['file-loader']
            }
        ]
    }
});
