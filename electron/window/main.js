const path = require('path');
const { app, BrowserWindow, Menu, shell } = require('electron');

const createPreviewWindow = require('./preview.js');
const ipcHandler = require('../handler/ipc.js');
const log = require('../handler/debug.js');
const menuHandler = require('../handler/menu.js');

const {
    APP_NAME,
    APP_WIDTH,
    APP_HEIGHT,
    APP_MIN_HEIGHT,
    isDevelopment
} = require('../config/electron.js');
/**
 * [createWindow Creating browserWindow with given options]
 * @return
 */
module.exports = function createMainWindow(win, tray, closeCallback) {
    return new Promise((resolve, reject) => {
        win = new BrowserWindow({
            title: APP_NAME,
            width: APP_WIDTH,
            height: APP_HEIGHT,
            titleBarStyle: 'hiddenInset',
            frame: true,
            resizable: true,
            minWidth: APP_WIDTH,
            minHeight: APP_MIN_HEIGHT,
            maxWidth: APP_WIDTH,
            center: true,
            show: false,
            backgroundColor: '#fff',
            webPreferences: {
                webSecurity: false
            }
        });

        const instanceLock = app.requestSingleInstanceLock();
        app.on('second-instance', function(commandLine, workingDirectory) {
            // Someone tried to run a second instance, we should focus our primary window.
            if (win) {
                if (win.isMinimized()) win.restore();
                win.focus();
            }
        });

        if (!instanceLock) {
            setImmediate(() => app.exit(0));
            return;
        }

        win.webContents.on('will-navigate', (event, url) => {
            event.preventDefault();
            if (
                url.includes('http') &&
                (url.includes('etherscan') || url.includes('golem'))
            )
                shell.openExternal(url);
        });

        win.once('ready-to-show', () => {
            ipcHandler(
                app,
                tray,
                win,
                createPreviewWindow,
                APP_WIDTH,
                APP_HEIGHT
            );
            Menu.setApplicationMenu(menuHandler);
            win.show();
            resolve(win);
        });

        /**
         * [This event emitted when the load failed or was cancelled]
         *
         * @see https://cs.chromium.org/chromium/src/net/base/net_error_list.h
         *
         * @description To see error codes meanings check url above.
         */
        win.webContents.on(
            'did-fail-load',
            (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
                log.warn(
                    'MAIN_PROCESS',
                    'MAIN LOAD FAILED',
                    errorCode,
                    errorDescription,
                    validatedURL,
                    isMainFrame
                );
            }
        );

        if (isDevelopment()) {
            win.loadURL(`http://localhost:${process.env.PORT || 3002}/`);
        } else {
            win.loadURL(`file://${path.resolve(__dirname, '..', '..')}/index.html`);
        }

        // Do not update window title after loading pages
        win.on('page-title-updated', event => event.preventDefault());

        win.on('closed', () => {
            closeCallback();
            ipcHandler.ipcRemover();
        });

        win.on('close', () => {
            closeCallback();
        });
    });
};
