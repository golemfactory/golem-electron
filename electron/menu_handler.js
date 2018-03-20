const {app, Menu, globalShortcut} = require('electron')
const {getConfig, setConfig, dictConfig} = require('./config_storage.js')
const {DEBUG_MODE, DEVELOPER_MODE} = dictConfig
const DOCLINK = "https://docs.golem.network/"

let debugMode = getConfig(DEBUG_MODE)

if (debugMode === undefined || debugMode === null) {
    debugMode = true
    setConfig(DEBUG_MODE, true)
    console.log(getConfig(DEBUG_MODE))
}
let isDebugMode = debugMode

let isDeveloperMode = getConfig(DEVELOPER_MODE)
const template = [
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    require('electron').shell.openExternal(DOCLINK)
                }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
}

//View menu
template[2].submenu.push({
    label: 'Debug mode',
    type: 'checkbox',
    checked: isDebugMode,
    accelerator: 'CmdOrCtrl+Shift+L',
    click: () => {
        isDebugMode = !isDebugMode
        setConfig(DEBUG_MODE, isDebugMode)
        console.info('!', `Debug mode ${isDebugMode ? 'started.' : 'stopped.'}`);
    }
})

template[2].submenu.push({
    label: 'Developer mode',
    type: 'checkbox',
    checked: isDeveloperMode,
    accelerator: 'CmdOrCtrl+Shift+D',
    click: () => {
        isDeveloperMode = !isDeveloperMode
        setConfig(DEVELOPER_MODE, isDeveloperMode)
        console.info('!', `Developer mode ${isDeveloperMode ? 'started.' : 'stopped.'}`);
    }
})


    // template[2].submenu.push({
    //     label: 'Use Local Geth',
    //     type: 'checkbox',
    //     checked: isLocalGeth,
    //     accelerator: 'CmdOrCtrl+Shift+G',
    //     click: () => {
    //         isLocalGeth = !isLocalGeth
    //         setConfig(LOCAL_GETH, isLocalGeth)
    //         console.info('!', `Local Geth ${isLocalGeth ? 'activated.' : 'deactivated.'}`);
    //     }
    // })

// Window menu
template[3].submenu = [
    {
        role: 'close'
    },
    {
        role: 'minimize'
    },
    {
        type: 'separator'
    },
    {
        role: 'front'
    }
]

const menu = Menu.buildFromTemplate(template)
module.exports = menu
