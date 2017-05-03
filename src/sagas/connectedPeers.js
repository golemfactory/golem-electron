import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CURRENCY} = dict


/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @param  {String} rpc_address [RPC address]
 * @return {Object}             [Action object]
 */
export function subscribeConnectedPeers(session, rpc_address) {
    const interval = 10000
    return eventChannel(emit => {
        setInterval(function fetchConnectedPeers() {
            function on_connected_peers(args) {
                var connected_peers = args[0];
                console.log(connected_peers)
            // emit({
            //         type: SET_CURRENCY,
            //         payload: {
            //             currency: data.data[0].symbol,
            //             rate: data.data[0].price_usd
            //         }
            // })
            }

            _handleRPC(on_connected_peers, session, rpc_address)
            return fetchConnectedPeers
        }(), interval)


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
export function* connectedPeers(session, address) {
    const channel = yield call(subscribeConnectedPeers, session, address)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}