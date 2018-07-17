import raf from './polyfills'
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.toJson = toJson;

// Fail tests on any warning
console.error = message => {
   throw new Error(message);
};

global.window.require = function () {
  return {
    ipcRenderer: {
      send: function () {
        // Fake sending message to ipcMain
      }
    },
    webFrame: {
        setZoomLevelLimits: function () {},
        setVisualZoomLevelLimits: function () {}
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
                },
                env:{
                    NODE_ENV: function () {}
                }
            }
        },
        dialog: {
            showOpenDialog: function () {}
        },
        BrowserWindow: function () {},
        app: {
            getVersion: function () {}
        },
        process:{
            argv: {
                includes: function(){}
            }
        }
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
            app: {
                getVersion: function () {}
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
            setZoomLevelLimits: function () {},
            setVisualZoomLevelLimits: function () {}

        }
}
// Skip createElement warnings but fail tests on any other warning
/*console.error = message => {
    if (!/(React.createElement: type should not be null)/.test(message)) {
        throw new Error(message);
    }
};*/