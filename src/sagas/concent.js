import { takeLatest, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {TOGGLE_CONCENT, SET_CONCENT_SWITCH} = dict


export function toggleConcent(session, payload) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            console.log("info", info);
            response({
                type: SET_CONCENT_SWITCH,
                payload: info
            })
        }
        if(payload)
            _handleRPC(on_info, session, config.CONCENT_ON_RPC)
        else
            _handleRPC(on_info, session, config.CONCENT_OFF_RPC)
    })
}

/**
 * [*toggleConcentBase generator toggle concent feature]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* toggleConcentBase(session, {payload}) {
    const action = yield call(toggleConcent, session, payload);
    yield action && put(action)
}

export function* concentFlow(session, payload) {
    yield takeLatest(TOGGLE_CONCENT, toggleConcentBase, session)
}