import { eventChannel, buffers } from 'redux-saga'
import { fork, takeLatest, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'
import { onPerformanceFetch } from './performance'


const {START_GOLEM, STOP_GOLEM, SET_GOLEM_PAUSE_STATUS, SET_FOOTER_INFO} = dict


/**
 * [callTrust func. fetches payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fireEngine(session) {
    return new Promise((resolve, reject) => {
        function on_engine(args) {
            let engineStatus = args[0];
            resolve(engineStatus)
        }

        _handleRPC(on_engine, session, config.START_GOLEM_RPC)
    })
}

export function activatePreset(session, {chosenPreset, runBenchmarks}) {
    return new Promise((resolve, reject) => {
        _handleRPC(onPerformanceFetch.bind(this, resolve), session, config.PRESET_ACTIVATE_RPC, [chosenPreset, runBenchmarks])
    })
}

/**
 * [*golemizeBase generator starts golem engine]
 * @param {Object} session         [Session of the wamp connection]
 * @param {Object} options.payload [Name of chosen preset]
 */
export function* golemizeBase(session, {payload}) {
    const action = yield call(activatePreset, session, payload);
    yield put(action)
    const engineStatus = yield call(fireEngine, session);
    if (!engineStatus) {
        yield put({
            type: SET_GOLEM_PAUSE_STATUS,
            payload: true
        })
    }

}

export function stopEngine(session) {
    return new Promise((resolve, reject) => {
        function on_engine(args) {
            let engineStatus = args[0];
            resolve(engineStatus)
        }

        _handleRPC(on_engine, session, config.STOP_GOLEM_RPC)
    })
}

/**
 * [*stopGolemBase generator stops golem engine]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* stopGolemBase(session) {
    const engineStatus = yield call(stopEngine, session);
    if (!engineStatus) {
        yield put({
            type: SET_GOLEM_PAUSE_STATUS,
            payload: false
        })
        yield put({
            type: SET_FOOTER_INFO,
            payload: {
                status: "Not Ready",
                message: "Golem is not started yet",
                color: 'yellow'
            }
        })
    }
}

/**
 * [*engine generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* engineFlow(session) {
    yield takeLatest(START_GOLEM, golemizeBase, session)
    yield takeLatest(STOP_GOLEM, stopGolemBase, session)
}