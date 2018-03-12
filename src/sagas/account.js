import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PUBLIC_KEY} = dict


export function getPublicKey(session) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            console.log(config.GET_KEY_ID_RPC, info)
            response({
                type: SET_PUBLIC_KEY,
                payload: info
            })
        }

        _handleRPC(on_info, session, config.GET_KEY_ID_RPC)
    })
}

export function* accountFlow(session) {
    const action = yield call(getPublicKey, session);
    yield action && put(action)
}