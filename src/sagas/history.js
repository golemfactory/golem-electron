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
 * @param  {String} rpc_address [RPC address]
 * @return {Object}             [Action object]
 */
export function subscribeHistory(session, rpc_address) {
    const interval = 10000

    return eventChannel(emit => {
        setInterval(function fetchHistory() {
            function on_history_payments(args) {
                let history = args[0];
                console.log(rpc_address[0], history)
                emit({
                    type: SET_HISTORY,
                    payload: mockHistory
                })
            }

            function on_history_income(args) {
                let history = args[0];
                console.log(rpc_address[1], history)
            // emit({
            //     type: SET_HISTORY,
            //     payload: history
            // })
            }

            _handleRPC(on_history_payments, session, rpc_address[0])
            _handleRPC(on_history_income, session, rpc_address[1])
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
 * @param  {String} address     [RPC address]
 * @yield   {Object}            [Action object]
 */
export function* historyFlow(session, address) {
    const channel = yield call(subscribeHistory, session, address)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}