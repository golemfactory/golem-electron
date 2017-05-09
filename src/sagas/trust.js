import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CURRENCY} = dict


/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @param  {String} rpc_address [RPC address]
 * @return {Object}             [Action object]
 */
export function callTrust(session, rpc_address) {
    const interval = 10000

    return eventChannel(emit => {
        setInterval(function fetchTrust() {
            function on_trust_computing(args) {
                let trust = args[0];
                console.log(rpc_address[0], trust)
            // emit({
            //     type: SET_HISTORY,
            //     payload: history
            // })
            }

            function on_trust_requesting(args) {
                let trust = args[0];
                console.log(rpc_address[1], trust)
            // emit({
            //     type: SET_HISTORY,
            //     payload: history
            // })
            }

            _handleRPC(on_trust_computing, session, rpc_address[0])
            _handleRPC(on_trust_requesting, session, rpc_address[1])
            return fetchTrust
        }(), interval)


        return () => {
            console.log('negative')
        }
    })
}

/**
 * [*trust generator]
 * @param  {Object} session     [Websocket connection session]
 * @param  {String} address     [RPC address]
 * @yield   {Object}            [Action object]
 */
export function* trustFlow(session, address) {
    const channel = yield call(callTrust, session, address)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}