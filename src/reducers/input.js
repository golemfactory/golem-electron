import { dict } from './../actions'
const {remote, ipcRenderer} = window.electron
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {SET_PREVIEW_RADIO, SET_PREVIEW_EXPANDED, SET_AUTOLAUNCH, SET_ZOOM_RATIO, TOGGLE_DEVELOPER_MODE} = dict
const {AUTOLUNCH_SWITCH, PREVIEW_SWITCH, DEVELOPER_MODE} = dictConfig

const initialState = {
    preview: getConfig(PREVIEW_SWITCH) || false,
    expandedPreview: false,
    autoLaunch: getConfig(AUTOLUNCH_SWITCH) || false,
    zoomRatio: null,
    developerMode: getConfig(DEVELOPER_MODE) || false
}
const input = (state = initialState, action) => {
    switch (action.type) {
    case SET_PREVIEW_RADIO:
        setConfig(PREVIEW_SWITCH, action.payload)
        ipcRenderer.send('preview-switch', action.payload)
        return Object.assign({}, state, {
            preview: action.payload,
            expandedPreview: !action.payload && false
        });

    case SET_PREVIEW_EXPANDED:
        ipcRenderer.send('preview-screen', {
            ...action.payload
        })
        return Object.assign({}, state, {
            expandedPreview: action.payload.isScreenOpen
        });

    case SET_AUTOLAUNCH:
        setConfig(AUTOLUNCH_SWITCH, action.payload)
        return Object.assign({}, state, {
            autoLaunch: action.payload
        });

    case SET_ZOOM_RATIO:
        return Object.assign({}, state, {
            zoomRatio: action.payload
        });

    case TOGGLE_DEVELOPER_MODE:
        return Object.assign({}, state, {
            developerMode: action.payload
        });

    default:
        return state
    }
}

export default input