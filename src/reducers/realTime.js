import { dict } from './../actions'
const {ipcRenderer} = window.require('electron')

const {SET_BALANCE, SET_TASKLIST, SET_CONNECTED_PEERS, SET_GOLEM_STATUS, SET_FOOTER_INFO} = dict

const initialState = {
    balance: [0, 0],
    taskList: [],
    connectedPeers: 0,
    golemStatus: {
        status: 'Not Ready',
        message: 'Not connected'
    },
    footerInfo: null
}

let badgeActive = false
let badgeTemp = 0


function nodesString(num) {
    let postfix = num != 1 ? 's' : '';
    return `${num} Node${postfix}`;
}


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
        let update = {
            connectedPeers: action.payload
        };

        if (update.connectedPeers)
            update.golemStatus = {
                status: 'Ready',
                message: nodesString(update.connectedPeers),
        }

        return Object.assign({}, state, update);

    case SET_GOLEM_STATUS:
        let golemStatus;

        if (state.connectedPeers)
            golemStatus = nodesString(state.connectedPeers);
        else
            golemStatus = action.payload;

        return Object.assign({}, state, {
            golemStatus
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