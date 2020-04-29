const path = require('path');
const { BrowserWindow } = require('electron');

const ipcHandler = require('../handler/ipc.js');
const log = require('../handler/debug.js');

const {
    APP_NAME,
    PREVIEW_APP_WIDTH,
    PREVIEW_APP_HEIGHT,
    PREVIEW_APP_MIN_WIDTH,
    PREVIEW_APP_MIN_HEIGHT,
    isDevelopment
} = require('../config/electron.js');

let previewWindow;

module.exports = function createPreviewWindow(id, frameCount) {
    return new Promise((resolve, reject) => {
        previewWindow = new BrowserWindow({
            title: APP_NAME,
            width: PREVIEW_APP_WIDTH,
            height: PREVIEW_APP_HEIGHT,
            minWidth: PREVIEW_APP_MIN_WIDTH,
            minHeight: PREVIEW_APP_MIN_HEIGHT,
            titleBarStyle: 'hiddenInset',
            //frame: false,
            resizable: true,

            center: true,
            show: true,
            backgroundColor: '#fff',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true
            }
        });

        previewWindow.once('ready-to-show', () => {
            win.show();
        });

        previewWindow.on('close', () => {
            previewWindow = null;
            ipcHandler.mapRemover(id);
        });

        /**
         * [This event emitted when the load failed or was cancelled]
         *
         * @see https://cs.chromium.org/chromium/src/net/base/net_error_list.h
         *
         * @description To see error codes meanings check url above.
         */
        previewWindow.webContents.on(
            'did-fail-load',
            (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
                log.warn(
                    'MAIN_PROCESS',
                    'PREVIEW LOAD FAILED',
                    errorCode,
                    errorDescription,
                    validatedURL,
                    isMainFrame
                );
            }
        );

        if (isDevelopment()) {
            let previewURL = `http://localhost:${process.env.PORT ||
                3002}/index.frame.html#/preview/${
                frameCount > 1 ? 'all' : 'single'
            }/${id}`;

            previewWindow.loadURL(previewURL);
        } else {
            let previewURL = `file://${path.resolve(__dirname, '..', '..')}/index.frame.html#/preview/${
                frameCount > 1 ? 'all' : 'single'
            }/${id}`;

            previewWindow.loadURL(previewURL);
        }
        resolve(previewWindow);
    });
};
