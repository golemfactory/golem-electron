import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_TASK_STATS} = dict


/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchStats(session) {
    return new Promise((resolve, reject) => {
        function on_stats(args) {
            let stats = args[0];
            resolve({
                type: SET_TASK_STATS,
                payload: stats
            })
        }

        _handleRPC(on_stats, session, config.GET_TASKS_STATS_RPC)
    })
}

export function* fireBase(session) {
    const action = yield call(fetchStats, session);
    yield action && put(action)
}

/**
 * [*performance generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* statsFlow(session) {
    yield fork(fireBase, session)
}
