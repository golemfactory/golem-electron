const electron = require('electron');
var path = require('path');
const { app, ipcMain, shell } = electron;
const log = require('./debug_handler.js');
const { DATADIR } = require('./golem_config.js');

let openedWindowsMap = null;
function ipcHandler(
    app,
    tray,
    win,
    createPreviewWindow,
    APP_WIDTH,
    APP_HEIGHT
) {
    openedWindowsMap = new Map();

    // ipcMain.on('amount-updated', (event, amount) => {
    //     const time = new Date().toLocaleTimeString()

    //     tray.setTitle(`GNT${amount}`)
    //     tray.setToolTip(`at ${time}`)

    // })

    ipcMain.on('set-badge', (event, counter) => {
        app.setBadgeCount(counter);
    });

    ipcMain.on('open-file', (event, filePath, openParentFolder = false) => {
        filePath = path.normalize(filePath);
        openParentFolder
            ? shell.showItemInFolder(filePath)
            : shell.openItem(filePath);
    });

    ipcMain.on('open-logs', event => {
        shell.openItem(path.join(DATADIR, 'logs'));
    });

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
    ipcMain.on('preview-screen', (event, { isScreenOpen, id, frameCount }) => {
        if (isScreenOpen /*&& (!previewWin || previewWin.isDestroyed())*/) {
            //win.setContentSize(700, APP_HEIGHT, true)
            if (openedWindowsMap.has(id)) {
                let pWindow = openedWindowsMap.get(id);
                pWindow.show();
            } else {
                createPreviewWindow(id, frameCount).then(previewWindow => {
                    openedWindowsMap.set(id, previewWindow);
                });
            }
            console.log('ID', id, 'FRAME COUNT', frameCount);
        }
    });

    ipcMain.on('preview-switch', (event, checked) => {
        let currentAppSize = win.getSize();
        if (checked) {
            if (currentAppSize[1] < 810) {
                win.setContentSize(APP_WIDTH, 810, true);
            }
        } else {
            win.setContentSize(APP_WIDTH, APP_HEIGHT, true);
        }
    });

    console.info('IPC Handlers created.');
}

function ipcRemover() {
    ipcMain.removeAllListeners('preview-switch');
    ipcMain.removeAllListeners('preview-screen');
    ipcMain.removeAllListeners('set-badge');
    ipcMain.removeAllListeners('open-file');
    ipcMain.removeAllListeners('open-logs');
    console.info('IPC Listeners destroyed.');
}

function mapRemover(id) {
    openedWindowsMap.delete(id);
    console.info(id, 'deleted from map.');
}

ipcHandler.ipcRemover = ipcRemover.bind();
ipcHandler.mapRemover = mapRemover.bind();

module.exports = ipcHandler;
