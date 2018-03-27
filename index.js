const electron = require('electron')
const {app, BrowserWindow, Menu, ipcMain} = electron
const chalk = require('chalk')
const fs = require("fs")
var path = require('path')
var mkdirp = require('mkdirp');
const semver = require('semver')

//require('electron-debug')({showDevTools: true, enabled: true});

/*
 * Application tray can be additional feature for the future.
 */
//const createTray = require('./electron/tray_handler.js')

const log = require('./electron/debug_handler.js')
const menuHandler = require('./electron/menu_handler.js')
const ipcHandler = require('./electron/ipc_handler.js')
const golemHandler = require('./electron/golem_handler.js')

function isDevelopment() {
    return process.env.NODE_ENV === 'development'
}

const APP_NAME = isDevelopment() ? 'GOLEM GUI (development)' : 'GOLEM GUI'
const APP_WIDTH = 460
const APP_HEIGHT = 810//589
const APP_MIN_HEIGHT = 589
const PREVIEW_APP_WIDTH = 752
const PREVIEW_APP_HEIGHT = 572

let win
let previewWindow
let tray

// if(isDevelopment()){
//     require('electron-reload')(path.join(__dirname));
// }

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

    golemHandler(app)
}

function quit() {
    if (app.golem)
        app.golem.stopProcess()
            .then(app.quit, app.quit);
    else
        app.quit();
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
                log.warn('MAIN_PROCESS > REACT_DEVELOPER_TOOLS', err)
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
                log.warn('MAIN_PROCESS > REDUX_DEVTOOLS', err)
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
        frame: true,
        resizable: true,
        minWidth: APP_WIDTH,
        minHeight: APP_MIN_HEIGHT,
        maxWidth: APP_WIDTH,
        center: true,
        show: false,
        backgroundColor: '#fff',
        "webPreferences": {
            "webSecurity": false
        }
    })




    var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
      // Someone tried to run a second instance, we should focus our primary window.
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
      }
    });

    if (shouldQuit) {
      app.quit();
      return;
    }

    /*
        win.webContents.on('did-finish-load', function() {
            setTimeout(function() {
                win.show();
            }, 40);
        });
    */
    win.webContents.on('will-navigate', (event, url) => {
        event.preventDefault()
        if (url.includes('http') && (url.includes('etherscan') || url.includes('golem')))
            electron.shell.openExternal(url);
    })


    win.once('ready-to-show', () => {
        ipcHandler(app, tray, win, createPreviewWindow, APP_WIDTH, APP_HEIGHT)
        Menu.setApplicationMenu(menuHandler)
        win.show()
    })

    /**
     * [This event emitted when the load failed or was cancelled]
     *
     * @see https://cs.chromium.org/chromium/src/net/base/net_error_list.h
     *
     * @description To see error codes meanings check url above.
     */
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        log.warn('MAIN_PROCESS', 'MAIN LOAD FAILED', errorCode, errorDescription, validatedURL, isMainFrame)
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

    win.on('close', () => {
        win = null;
        ipcHandler.ipcRemover()
    });
}

app.on('ready', onReady)

app.on('window-all-closed', () => {
    if (process.platform != 'darwin')
        quit();
});
app.on('before-quit', () => {
    if (process.platform == 'darwin')
        quit();
});

app.on('will-navigate', ev => {
    ev.preventDefault()
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})


function createPreviewWindow(id, frameCount) {
    return new Promise((resolve, reject) => {
        previewWindow = new BrowserWindow({
            title: APP_NAME,
            width: PREVIEW_APP_WIDTH,
            height: PREVIEW_APP_HEIGHT,
            //titleBarStyle: 'hidden-inset',
            frame: false,
            resizable: false,
            center: true,
            show: true,
            backgroundColor: '#fff',
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

        previewWindow.on('close', () => {
            previewWindow = null
            ipcHandler.mapRemover(id)
        })


        /**
         * [This event emitted when the load failed or was cancelled]
         *
         * @see https://cs.chromium.org/chromium/src/net/base/net_error_list.h
         *
         * @description To see error codes meanings check url above.
         */
        previewWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
            log.warn('MAIN_PROCESS', 'PREVIEW LOAD FAILED', errorCode, errorDescription, validatedURL, isMainFrame)
        })

        if (isDevelopment()) {
            let previewURL = `http://localhost:${process.env.PORT || 3003}#/preview/${frameCount > 1 ? 'all' : 'single' }/${id}`
            previewWindow.loadURL(previewURL)
        } else {
            let previewURL = `file://${__dirname}/index.frame.html#/preview/${frameCount > 1 ? 'all' : 'single' }/${id}`
            previewWindow.loadURL(previewURL)
        //win.loadURL(`file://${__dirname}/index.html`)
        }
        resolve(previewWindow)
    })
}

function isWin(){
    return process.platform === "win32"
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
                file = isWin() ? `${dir}\\${file}` : `${dir}/${file}`;
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
            resolve(results)
        }
    }))

    win.focus();
    return Promise.all(promises)
}


function createLocationPath(_dir){
    return mkdirp.sync(_dir)
}

exports.getDefaultLocation = function() {

    const _location = isWin() ? `${process.env.USERPROFILE}\\Documents` : `${process.env.HOME}/Documents`;

    if (!fs.existsSync(_location))
        return createLocationPath(_location)
    return _location
}

exports.checkUpdate = function(_old, _new){
    return semver.diff(_new, _old)
}
