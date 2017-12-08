import { shallow, render, mount } from 'enzyme';
global.shallow = shallow;
global.render = render;
global.mount = mount;

global.window.require = function () {
  return {
    ipcRenderer: {
      send: function () {
        // Fake sending message to ipcMain
      }
    },
    webFrame: {
        setZoomLevelLimits: function () {}
    },
    remote: {
        require: function () {
            return {
                        getDefaultLocation: function () {},
                        selectDirectory: function () {
                            return new Promise((res, rej) => {})
                        }
                    }
        },
        getGlobal: function () {
            return {
                setConfig: function () {},
                getConfig: function () {},
                dictConfig: function () {},
                configStore: {
                    onDidChange: function () {}
                }
            }
        },
        dialog: {
            showOpenDialog: function () {}
        },
        BrowserWindow: function () {}
    }
  }
};

global.window.electron = {
        remote: {
            require: function () {
                return {
                        getDefaultLocation: function () {},
                        selectDirectory: function () {
                            return new Promise((res, rej) => {})
                        }
                    }
            },
            getGlobal: function () {
                return {
                    setConfig: function () {},
                    getConfig: function () {},
                    dictConfig: function () {},
                    configStore: {
                        onDidChange: function () {}
                    }
                }
            },
            dialog: {
                showOpenDialog: function () {}
            },
            BrowserWindow: function () {}
        },
        ipcRenderer: {
           send: function () {
               // Fake sending message to ipcMain
           }
        },
        clipboard: {
            writeText: function () {}
        },
        webFrame: {
            setZoomLevelLimits: function () {}
        }
}
// Skip createElement warnings but fail tests on any other warning
/*console.error = message => {
    if (!/(React.createElement: type should not be null)/.test(message)) {
        throw new Error(message);
    }
};*/