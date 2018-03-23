import { takeLatest, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PASSWORD, SET_PASSWORD_MODAL} = dict


export function setPassword(session, payload) {
    return new Promise((resolve, reject) => {
        function on_password(args) {
            let passwordStatus = args[0];
            resolve(passwordStatus)
        }
        console.log("payload", payload)
        _handleRPC(on_password, session, config.SET_PASSWORD_RPC, [payload])
    })
}

/**
 * [*stopGolemBase generator stops golem engine]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* passwordBase(session, {payload}) {
    const passwordStatus = yield call(setPassword, session, payload);
    //console.info("engineStatus", engineStatus)
    
    yield put({
        type: SET_PASSWORD_MODAL,
        payload: {status: !passwordStatus, error: !passwordStatus}
    })
}

/**
 * [*engine generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* encryptionFlow(session) {
    yield takeLatest(SET_PASSWORD, passwordBase, session)
}