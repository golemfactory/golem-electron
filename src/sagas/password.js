import { takeLatest, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PASSWORD, SET_PASSWORD_MODAL} = dict


export function setPassword(session, payload) {
    return new Promise((resolve, reject) => {
        function on_password(args) {
            let passwordStatus = args[0];
            resolve({
                type: SET_PASSWORD_MODAL,
                payload: {status: !passwordStatus, error: !passwordStatus}
            })
        }
        _handleRPC(on_password, session, config.SET_PASSWORD_RPC, [payload])
    })
}

/**
 * [*stopGolemBase generator stops golem engine]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* passwordBase(session, {payload}) {
    const action = yield call(setPassword, session, payload);
    yield action && put(action)
}

/**
 * [*engine generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* encryptionFlow(session) {
    yield takeLatest(SET_PASSWORD, passwordBase, session)
}