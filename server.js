var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config.babel');
var appMain = express();
var appFrame = express();
var appDoc = express();
var compiler = webpack(config);


function createServer(app, index, port) {
    return new Promise((res, rej) => {
        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath: config.output.publicPath
        }));

        app.use(require('webpack-hot-middleware')(compiler));

        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, index));
        });

        app.listen(port, function(err) {
            if (err) {
                return console.error(err);
            }
            setTimeout(() => {
                res(true);
            }, 25000)
            console.log(`Listening at http://localhost:${port}/`);
        })
    })

}

createServer(appMain, 'index.html', 3002).then(fireFrameWindow)

function fireFrameWindow() {
    createServer(appFrame, 'index.frame.html', 3003).then(fireDocWindow)
}

function fireDocWindow() {
    createServer(appDoc, 'index.documentation.html', 3004)
}
