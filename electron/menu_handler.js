const {app, Menu, globalShortcut} = require('electron')
const {getConfig, setConfig, dictConfig} = require('./config_storage.js')
const {DEBUG_MODE, DEVELOPER_MODE} = dictConfig
const DOCLINK = "https://docs.golem.network/"
let isDebugMode = !getConfig(DEBUG_MODE)
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

    // Edit menu
    template[1].submenu = [{
        type: 'separator'
    },
        {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        }]

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
