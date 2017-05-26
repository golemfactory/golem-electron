import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PERFORMANCE_CHARTS, RECOUNT_BENCHMARK} = dict


/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchEnvironments(session) {
    return new Promise((resolve, reject) => {
        function on_environments(args) {
            let environments = args[0];
            let envIds = environments.map(item => item.id)
            resolve(envIds)
        }

        _handleRPC(on_environments, session, config.GET_ENVIRONMENTS_RPC)
    })
}

export function callBenchmark(benchmarkName, session) {
    let products = {
        BLENDER: 'estimated_blender_performance',
        LUXRENDER: 'estimated_lux_performance'
    }
    return new Promise((resolve, reject) => {
        function on_benchmark(args) {
            let benchmark = args[0];
            resolve({
                type: SET_PERFORMANCE_CHARTS,
                payload: {
                    [products[benchmarkName]]: benchmark
                }
            })
        }
        console.log(benchmarkName)
        _handleRPC(on_benchmark, session, config.RUN_BENCHMARK_RPC, benchmarkName)
    })

}

export function* fireBase(session) {
    const environments = yield call(fetchEnvironments, session)
    for (let i = 0; i < environments.length; i++) {
        const action = yield call(callBenchmark, environments[i], session)
        yield action && put(action)
    }
}

/**
 * [*performance generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* performanceFlow(session) {
    yield takeEvery(RECOUNT_BENCHMARK, fireBase, session)
}