const electron = require('electron')
const {app, BrowserWindow, Tray, Menu, ipcMain} = electron
const chalk = require('chalk')
const fs = require("fs")
const connect = require('connect');
const serveStatic = require('serve-static');
const compression = require('compression')

const setupGolem = require('./setup_golem.js')

function isDevelopment() {
    return process.env.NODE_ENV === 'development'
}

const APP_NAME = isDevelopment() ? 'GOLEM GUI (development)' : 'GOLEM GUI'
const APP_WIDTH = 460
const APP_HEIGHT = 520

let win
let previewWin
let tray

/**
 * [onReady init function for electron]
 * @return
 */
function onReady() {
    if (isDevelopment()) {
        installDevExtensions()
    }
    setupGolem.installation()
    createWindow()
    createTray()
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
        maxWidth: 810,
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
    win.once('ready-to-show', () => {
        win.show()
    })

    if (isDevelopment()) {
        win.loadURL(`http://localhost:${process.env.PORT || 3002}/`)
    } else {
        // Load prod build
        let app = connect()
        app.use(compression())
        app.use(serveStatic(__dirname)).listen(3003, function() {
            win.loadURL(`http://localhost:${process.env.PORT || 3003}/`)
        });
    //win.loadURL(`file://${__dirname}/index.html`)
    }

    // Do not update window title after loading pages
    win.on('page-title-updated', (event) => event.preventDefault())

    win.on('closed', () => {
        win = null
    })
}

/**
 * [createTray Creating system tray with given options]
 * @return 
 */
function createTray() {
    tray = new Tray('./src/assets/img/golem-tray.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Dashboard',
            type: 'radio',
            checked: true
        },
        {
            label: 'Tasks',
            type: 'radio'
        },
        {
            label: 'Account',
            type: 'radio'
        },
        {
            label: 'Settings',
            type: 'radio'
        },
        {
            label: 'Quit',
            click: function() {
                app.isQuiting = true;
                app.quit();
            }
        }
    ])
    tray.setToolTip('Golem Application.')
    tray.setContextMenu(contextMenu)
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

ipcMain.on('amount-updated', (event, amount) => {
    const time = new Date().toLocaleTimeString()

    tray.setTitle(`GNT${amount}`)
    tray.setToolTip(`at ${time}`)

})

ipcMain.on('set-badge', (event, counter) => {
    app.setBadgeCount(counter)
})

/**
 * [When preview expanding switched on from renderer side, this event resizing the window]
 * @param  {String}     'preview-section'       key of the ipc broadcast
 * @param  {[type]}     (event, checked)
 * @return nothing
 *
 * MUST CHECK LAGGY RESIZING
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=531831
 * @see https://github.com/electron/electron/issues/3615
 */
ipcMain.on('preview-expand-section', (event, checked) => {
    if (checked && (!previewWin || previewWin.isDestroyed())) {
        win.setContentSize(700, APP_HEIGHT, true)
    } else {
        win.setContentSize(APP_WIDTH, APP_HEIGHT, true)
    }
})

ipcMain.on('preview-section', (event, checked) => {
    if (checked && (!previewWin || previewWin.isDestroyed())) {
        win.setContentSize(APP_WIDTH, 810, true)

    } else {
        win.setContentSize(APP_WIDTH, APP_HEIGHT, true)
    }
})
