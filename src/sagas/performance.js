import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, takeEvery } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PERFORMANCE_CHARTS} = dict


/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function callBenchmark(session) {
    return new Promise((resolve, reject) => {
        function on_environments(args) {
            let environments = args[0];
            let envIds = environments.map(item => item.id)
            resolve(calculateBenchmark(envIds))
        }

        function calculateBenchmark(ids) {
            let resultArray = []
            let result = Promise.resolve()

            ids.forEach((id, index) => {
                result = result.then(() => {
                    return new Promise((res, rej) => {
                        _handleRPC(on_benchmark, session, config.RUN_BENCHMARK_RPC, id)
                        function on_benchmark(args) {
                            let benchmark = args[0];
                            resultArray.push({
                                type: SET_PERFORMANCE_CHARTS,
                                payload: {
                                    [id == "BLENDER" ? "estimated_blender_performance" : "estimated_lux_performance"]: benchmark // <-- HARDCODED
                                }
                            })
                            res(resultArray)
                        }
                    })
                })
            })

            return result
        }

        _handleRPC(on_environments, session, config.GET_ENVIRONMENTS_RPC)
    })
}

export function* fireBase(session, {type}) {
    const actionList = yield call(callBenchmark, session)
    yield actionList && actionList.map(action => put(action))
}

/**
 * [*performance generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* performanceFlow(session) {
    yield takeEvery('RECOUNT_BENCHMARK', fireBase, session)
}