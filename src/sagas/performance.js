import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, takeEvery } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CURRENCY} = dict


/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function callBenchmark(session, _) {
    return new Promise((resolve, reject) => {
        function on_environments(args) {
            let environments = args[0];
            console.log(config.GET_ENVIRONMENTS_RPC, environments)
            let environment_ids = environments.map(item => item.id)
            calculateBenchmark(environment_ids)
        }

        function calculateBenchmark() {

            function on_benchmark(args) {
                let benchmark = args[0];
                console.log(config.RUN_BENCHMARK_RPC, benchmark)
            // resolve({
            //     type: SET_PROV_TRUST,
            //     payload: trust
            // })
            }

            _handleRPC(on_benchmark, session, config.GET_ENVIRONMENTS_RPC)
        }
        _handleRPC(on_environments, session, config.GET_ENVIRONMENTS_RPC)
    })
}

export function* fireBase(session, {type, payload}) {
    console.log('SAGA_PERFORMANCE', 'Fired')
    const action = yield call(callBenchmark, session, payload)
    yield action && put(action)
}

/**
 * [*performance generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* performanceFlow(session) {
    yield takeEvery('RECOUNT_BENCHMARK', fireBase, session)
}