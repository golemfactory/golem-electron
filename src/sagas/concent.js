import { takeLatest, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {TOGGLE_CONCENT, UNLOCK_CONCENT_DEPOSIT, SET_CONCENT_SWITCH} = dict

export function unlockDepositConcent(session) {
    return new Promise((response, reject) => {

        function on_unlock(args) {
            let info = args[0];
            console.log("info", info)
        }
        
        _handleRPC(on_unlock, session, config.CONCENT_UNLOCK)
    })
}

/**
 * [*toggleConcentUnlockBase generator to unlock concent deposit]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* toggleConcentUnlockBase(session) {
    const action = yield call(unlockDepositConcent, session);
    //yield action && put(action)
}

export function toggleConcent(session, payload, toggleLock = false) {
    return new Promise((response, reject) => {

        function on_info(args) {
            let info = args[0]
            console.log("info", info)
            response({
                type: SET_CONCENT_SWITCH,
                payload: info
            })
        }

        function on_lock(args) {
            let lock = args[0];
            console.log("lock", lock);
            _handleRPC(on_info, session, payload ? config.CONCENT_ON_RPC : config.CONCENT_OFF_RPC)
        }
        
        _handleRPC(on_lock, session, toggleLock ? config.CONCENT_UNLOCK : config.CONCENT_RELOCK)
    })
}

/**
 * [*toggleConcentBase generator toggle concent feature]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* toggleConcentBase(session, {payload, toggleLock}) {
    const action = yield call(toggleConcent, session, payload);
    yield action && put(action)
}

export function* concentFlow(session, payload, toggleLock) {
    yield takeLatest(TOGGLE_CONCENT, toggleConcentBase, session)
    yield takeLatest(UNLOCK_CONCENT_DEPOSIT, toggleConcentUnlockBase, session)
}