import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, select } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CONNECTED_PEERS} = dict
const delay = (ms) => new Promise(res => setTimeout(res, ms))

/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeConnectedPeers(session) {
    const interval = 19000
    return eventChannel(emit => {
        const iv = setInterval(function fetchConnectedPeers() {
            function on_connected_peers(args) {
                let connected_peers = args[0];
                emit({
                    type: SET_CONNECTED_PEERS,
                    payload: connected_peers
                })
            }

            _handleRPC(on_connected_peers, session, config.GET_CONNECTED_PEERS_RPC)
            return fetchConnectedPeers
        }(), interval)


        return () => {
            console.log('negative')
            clearInterval(iv)
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
            yield delay(1000)
            const getStatus = (state) => state.info.isEngineOn
            const status = yield select(getStatus)
            if(!!status){
                let action = yield take(channel)
                yield put(action)
            }
        }
    } finally {
        console.info('yield cancelled!')
        channel.close()
    }
}