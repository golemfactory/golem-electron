import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PRESET, SET_ADVANCED_CHART} = dict


export function subscribeAdvanced(session) {
    return new Promise((resolve, reject) => {

        function on_custom_presets(args) {
            var custom_presets = args[0];
            console.log(config.PRESETS_RPC, custom_presets)
            resolve({
                type: SET_PRESET,
                payload: custom_presets
            })
        }

        _handleRPC(on_custom_presets, session, config.PRESETS_RPC)
    })
}

export function* advancedFlow(session) {
    const action = yield call(subscribeAdvanced, session)
    console.log("ADVANCED_ACTION", action)
    yield action && put(action)
}