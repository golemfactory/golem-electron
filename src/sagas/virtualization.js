import { call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'

const {SET_VIRTUALIZATION_STATUS} = dict

export function fetchVirtualizationInfo(session) {
	return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            response({
                type: SET_VIRTUALIZATION_STATUS,
                payload: info
            })
        }

        _handleRPC(on_info, session, config.VIRTUALIZATION_RPC)
    })
}

/**
 * [*terminateGolemBase generator terminate golem core]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* virtualizationFlow(session) {
    const action = yield call(fetchVirtualizationInfo, session);
    yield action && put(action)
}