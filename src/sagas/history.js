import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_HISTORY} = dict
const mockHistory = [
    {
        title: 'Processed Task',
        time: '1:15',
        status: 'Pending',
        amount: '+0.014 GNT'
    },
    {
        title: 'HMD Model Bake 3.5',
        time: '1:03',
        status: '3:01AM 28 Feb',
        amount: '-0.017 GNT'
    },
    {
        title: 'Processed Task',
        time: '2:15',
        status: '8:01AM 28 Feb',
        amount: '+0.015 GNT'
    },
    {
        title: 'Processed Task',
        time: '2:15',
        status: '8:01AM 28 Feb',
        amount: '+0.013 GNT'
    }
]

/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeHistory(session) {
    const interval = 10000

    return eventChannel(emit => {
        setInterval(function fetchHistory() {
            function on_history_payments(args) {
                let history = args[0];
                console.log(config.PAYMENTS_RPC, history)
                emit({
                    type: SET_HISTORY,
                    payload: mockHistory
                })
            }

            function on_history_income(args) {
                let history = args[0];
                console.log(config.INCOME_RPC, history)
            // emit({
            //     type: SET_HISTORY,
            //     payload: history
            // })
            }

            _handleRPC(on_history_payments, session, config.PAYMENTS_RPC)
            _handleRPC(on_history_income, session, config.INCOME_RPC)
            return fetchHistory
        }(), interval)


        return () => {
            console.log('negative')
        }
    })
}

/**
 * [*history generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* historyFlow(session) {
    const channel = yield call(subscribeHistory, session)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}