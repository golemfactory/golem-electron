import { eventChannel, buffers } from 'redux-saga'
import { fork, takeLatest, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {START_GOLEM, STOP_GOLEM, SET_GOLEM_ENGINE_STATUS} = dict


/**
 * [callTrust func. fetchs payment history of user, with interval]
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

export function* golemizeBase(session) {
    const engineStatus = yield call(fireEngine, session)
    console.log(engineStatus)
    if (!engineStatus) {
        yield put({
            type: SET_GOLEM_ENGINE_STATUS,
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

export function* notTodayBase(session) {
    const engineStatus = yield call(stopEngine, session)
    console.info("engineStatus", engineStatus)
    if (!engineStatus) {
        yield put({
            type: SET_GOLEM_ENGINE_STATUS,
            payload: false
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
    yield takeLatest(STOP_GOLEM, notTodayBase, session)
}