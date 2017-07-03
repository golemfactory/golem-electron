import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, takeEvery } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CURRENCY, SET_NET_PROV_TRUST, SET_NET_REQ_TRUST} = dict


/**
 * [callTrust func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function callTrust(session, payload) {
    let computingTrustPromise = new Promise((resolve, reject) => {
        function on_trust_computing(args) {
            let trust = args[0];
            //console.log(config.GET_COMPUTING_TRUST_RPC, trust)
            resolve({
                type: SET_NET_PROV_TRUST,
                payload: trust
            })
        }

        _handleRPC(on_trust_computing, session, config.GET_COMPUTING_TRUST_RPC, [payload])
    })
    let requestingTrustPromise = new Promise((resolve, reject) => {
        function on_trust_requesting(args) {
            let trust = args[0];
            //console.log(config.GET_REQUESTING_TRUST_RPC, trust)
            resolve({
                type: SET_NET_REQ_TRUST,
                payload: trust
            })
        }

        _handleRPC(on_trust_requesting, session, config.GET_REQUESTING_TRUST_RPC, [payload])
    })

    return Promise.all([computingTrustPromise, requestingTrustPromise])
}

export function* fireBase(session, {type, payload}) {
    const actionList = yield call(callTrust, session, payload);
    //console.log("actionList", actionList);
    yield actionList && actionList.map(item => put(item))
}

/**
 * [*trust generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* trustFlow(session) {
    yield takeEvery('TRUST_PAGE', fireBase, session)
}