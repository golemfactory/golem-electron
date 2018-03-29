import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, cancel } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleSUBPUB, _handleUNSUBPUB, _handleRPC } from './handler'


const {SET_BALANCE} = dict
const ETH_DENOM = 10 ** 18; //POW shorthand thanks to ES6


/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
// export function subscribeBalance(session) {
//     return eventChannel(emit => {
//         function on_balance(args) {
//             let balance = args[0];
//             emit({
//                 type: SET_BALANCE,
//                 payload: [(balance.GNT_available / ETH_DENOM) || 0, (balance.ETH / ETH_DENOM) || 0]
//             })
//         }
//         _handleSUBPUB(on_balance, session, config.BALANCE_CH)


//         return () => {
//             console.log('negative')
//             _handleUNSUBPUB(on_balance, session, config.BALANCE_CH)
//         }
//     })
// }

export function subscribeBalance(session) {
    const interval = 1000

    return eventChannel(emit => {

        const fetchBalance = () => {
            
            function on_balance(args) {
                const balance = args[0];
                emit({
                    type: SET_BALANCE,
                    payload: [(balance[1] / ETH_DENOM) || 0, (balance[2] / ETH_DENOM) || 0, balance[3], balance[4]]
                })
            }

            _handleRPC(on_balance, session, config.BALANCE_RPC)
        }

        const fetchOnStartup = () => {
                fetchBalance()

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
        channel.close()
    }
}