import { dict } from './../actions'
const {ipcRenderer} = window.electron

const {SET_BALANCE, SET_TASKLIST, SET_CONNECTED_PEERS, SET_GOLEM_STATUS, SET_FOOTER_INFO} = dict

const initialState = {
    balance: [0, 0],
    taskList: [],
    connectedPeers: 0,
    peerInfo: [],
    golemStatus: {
        status: 'Not Ready',
        message: 'Not connected'
    },
    footerInfo: null
}

let badgeActive = false
let badgeTemp = 0


function nodesString(num) {
    if (num < 1) return 'No Nodes Connected';
    const postfix = num != 1 ? 's' : '';
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
        return Object.assign({}, state, {
            peerInfo: action.payload,
            connectedPeers: action.payload.length,
            golemStatus: {
                status: 'Ready',
                message: nodesString(action.payload.length),
            }
        });

    case SET_GOLEM_STATUS:
        if (state.golemStatus.status == 'Exception')
            return state;
        return Object.assign({}, state, {
            golemStatus: Object.assign(
                {}, state.golemStatus, action.payload
            )
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