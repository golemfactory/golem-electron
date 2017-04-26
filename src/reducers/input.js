import { dict } from './../actions'
import { setConfig, getConfig, dictConfig } from './../utils/configStorage'
const {ipcRenderer} = window.require('electron')

const {SET_PREVIEW, SET_PREVIEW_EXPANDED, SET_AUTOLAUNCH, SET_ZOOM_RATIO} = dict
const {AUTOLUNCH_SWITCH, PREVIEW_SWITCH} = dictConfig

const initialState = {
    preview: getConfig(PREVIEW_SWITCH) || false,
    expandedPreview: false,
    autoLaunch: getConfig(AUTOLUNCH_SWITCH) || false,
    zoomRatio: null
}
const input = (state = initialState, action) => {
    switch (action.type) {
    case SET_PREVIEW:
        setConfig(PREVIEW_SWITCH, action.payload)
        ipcRenderer.send('preview-section', action.payload)
        return Object.assign({}, state, {
            preview: action.payload,
            expandedPreview: !action.payload && false
        });

    case SET_PREVIEW_EXPANDED:
        ipcRenderer.send('preview-expand-section', action.payload)
        return Object.assign({}, state, {
            expandedPreview: action.payload
        });

    case SET_AUTOLAUNCH:
        setConfig(AUTOLUNCH_SWITCH, action.payload)
        ipcRenderer.send('auto-launch-section', action.payload)
        return Object.assign({}, state, {
            autoLaunch: action.payload
        });

    case SET_ZOOM_RATIO:
        return Object.assign({}, state, {
            zoomRatio: action.payload
        });

    default:
        return state
    }
}

export default input