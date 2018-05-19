import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {GET_PERFORMANCE_CHARTS, SET_PERFORMANCE_CHARTS, RECOUNT_BENCHMARK} = dict

const products = Object.freeze({
        BLENDER: 'estimated_blender_performance',
        LUXRENDER: 'estimated_lux_performance',
        DEFAULT: 'estimated_performance'
    })


export function callBenchmarkOnStartup(session){
    console.log('callBenchmarkOnStartup')
    return new Promise((resolve, reject) => {
        function on_update_benchmark(args) {
            let updateBenchmark = args[0];
            let bencmarks = {};
            Object.keys(updateBenchmark).forEach( item => {
                let product = products[item]
                if(product)
                    bencmarks[product] = updateBenchmark[item]
            })
            resolve({
                type: SET_PERFORMANCE_CHARTS,
                payload: bencmarks
            })
        }
        _handleRPC(on_update_benchmark, session, config.GET_BENCHMARK_RESULT_RPC)
    })
}

export function* benchmarkBase(session){
    const action = yield call(callBenchmarkOnStartup, session);
    //console.log("SETTINGS_ACTION", actionList)
    yield put(action)
}
/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchEnvironments(session) {
    return new Promise((resolve, reject) => {
        function on_environments(args) {
            let environments = args[0];
            let envIds = environments.map(item => item.id).sort()
            resolve(envIds)
        }

        _handleRPC(on_environments, session, config.GET_ENVIRONMENTS_RPC)
    })
}

export function callBenchmark(benchmarkName, session) {
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
        //console.log(benchmarkName)
        _handleRPC(on_benchmark, session, config.RUN_BENCHMARK_RPC, benchmarkName)
    })

}

export function* fireBase(session) {
    let environments = yield call(fetchEnvironments, session)
    environments.push("DEFAULT") // -> Hardcoded to call cpu benchmark
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
    yield fork(benchmarkBase, session)
    yield takeEvery(GET_PERFORMANCE_CHARTS, benchmarkBase, session)
    yield takeEvery(RECOUNT_BENCHMARK, fireBase, session)
}