const { app } = require('electron');

let win;
let tray;

const golemHandler = require('./handler/golem.js');

const createMainWindow = require('./window/main.js');
const installDevExtensions = require('./handler/extensions.js');
const { isDevelopment, isLinux, isMac, isWin } = require('./config/electron.js');

/**
 * [onReady init function for electron]
 * @return
 */
function onReady() {
    if (isDevelopment()) {
        installDevExtensions();
    }
    createMainWindow(win, tray, closeCallback).then(_win => (exports.mainWindow = win = _win));
    // tray = createTray(win)
    golemHandler(app);
}

function closeCallback() {
    win = null;
}

function quit() {
    if (app.golem && !isWin())
        app.golem.stopProcess().then(app.quit, app.quit);
    else app.quit();
}

// Hardware acceleration is disabled for Linux machines as work around, electron apps hangs mostly on Linux 18.04
if (isLinux()) {
    app.disableHardwareAcceleration();
}

app.on('ready', onReady);

app.on('window-all-closed', () => {
    if (!isMac()) quit();
});
app.on('before-quit', () => {
    if (!isMac()) quit();
});

app.on('will-navigate', ev => {
    ev.preventDefault();
});

app.on('activate', () => {
    if (win === null) {
        createMainWindow(win, tray, closeCallback).then(_win => (exports.mainWindow = win = _win));
    }
});
