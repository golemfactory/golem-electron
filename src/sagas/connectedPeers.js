import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CONNECTED_PEERS} = dict


/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeConnectedPeers(session) {
    const interval = 10000
    return eventChannel(emit => {
        setInterval(function fetchConnectedPeers() {
            function on_connected_peers(args) {
                var connected_peers = args[0];
                console.log(config.GET_CONNECTED_PEERS_RPC, connected_peers)
                emit({
                    type: SET_CONNECTED_PEERS,
                    payload: connected_peers.length
                })
            }

            _handleRPC(on_connected_peers, session, config.GET_CONNECTED_PEERS_RPC)
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
 * @yield   {Object}            [Action object]
 */
export function* connectedPeersFlow(session) {
    const channel = yield call(subscribeConnectedPeers, session)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}