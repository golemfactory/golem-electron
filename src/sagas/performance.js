import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, takeLatest, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PERFORMANCE_CHARTS, RECOUNT_BENCHMARK, SET_MULTIPLIER, UPDATE_MULTIPLIER} = dict

const products = Object.freeze({
        BLENDER: 'estimated_blender_performance',
        LUXRENDER: 'estimated_lux_performance',
        DEFAULT: 'estimated_performance'
    })

export function updateMultiplier(session, payload){
    return new Promise((resolve, reject) => {
        function on_update_multiplier(args) {
            let result = args[0];
            resolve(getMultiplier(session))
        }
        _handleRPC(on_update_multiplier, session, config.SET_PERF_MULTIPLIER_RPC, [payload])
    })
}

export function* updateMultiplierBase(session, {payload}){
    const action = yield call(updateMultiplier, session, payload);
    yield put(action)
}

export function getMultiplier(session){
    return new Promise((resolve, reject) => {
        function on_update_multiplier(args) {
            let result = args[0];
            resolve({
                type: SET_MULTIPLIER,
                payload: result
            })
        }
        _handleRPC(on_update_multiplier, session, config.GET_PERF_MULTIPLIER_RPC)
    })
}

export function* multiplierBase(session){
    const action = yield call(getMultiplier, session);
    yield put(action)
}


export function onPerformanceFetch(resolve, args) {
    let updateBenchmark = args[0];
    let benchmarks = {};
    Object.keys(updateBenchmark).forEach( item => {
        let product = products[item]
        if(product)
            benchmarks[product] = updateBenchmark[item]
    })
    resolve({
        type: SET_PERFORMANCE_CHARTS,
        payload: benchmarks
    })
}

export function fetchPerformance(session){
    return new Promise((resolve, reject) => {
        _handleRPC(onPerformanceFetch.bind(this, resolve), session, config.GET_PERFORMANCE_RPC)
    })
}

export function* fetchPerformanceBase(session){
    const action = yield call(fetchPerformance, session);
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
    yield fork(fetchPerformanceBase, session)
    yield fork(multiplierBase, session)
    yield takeEvery(RECOUNT_BENCHMARK, fireBase, session)
    yield takeLatest(UPDATE_MULTIPLIER, updateMultiplierBase, session)
}