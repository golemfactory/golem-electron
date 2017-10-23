import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_GOLEM_VERSION} = dict


export function callVersion(session) {
    return new Promise((response, reject) => {
        function on_version(args) {
            var version = args[0];
            response({
                type: SET_GOLEM_VERSION,
                payload: version
            })
        }

        _handleRPC(on_version, session, config.VERSION_RPC)
    })
}

export function* versionFlow(session) {
    const action = yield call(callVersion, session);
    //console.log("SETTINGS_ACTION", action)
    yield action && put(action)
}