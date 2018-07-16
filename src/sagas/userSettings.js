import { eventChannel, buffers } from 'redux-saga'
import { fork, takeLatest, take, call, put, select, all } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {GET_SETTINGS_RPC, SET_SYSTEM_INFO, SET_CHOSEN_HARDWARE_PRESET, SET_PROV_MIN_PRICE, SET_REQ_MAX_PRICE, SET_NODE_NAME, UPDATE_NODE_NAME, SET_PROV_TRUST, SET_REQ_TRUST, SET_FILE_LOCATION, SET_PROVIDING, IS_NODE_PROVIDER} = dict

const parameterDict = Object.freeze({
    SET_PROV_MIN_PRICE: 'min_price',
    SET_REQ_MAX_PRICE: 'max_price',
    SET_PROV_TRUST: 'computing_trust',
    SET_REQ_TRUST: 'requesting_trust',
    SET_FILE_LOCATION: '',
    UPDATE_NODE_NAME: 'node_name',
    SET_PROVIDING: 'accept_tasks'
})

const getProviderInfo = (state) => state.info.isNodeProvider

export function* acceptTaskBase(session, {type, payload}){

    const isNodeProvider = yield select(getProviderInfo)

    if(isNodeProvider && !payload){
        yield call(updateSettings, session, type, 0)
        yield call(fireBase, session)
    }
    else if(!isNodeProvider && payload){
        yield call(updateSettings, session, type, 1)
        yield call(fireBase, session)
    }
}

export function updateSettings(session, type, payload) {
    //console.log("payload", type, payload);
    return new Promise((resolve, reject) => {
        function on_update_choosen_preset(args) {
            let updateStatus = args[0];
            resolve(updateStatus)
        }
        console.log("NAME UPDATE RECEIVED: ", type, payload)
        _handleRPC(on_update_choosen_preset, session, config.UPDATE_SETTING_RPC, [parameterDict[type], payload])
    })
}

export function* updateSettingsBase(session, {type, payload, init}) {
    if (!init) {
        const updateStatus = yield call(updateSettings, session, type, payload)
        if (type === "UPDATE_NODE_NAME") {
            yield call(fireBase, session)
        }
    }

// if (!updateStatus) {
//     yield put({
//         type: SET_GOLEM_PAUSE_STATUS,
//         payload: false
//     })
// }
}

export function callSettings(session) {
    return new Promise((response, reject) => {
        let actionList = []
        function on_settings(args) {
            let on_settings = args[0];
            const {hardware_preset_name, min_price, max_price, node_name, computing_trust, requesting_trust, accept_tasks} = on_settings


            actionList.push({
                type: SET_CHOSEN_HARDWARE_PRESET,
                payload: hardware_preset_name,
                init: true //to prevent update settings on initialization
            })

            actionList.push({
                type: SET_PROV_MIN_PRICE,
                payload: min_price,
                init: true
            })

            actionList.push({
                type: SET_REQ_MAX_PRICE,
                payload: max_price,
                init: true
            })

            actionList.push({
                type: SET_NODE_NAME,
                payload: node_name
            })

            actionList.push({
                type: SET_PROV_TRUST,
                payload: computing_trust,
                init: true
            })

            actionList.push({
                type: SET_REQ_TRUST,
                payload: requesting_trust,
                init: true
            })

            actionList.push({
                type: IS_NODE_PROVIDER,
                payload: !!accept_tasks
            })

            function on_hardware_caps(args) {
                let hardware_caps = args[0];
                //console.log("HARDWARE_CAPS", hardware_caps)
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
    const actionList = yield call(callSettings, session);
    yield actionList && all(actionList.map( item => put(item)))
}

export function* settingsFlow(session) {
    yield fork(fireBase, session)
}

export function* settingsInteractionFlow(session){
    yield takeLatest(SET_PROV_MIN_PRICE, updateSettingsBase, session)
    yield takeLatest(SET_REQ_MAX_PRICE, updateSettingsBase, session)
    yield takeLatest(SET_FILE_LOCATION, updateSettingsBase, session)
    yield takeLatest(SET_PROV_TRUST, updateSettingsBase, session)
    yield takeLatest(SET_REQ_TRUST, updateSettingsBase, session)
    yield takeLatest(UPDATE_NODE_NAME, updateSettingsBase, session)
    yield takeLatest(SET_PROVIDING, acceptTaskBase, session)
}
