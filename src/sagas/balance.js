import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleSUBPUB } from './handler'


const {SET_BALANCE} = dict


/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeBalance(session) {
    return eventChannel(emit => {
        function on_balance(args) {
            let balance = args[0];
            console.log(config.BALANCE_CH, balance)
            emit({
                type: SET_BALANCE,
                payload: balance.GNT_available / (10 ** 18) //POW shorthand thanks to ES6
            })
        }
        _handleSUBPUB(on_balance, session, config.BALANCE_CH)


        return () => {
            console.log('negative')
        }
    })
}

/**
 * [*connectedPeers generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* balanceFlow(session) {
    const channel = yield call(subscribeBalance, session)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}