const { app, Tray, Menu } = require('electron');
/**
 * [createTray Creating system tray with given options]
 * @return
 */
function createTray(win) {
    tray = new Tray('./src/assets/img/golem-tray.png');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Dashboard',
            type: 'radio',
            checked: true,
            click: _clickHandler.bind(null, '', win)
        },
        {
            label: 'Tasks',
            type: 'radio',
            click: _clickHandler.bind(null, 'tasks', win)
        },
        {
            label: 'Account',
            type: 'radio',
            click: _clickHandler.bind(null, 'settings', win)
        },
        {
            label: 'Settings',
            type: 'radio',
            click: _clickHandler.bind(null, 'settings', win)
        },
        {
            label: 'Quit',
            click: function() {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setToolTip('Golem Application.');
    tray.setContextMenu(contextMenu);

    return tray;
}

function _clickHandler(route, win) {
    //console.log(route, win)
    let contents = win.webContents;
    contents.send('REDIRECT_FROM_TRAY', `/${route}`);
    win.show();
    // win.loadURL(`http://localhost:${process.env.PORT || 3002}/${route}`)
    // win.show();
}

module.exports = createTray;
