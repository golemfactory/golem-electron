import { eventChannel, buffers } from 'redux-saga'
import { fork, takeLatest, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {GET_SETTINGS_RPC, SET_SYSTEM_INFO, SET_PERFORMANCE_CHARTS, SET_CHOSEN_HARDWARE_PRESET, SET_PROV_MIN_PRICE, SET_REQ_MAX_PRICE, SET_NODE_NAME} = dict

export function updateSettings(session, {type, payload}) {
    console.info(type, 'setting updated')
}

export function callSettings(session) {
    return new Promise((response, reject) => {
        let actionList = []
        function on_settings(args) {
            let on_settings = args[0];
            console.log("SETTINGS", on_settings)
            const {estimated_performance, estimated_lux_performance, estimated_blender_performance, hardware_preset_name, min_price, max_price, node_name} = on_settings

            actionList.push({
                type: SET_PERFORMANCE_CHARTS,
                payload: {
                    estimated_performance,
                    estimated_lux_performance,
                    estimated_blender_performance
                }
            })

            actionList.push({
                type: SET_CHOSEN_HARDWARE_PRESET,
                payload: hardware_preset_name
            })

            actionList.push({
                type: SET_PROV_MIN_PRICE,
                payload: min_price / (10 ** 18) //POW shorthand thanks to ES6
            })

            actionList.push({
                type: SET_REQ_MAX_PRICE,
                payload: max_price / (10 ** 18) //POW shorthand thanks to ES6
            })

            actionList.push({
                type: SET_NODE_NAME,
                payload: node_name
            })

            function on_hardware_caps(args) {
                let hardware_caps = args[0];
                console.log("HARDWARE_CAPS", hardware_caps)
                actionList.push({
                    type: SET_SYSTEM_INFO,
                    payload: {
                        ...hardware_caps
                    }
                })

                response(actionList)
            }

            _handleRPC(on_hardware_caps, session, config.HARDWARE_CAPS_RPC)

        }

        _handleRPC(on_settings, session, config.GET_SETTINGS_RPC)
    })
}

export function* fireBase(session) {
    const actionList = yield call(callSettings, session)
    console.log("SETTINGS_ACTION", actionList)
    yield actionList && actionList.map((item) => {
        return put(item)
    })
}

export function* settingsFlow(session) {
    yield fork(fireBase, session)
    yield takeLatest('TEST', updateSettings, session)
}