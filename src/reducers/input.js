import { dict } from './../actions'
import { setConfig, getConfig } from './../utils/configStorage'
const {ipcRenderer} = window.require('electron')

const {SET_PREVIEW, SET_PREVIEW_EXPANDED, SET_AUTOLAUNCH, SET_ZOOM_RATIO} = dict

const initialState = {
    preview: getConfig('previewSwitch') || false,
    expandedPreview: false,
    autoLaunch: getConfig('autoLaunchSwitch') || false,
    zoomRatio: null
}
const input = (state = initialState, action) => {
    switch (action.type) {
    case SET_PREVIEW:
        setConfig('previewSwitch', action.payload)
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
        setConfig('autoLaunchSwitch', action.payload)
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