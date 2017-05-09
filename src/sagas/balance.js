import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleSUBPUB } from './handler'


const {SET_CONNECTED_PEERS} = dict


/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @param  {String} rpc_address [RPC address]
 * @return {Object}             [Action object]
 */
export function subscribeBalance(session, rpc_address) {
    return eventChannel(emit => {
        function on_balance(args) {
            let balance = args[0];
            console.log(rpc_address, balance)
        // emit({
        //     type: SET_CONNECTED_PEERS,
        //     payload: connected_peers.length
        // })
        }
        _handleSUBPUB(on_balance, session, rpc_address)


        return () => {
            console.log('negative')
        }
    })
}

/**
 * [*connectedPeers generator]
 * @param  {Object} session     [Websocket connection session]
 * @param  {String} address     [RPC address]
 * @yield   {Object}            [Action object]
 */
export function* balanceFlow(session, address) {
    const channel = yield call(subscribeBalance, session, address)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}