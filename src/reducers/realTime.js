import { dict } from './../actions'
const {ipcRenderer} = window.require('electron')

const {SET_BALANCE, SET_TASKLIST, SET_CONNECTED_PEERS, SET_FOOTER_INFO} = dict

const initialState = {
    balance: [Number(0), Number(0)],
    taskList: [],
    connectedPeers: Number(0), //Number added for preserve 0 case, otherwise js will behave it like boolean
    footerInfo: null
}

let badgeActive = false
let badgeTemp = 0

const realTime = (state = initialState, action) => {
    switch (action.type) {
    case SET_BALANCE:
        return Object.assign({}, state, {
            balance: action.payload
        });

    case SET_TASKLIST:
        let badge = 0
        action.payload && action.payload.forEach((item) => {
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
            taskList: action.payload
        });

    case SET_CONNECTED_PEERS:
        return Object.assign({}, state, {
            connectedPeers: action.payload
        });

    case SET_FOOTER_INFO:
        return Object.assign({}, state, {
            footerInfo: action.payload
        });

    default:
        return state
    }
}

export default realTime