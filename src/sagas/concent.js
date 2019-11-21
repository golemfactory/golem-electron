import { fork, takeLatest, call, put, select } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {TOGGLE_CONCENT, TOGGLE_CONCENT_REQUIRED, UNLOCK_CONCENT_DEPOSIT, SET_CONCENT_SWITCH, SET_CONCENT_REQUIRED_SWITCH} = dict

export function fetchConcentRequiredStatus(session) {
    return new Promise((response, reject) => {

        function on_info(args) {
            let info = args[0];
            response({
                type: SET_CONCENT_REQUIRED_SWITCH,
                payload: info
            })
        }
        
        _handleRPC(on_info, session, config.CONCENT_REQUIRED_SWITCH_STATUS_RPC)
    })
}

/**
 * [*fetchConcentStatusBase generator to  get soft switch information]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* fetchConcentRequiredStatusBase(session) {
    const action = yield call(fetchConcentRequiredStatus, session);
    yield action && put(action)
}

export function fetchConcentStatus(session) {
    return new Promise((response, reject) => {

        function on_info(args) {
            let info = args[0];
            response({
                type: SET_CONCENT_SWITCH,
                payload: info
            })
        }
        
        _handleRPC(on_info, session, config.CONCENT_SWITCH_STATUS_RPC)
    })
}

/**
 * [*fetchConcentStatusBase generator to  get soft switch information]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* fetchConcentStatusBase(session) {
    const action = yield call(fetchConcentStatus, session);
    yield action && put(action)
}

export function unlockDepositConcent(session) {
    return new Promise((response, reject) => {

        function on_unlock(args) {
            let info = args[0];
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
}

export function toggleConcentRequired(session, {isSwitchOn}) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0]
            response({
                type: SET_CONCENT_REQUIRED_SWITCH,
                payload: info
            })
        }
        _handleRPC(on_info, session, config.CONCENT_REQUIRED_SWITCH_RPC, [isSwitchOn])
    });
}

/**
 * [*toggleConcentBase generator toggle concent feature]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* toggleConcentRequiredBase(session, payload) {
    const action = yield call(toggleConcentRequired, session, payload);
    yield action && put(action)
    const status = yield call(fetchConcentRequiredStatus, session);
    yield status && put(status)
}

export function toggleConcent(session, {isSwitchOn, informRPC, toggleLock = false}) {
    return new Promise((response, reject) => {

        if(!informRPC)

            response({
                type: SET_CONCENT_SWITCH,
                payload: isSwitchOn
            })

        else {
            
            function on_info(args) {
                let info = args[0]
                response({
                    type: SET_CONCENT_SWITCH,
                    payload: isSwitchOn
                })
            }

            function on_lock(args) {
                let lock = args[0];
                _handleRPC(on_info, session, config.CONCENT_SWITCH_RPC, [isSwitchOn])
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
    const getNetwork = state => state.info.isMainNet;
    yield fork(fetchConcentStatusBase, session)
    yield fork(fetchConcentRequiredStatusBase, session)
    yield takeLatest(TOGGLE_CONCENT, toggleConcentBase, session)
    yield takeLatest(TOGGLE_CONCENT_REQUIRED, toggleConcentRequiredBase, session)
    yield takeLatest(UNLOCK_CONCENT_DEPOSIT, toggleConcentUnlockBase, session)
}