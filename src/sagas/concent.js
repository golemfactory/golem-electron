import { fork, takeLatest, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {TOGGLE_CONCENT, UNLOCK_CONCENT_DEPOSIT, SET_CONCENT_SWITCH} = dict

export function fectConcentStatus(session) {
    return new Promise((response, reject) => {

        function on_info(args) {
            let info = args[0];
            response({
                type: SET_CONCENT_SWITCH,
                info
            })
        }
        
        _handleRPC(on_info, session, config.CONCENT_SWITCH_STATUS_RPC)
    })
}

/**
 * [*toggleConcentUnlockBase generator to unlock concent deposit]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* fetchConcentStatusBase(session) {
    const action = yield call(fectConcentStatus, session);
    //yield action && put(action)
}

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

export function toggleConcent(session, {payload, informRPC, toggleLock = false}) {
    return new Promise((response, reject) => {

        if(!informRPC)

            response({
                type: SET_CONCENT_SWITCH,
                payload
            })

        else {
            
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
                _handleRPC(on_info, session, config.CONCENT_SWITCH_RPC, [payload])
            }
            
            _handleRPC(on_lock, session, toggleLock ? config.CONCENT_UNLOCK : config.CONCENT_RELOCK)



            console.log("RPC informed")
        }
    })
}

/**
 * [*toggleConcentBase generator toggle concent feature]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* toggleConcentBase(session, payload) {
    const action = yield call(toggleConcent, session, payload);
    yield action && put(action)
}

export function* concentFlow(session, payload) {
    yield fork(fetchConcentStatusBase, session)
    yield takeLatest(TOGGLE_CONCENT, toggleConcentBase, session)
    yield takeLatest(UNLOCK_CONCENT_DEPOSIT, toggleConcentUnlockBase, session)
}