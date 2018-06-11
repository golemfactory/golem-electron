import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_TASK_STATS} = dict

export function subscribeStats(session) {
    const interval = 1000

    return eventChannel(emit => {

        const fetchStats = () => {
            
            function on_stats(args) {
                let stats = args[0];
                emit({
                    type: SET_TASK_STATS,
                    payload: stats
                })
            }

            _handleRPC(on_stats, session, config.GET_TASKS_STATS_RPC)
        }

        const fetchOnStartup = () => {
                fetchStats()

            return fetchOnStartup
        }

        const channelInterval = setInterval(fetchOnStartup(), interval)

        return () => {
            console.log('negative')
            clearInterval(channelInterval);
        }
    })
}

/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */


export function* fireBase(session) {
    const channel = yield call(subscribeStats, session)
    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
        channel.close()
    }
}

/**
 * [*performance generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* statsFlow(session) {
    yield fork(fireBase, session)
}
