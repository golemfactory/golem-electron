import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_ADVANCED_PRESET, CREATE_ADVANCED_PRESET, SET_ADVANCED_CHART} = dict


export function createPreset(session, {payload}) {
    function on_create_preset(args) {
        var created_preset = args[0];
        console.log(config.PRESET_CREATE_RPC, created_preset)
    }

    _handleRPC(on_create_preset, session, config.PRESET_CREATE_RPC, [payload])
}

export function subscribeAdvanced(session) {
    return new Promise((resolve, reject) => {

        function on_custom_presets(args) {
            var custom_presets = args[0];
            console.log(config.PRESETS_RPC, custom_presets)
            resolve({
                type: SET_ADVANCED_PRESET,
                payload: custom_presets
            })
        }

        _handleRPC(on_custom_presets, session, config.PRESETS_RPC)
    })
}

export function* fireBase(session) {
    const action = yield call(subscribeAdvanced, session)
    console.log("ADVANCED_ACTION", action)
    yield action && put(action)
}

export function* advancedFlow(session) {
    yield fork(fireBase, session)
    yield takeEvery(CREATE_ADVANCED_PRESET, createPreset, session)
}