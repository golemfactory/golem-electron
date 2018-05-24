import {BigNumber} from 'bignumber.js';
import { dict } from './../actions'
const {ipcRenderer} = window.electron

const {
        SET_BALANCE, 
        SET_TASKLIST, 
        SET_CONNECTED_PEERS, 
        SET_GOLEM_STATUS, 
        SET_FOOTER_INFO, 
        SET_PASSWORD_MODAL, 
        SET_PASSWORD
    } = dict

const initialState = {
    balance: [
        new BigNumber(0), 
        new BigNumber(0), 
        null,
        null,
        new BigNumber(0).toString(), 
        new BigNumber(0).toString() 
    ],
    taskList: [],
    connectedPeers: 0,
    peerInfo: [],
    golemStatus: {
        status: 'Not Ready',
        message: 'Not connected'
    },
    footerInfo: null,
    passwordModal: { 
        status: false, 
        register: false
    },
    lockStatus: false
}

const password = {
    REGISTER: "Requires new password",
    LOGIN: "Requires password"
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

    case SET_PASSWORD:
        return Object.assign({}, state, {
            lockStatus: true
        })

    case SET_GOLEM_STATUS:
        let _isPasswordModalPopped = false
        let changedState = {
            golemStatus: Object.assign(
                {}, state.golemStatus, action.payload
            )
        }
        if (state.golemStatus.status == 'Exception')
            return state;

        if(!state.lockStatus){
            if(action.payload.message === password.REGISTER && !_isPasswordModalPopped){
                changedState = {...changedState, passwordModal: { status: true, register: true}}
                _isPasswordModalPopped = true
            } 
            else if(action.payload.message === password.LOGIN && !_isPasswordModalPopped){
                changedState = {...changedState, passwordModal: { status: true, register: false}}
                _isPasswordModalPopped = true
            }
        }

        return Object.assign({}, state, changedState);

    case SET_PASSWORD_MODAL:
        return Object.assign({}, state, {
            passwordModal: Object.assign({}, state.passwordModal, {
                ...action.payload
            })
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