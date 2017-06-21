const electron = require('electron')
const {app, ipcMain} = electron


function ipcHandler(app, tray, win, createPreviewWindow, APP_WIDTH, APP_HEIGHT) {

    // ipcMain.on('amount-updated', (event, amount) => {
    //     const time = new Date().toLocaleTimeString()

    //     tray.setTitle(`GNT${amount}`)
    //     tray.setToolTip(`at ${time}`)

    // })

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
    ipcMain.on('preview-screen', (event, {isScreenOpen, id, frameCount}) => {
        if (isScreenOpen /*&& (!previewWin || previewWin.isDestroyed())*/ ) {
            //win.setContentSize(700, APP_HEIGHT, true)
            createPreviewWindow(id, frameCount)
            console.log("ID", id, "FRAME COUNT", frameCount)
        }
    })

    ipcMain.on('preview-switch', (event, checked) => {
        if (checked /*&& (!previewWin || previewWin.isDestroyed())*/ ) {
            win.setContentSize(APP_WIDTH, 810, true)

        } else {
            win.setContentSize(APP_WIDTH, APP_HEIGHT, true)
        }
    })

}

module.exports = ipcHandler;