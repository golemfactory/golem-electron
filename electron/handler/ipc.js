const electron = require('electron');
var path = require('path');
const { app, ipcMain, shell, Notification } = electron;
const log = require('./debug.js');
const { DATADIR } = require('../config/golem.js');
const PortCheck = require('../utils/check_port.js');

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

  ipcMain.on('notify', (event, messageObject) => {
    const notification = new Notification({
      icon: path.join(__dirname, '..', '..', 'build', 'icon.ico'),
      timeoutType: 'never',
      ...messageObject
    });
    const { open, click } = messageObject;
    if (open || click) {
      notification.addListener('click', () => {
        if (open) {
          try {
            shell.openExternal(open);
          } catch (e) {
            new Error('Error ', e);
          }
        } else if (click) {
          event.sender.webContents.send('notify-click', true);
        }
      });
    }

    notification.show();
  });

  ipcMain.on('check-port', (event, ip, ports) => {
    if (!ip) {
      throw Error('No IP value provided');
    }
    if (!ports || ports.length !== 3) {
      throw Error('There should be 3 port numbers in the list');
    }
    let checker = new PortCheck({
      timeout: 500,
      getBanner: 512
    });

    checker
      .check(ip, 3333)
      .check(ip, ports[1])
      .check(ip, ports[2])
      .on('done', (ip, port, result) => {
        event.sender.webContents.send('check-port-answer', true);
      });
  });

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

  ipcMain.on('redirect-wallet', function(event) {
    win.webContents.send('redirect-wallet');
    win.focus();
  });

  ipcMain.on('graceful-shutdown', function(event, flag = false) {
    global.isGracefulShutdown = !!flag;
  });

  ipcMain.on('close-me', function(event) {
    global.isGracefulShutdown = false;
    app.quit();
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
  ipcMain.removeAllListeners('graceful-shutdown');
  ipcMain.removeAllListeners('preview-switch');
  ipcMain.removeAllListeners('preview-screen');
  ipcMain.removeAllListeners('check-port');
  ipcMain.removeAllListeners('set-badge');
  ipcMain.removeAllListeners('open-file');
  ipcMain.removeAllListeners('open-logs');
  ipcMain.removeAllListeners('close-me');
  ipcMain.removeAllListeners('notify');
  console.info('IPC Listeners destroyed.');
}

function mapRemover(id) {
  openedWindowsMap.delete(id);
  console.info(id, 'deleted from map.');
}

ipcHandler.ipcRemover = ipcRemover.bind();
ipcHandler.mapRemover = mapRemover.bind();

module.exports = ipcHandler;
