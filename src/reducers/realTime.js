import {BigNumber} from 'bignumber.js';
import createCachedSelector from 're-reselect';
import { dict } from './../actions'
import checkNested from './../utils/checkNested'
const {ipcRenderer, remote} = window.electron
const log = remote.require('./electron/debug_handler.js')

const {
        SET_BALANCE, 
        SET_TASKLIST, 
        SET_FOOTER_INFO, 
        SET_CONCENT_DEPOSIT_BALANCE
    } = dict

const initialState = {
    balance: [
        new BigNumber(0), 
        new BigNumber(0), 
        null,
        null,
        new BigNumber(0).toString(), 
        new BigNumber(0).toString(),
        new BigNumber(0).toString()
    ],
    concentBalance: null,
    taskList: [],
    peerInfo: [],
    footerInfo: null,
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

    case SET_FOOTER_INFO:
        return Object.assign({}, state, {
            footerInfo: action.payload
        });

    case SET_CONCENT_DEPOSIT_BALANCE:
        const {value, status, timelock} = action.payload
        return Object.assign({}, state, {
            concentBalance: action.payload
        });

    default:
        return state
    }
}

export default realTime

export const concentDepositStatusSelector = createCachedSelector(
    (state) => state.concentBalance,
    (state, key) => key,
    (concentBalance, key) => {
        if(concentBalance){
            switch (concentBalance.status) {
                case "unlocking": return { statusCode: 2, time: concentBalance.timelock}
                case "unlocked" : return { statusCode: 1, time: null}
                default         : return { statusCode: 0, time: null} //locked
            }
        }
        return { statusCode: 0, time: null}
    })(
        (state, key) => key // Cache selectors by type name
    )
