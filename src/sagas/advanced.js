import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_ADVANCED_CHART} = dict
const mockSystemConfig = {
    cpu: 0,
    ram: 0,
    disk: 1024
}


export function subscribeAdvanced(session, rpc_address) {
    function on_custom_presets(args) {
        var custom_presets = args[0];
        console.log(rpc_address[0], custom_presets)
        emit({
            type: SET_ADVANCED_CHART,
            payload: mockSystemConfig
        })
    }

    _handleRPC(on_custom_presets, session, rpc_address[0])
}

export function* advancedFlow(session, address) {
    const action = yield call(subscribeAdvanced, session, address)
    yield action && put(action)
}