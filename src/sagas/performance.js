import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, takeLatest, take, call, put, select } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PERFORMANCE_CHARTS, RECOUNT_BENCHMARK, SET_MULTIPLIER, UPDATE_MULTIPLIER, SET_ENVIRONMENTS, ENABLE_ENVIRONMENT, DISABLE_ENVIRONMENT} = dict

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

export function disableEnvironment(session, {payload}){
    return new Promise((resolve, reject) => {
        function on_success(args) {
            resolve(true)
        }

        _handleRPC(on_success, session, config.DISABLE_ENVIRONMENT_RPC, [payload])
    })
}

/**
 * [*disableEnvironmentBase to disable given evironment ids; gpu, sgx etc.]
 * @param {[type]}      session     [Websocket connection session]
 * @param {[type]}      payload     [evironment ID]
 * @yield {[type]}                  [Action object]
 */
export function* disableEnvironmentBase(session, payload){
    const result = yield call(disableEnvironment, session, payload);
    if(result){
        const action = yield call(fetchEnvironments, session)
        yield put(action)
    }
}

export function enableEnvironment(session, {payload}){
    return new Promise((resolve, reject) => {
        function on_success(args) {
            resolve(true)
        }

        _handleRPC(on_success, session, config.ENABLE_ENVIRONMENT_RPC, [payload])
    })
}

/**
 * [*enableEnvironmentBase to enable given evironment ids; gpu, sgx etc.]
 * @param {[type]}      session     [Websocket connection session]
 * @param {[type]}      payload     [evironment ID]
 * @yield {[type]}                  [Action object]
 */
export function* enableEnvironmentBase(session, payload){
    const result = yield call(enableEnvironment, session, payload);
    if(result){
        const action = yield call(fetchEnvironments, session)
        yield put(action)
    }
}

/**
 * [fetchEnvironments func. will fetch list of available enviornments ]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchEnvironments(session) {
    return new Promise((resolve, reject) => {
        function on_environments(args) {
            let environments = args[0];
            resolve({
                type: SET_ENVIRONMENTS,
                payload: environments
            })
        }

        _handleRPC(on_environments, session, config.GET_ENVIRONMENTS_RPC)
    })
}

export function* fetchEnvironmentsBase(session) {
    const action = yield call(fetchEnvironments, session)
    yield put(action)
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
    const getEnvironments = (state) => state.performance.environments
    const environments = yield select(getEnvironments)
    let envIds = environments
                .filter(item => !!item.supported && !!item.accepted)
                .map(item => item.id)
    envIds.push("DEFAULT") // -> Hardcoded to call cpu benchmark
    for (let i = 0; i < envIds.length; i++) {
        const action = yield call(callBenchmark, envIds[i], session)
        yield action && put(action)
    }
}

/**
 * [*performance generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* performanceFlow(session) {
    yield fork(fetchEnvironmentsBase, session)
    yield fork(fetchPerformanceBase, session)
    yield fork(multiplierBase, session)
    yield takeEvery(RECOUNT_BENCHMARK, fireBase, session)
    yield takeLatest(UPDATE_MULTIPLIER, updateMultiplierBase, session)
    yield takeLatest(ENABLE_ENVIRONMENT, enableEnvironmentBase, session)
    yield takeLatest(DISABLE_ENVIRONMENT, disableEnvironmentBase, session)
}