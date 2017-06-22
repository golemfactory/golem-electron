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
    const interval = 20000

    return eventChannel(emit => {
        const iv = setInterval(function fetchHistory() {
            let incomeList;
            let allPayments = []
            function on_history_payments(args) {
                let payments = args[0];
                payments = payments.map(payment => {
                    payment.type = "payment";
                    return payment
                })
                let allPayments = [...payments, ...incomeList]
                console.info(config.PAYMENTS_RPC, allPayments)
                emit({
                    type: SET_HISTORY,
                    payload: allPayments
                })
            }

            function on_history_income(args) {
                let incomes = args[0];
                incomes = incomes.map(income => {
                    income.type = "income";
                    return income
                })
                incomeList = incomes
                console.info(config.INCOME_RPC, incomes)
                // emit({
                //     type: SET_HISTORY,
                //     payload: incomes
                // })
                _handleRPC(on_history_payments, session, config.PAYMENTS_RPC)
            }

            _handleRPC(on_history_income, session, config.INCOME_RPC)
            return fetchHistory
        }(), interval)


        return () => {
            console.log('negative')
            clearInterval(iv)
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
        channel.close()
    }
}