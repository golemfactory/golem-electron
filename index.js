const electron = require('electron')
const {app, BrowserWindow, Menu, ipcMain} = electron
const chalk = require('chalk')
const fs = require("fs")
var path = require('path')
const connect = require('connect');
const serveStatic = require('serve-static');
const compression = require('compression')

const createTray = require('./electron/tray_handler.js')
const ipcHandler = require('./electron/ipc_handler.js')
const golemHandler = require('./electron/golem_handler.js')

function isDevelopment() {
    return process.env.NODE_ENV === 'development'
}

const APP_NAME = isDevelopment() ? 'GOLEM GUI (development)' : 'GOLEM GUI'
const APP_WIDTH = 460
const APP_HEIGHT = 569
const PREVIEW_APP_WIDTH = 752
const PREVIEW_APP_HEIGHT = 572

let win
let previewWindow
let tray

/**
 * [onReady init function for electron]
 * @return
 */
function onReady() {
    if (isDevelopment()) {
        installDevExtensions()
    }

    //setupGolem()
    createWindow()
    // tray = createTray(win)

    ipcHandler(app, tray, win, createPreviewWindow, APP_WIDTH, APP_HEIGHT)
    golemHandler(app)
}

/**
 * [installDevExtensions installing development extensions]
 * @return  {[Object]}   [Promise]
 */
function installDevExtensions() {
    const installExtension = require('electron-devtools-installer').default
    const REACT_DEVELOPER_TOOLS = require('electron-devtools-installer').REACT_DEVELOPER_TOOLS
    const REDUX_DEVTOOLS = require('electron-devtools-installer').REDUX_DEVTOOLS

    console.log(chalk.blue(`Installing DevTools extensions...`));
    console.log()

    return new Promise((resolve, reject) => {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => {
                console.log(`${chalk.green(`✓`)} ${name}`)
                console.log()
                resolve()
            })
            .catch((err) => {
                console.log(chalk.red(`An error occurred: ${err}`))
                console.log()
                reject()
            })
        installExtension(REDUX_DEVTOOLS)
            .then((name) => {
                console.log(`${chalk.green(`✓`)} ${name}`)
                console.log()
                resolve()
            })
            .catch((err) => {
                console.log(chalk.red(`An error occurred: ${err}`))
                console.log()
                reject()
            })
    })
}

/**
 * [createWindow Creating browserWindow with given options]
 * @return
 */
function createWindow() {
    win = new BrowserWindow({
        title: APP_NAME,
        width: APP_WIDTH,
        height: APP_HEIGHT,
        //titleBarStyle: 'hidden-inset',
        frame: false,
        resizable: true,
        minWidth: APP_WIDTH,
        minHeight: APP_HEIGHT,
        maxWidth: APP_WIDTH,
        center: true,
        show: false,
        //backgroundColor: '#00789d',
        "webPreferences": {
            "webSecurity": false
        }
    })

    /*
        win.webContents.on('did-finish-load', function() {
            setTimeout(function() {
                win.show();
            }, 40);
        });
    */
    win.webContents.on('will-navigate', (event, url) => {
        event.preventDefault()
        if (url.includes('etherscan'))
            electron.shell.openExternal(url);
    })


    win.once('ready-to-show', () => {
        win.show()
    })

    if (isDevelopment()) {
        win.loadURL(`http://localhost:${process.env.PORT || 3002}/`)
    // win.loadURL(`file:///Users/mhmmd/projects/golem-electron/index.html`)
    //
    } else {
        // Load prod build
        // let app = connect()
        // app.use(compression())
        // app.use(serveStatic(__dirname)).listen(3003, function() {
        //     // win.loadURL(`http://localhost:${process.env.PORT || 3003}/`)
        //     win.loadURL(`file:///Users/mhmmd/projects/golem-electron/index.html`)
        // });
        win.loadURL(`file://${__dirname}/index.html`)
    }

    // Do not update window title after loading pages
    win.on('page-title-updated', (event) => event.preventDefault())

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', onReady)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-navigate', ev => {
    ev.preventDefault()
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})


function createPreviewWindow(id, frameCount) {
    previewWindow = new BrowserWindow({
        title: APP_NAME,
        width: PREVIEW_APP_WIDTH,
        height: PREVIEW_APP_HEIGHT,
        //titleBarStyle: 'hidden-inset',
        frame: false,
        resizable: false,
        center: true,
        show: true,
        //backgroundColor: '#00789d',
        "webPreferences": {
            "webSecurity": false
        }
    })

    /*
        win.webContents.on('did-finish-load', function() {
            setTimeout(function() {
                win.show();
            }, 40);
        });
    */
    previewWindow.once('ready-to-show', () => {
        win.show()
    })

    if (isDevelopment()) {
        let previewURL = `http://localhost:${process.env.PORT || 3003}#/preview/${frameCount > 1 ? 'all' : 'single' }/${id}`
        previewWindow.loadURL(previewURL)
    } else {
        let previewURL = `file://${__dirname}/index.frame.html#/preview/${frameCount > 1 ? 'all' : 'single' }/${id}`
        previewWindow.loadURL(previewURL)
    //win.loadURL(`file://${__dirname}/index.html`)
    }
}

exports.selectDirectory = function(directory) {
console.log("directory", directory);

let blackList = [
    "ACTION",
    "APK",
    "APP",
    "BAT",
    "BIN",
    "CMD",
    "COM",
    "COMMAND",
    "CPL",
    "CSH",
    "EXE",
    "GADGET",
    "INF",
    "INS",
    "INX",
    "IPA",
    "ISU",
    "JOB",
    "JSE",
    "KSH",
    "LNK",
    "MSC",
    "MSI",
    "MSP",
    "MST",
    "OSX",
    "OUT",
    "PAF",
    "PIF",
    "PRG",
    "REG",
    "RGS",
    "RUN",
    "SCR",
    "SCT",
    "SHB",
    "SHS",
    "U3B",
    "VB",
    "VBE",
    "VBS",
    "VBSCRIPT",
    "WORKFLOW",
    "WS",
    "WSF",
    "WSH",
]

const masterList = [
    "BLEND",
    "LXS"
]

let ignorePlaftormFiles = function(file) {
    return path.basename(file) !== ".DS_Store" && path.extname(file) !== null
}

let isBadFile = function(file) {
    let correctExtension = file.replace(".", "").toUpperCase()
    return blackList.includes(correctExtension)
}

let isMasterFile = function(file) {
    let correctExtension = file.replace(".", "").toUpperCase()
    return masterList.includes(correctExtension)
}

let walk = function(dir, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = `${dir}/${file}`;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    ignorePlaftormFiles(file) && results.push({
                        path: file,
                        name: path.basename(file),
                        extension: path.extname(file),
                        malicious: isBadFile(path.extname(file)),
                        master: isMasterFile(path.extname(file))
                    });
                    next();
                }
            });
        })();
    });
};

let promises = directory.length > 0 && directory.map(item => new Promise((resolve, reject) => {
    if (fs.lstatSync(item).isDirectory())
        walk(item, function(err, results) {
            if (err) {
                reject(err);
            }
            console.log('results', results)
            resolve(results);
        });
    else {
        let results = [];
        ignorePlaftormFiles(item) && results.push({
            path: item,
            name: path.basename(item),
            extension: path.extname(item),
            malicious: isBadFile(path.extname(item)),
            master: isMasterFile(path.extname(item))
        });
        console.log('results', results)
        resolve(results)
    }
}))

win.focus();
return Promise.all(promises)
}

exports.getDefaultLocation = function() {
return __dirname
}