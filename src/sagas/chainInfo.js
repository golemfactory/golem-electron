import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CHAIN_INFO} = dict


export function callChainInfo(session) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            response({
                type: SET_CHAIN_INFO,
                payload: info
            })
        }
        _handleRPC(on_info, session, config.CHAIN_INFO_RPC)
    })
}

export function* chainInfoFlow(session) {
    const action = yield call(callChainInfo, session);
    //console.log("SETTINGS_ACTION", action)
    yield action && put(action)
}