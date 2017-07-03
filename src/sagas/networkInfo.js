import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_NETWORK_INFO} = dict


export function callNetworkInfo(session) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            //console.log(config.GET_NODE_RPC, info)
            response({
                type: SET_NETWORK_INFO,
                payload: info
            })
        }

        _handleRPC(on_info, session, config.GET_NODE_RPC, [])
    })
}

export function* networkInfoFlow(session) {
    const action = yield call(callNetworkInfo, session);
    //console.log("SETTINGS_ACTION", action)
    yield action && put(action)
}