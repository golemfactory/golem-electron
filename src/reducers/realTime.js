import { dict } from './../actions'
const {ipcRenderer} = window.require('electron')

const {SET_MESSAGE, SET_BLENDER} = dict

const initialState = {
    message: '',
    blender: []
}

let badgeActive = false
let badgeTemp = 0

const realTime = (state = initialState, action) => {
    switch (action.type) {
    case SET_MESSAGE:
        state.message = action.message
        return Object.assign({}, state, {
            message: action.message
        });

    case SET_BLENDER:
        let badge = 0
        state.blender = action.blender
        action.blender && action.blender.forEach((item) => {
            item.status === 'In Progress' && (badge = badge + 1)
        })
        if (badge !== badgeTemp) {
            ipcRenderer.send('set-badge', badge)
            badgeTemp = badge
            badgeActive || (badgeActive = true)
        } else if (badge === 0 && badgeActive) {
            ipcRenderer.send('set-badge', 0)
            badgeActive = false
        }
        return Object.assign({}, state, {
            blender: action.blender
        });

    default:
        return state
    }
}

export default realTime