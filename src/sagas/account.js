import { takeLatest, fork, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_PUBLIC_KEY, WITHDRAW, GET_GAS_COST} = dict


export function getPublicKey(session) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            response({
                type: SET_PUBLIC_KEY,
                payload: info
            })
        }

        _handleRPC(on_info, session, config.PAYMENT_ADDRESS_RPC)
    })
}

export function* accountBase(session) {
    const action = yield call(getPublicKey, session);
    yield action && put(action)
}

export function withdraw(session, {amount, sendTo, type}, _response, _reject) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            _response(info)
        }

        _handleRPC(on_info, session, config.WITHDRAW_RPC, [amount, sendTo, type])
    })
}

export function* withdrawBase(session, {payload, _response, _reject}) {
    const action = yield call(withdraw, session, payload, _response, _reject);
    yield action && put(action)
}

export function gasCost(session, {amount, type}, _response, _reject) {
    return new Promise((response, reject) => {
        function on_info(args) {
            let info = args[0];
            _response(info)
        }

        _handleRPC(on_info, session, config.GAS_COST_RPC, [amount, type])
    })
}

export function* gasCostBase(session, {payload, _response, _reject}) {
    const action = yield call(gasCost, session, payload, _response, _reject);
    yield action && put(action)
}

/**
 * [*accountFlow generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* accountFlow(session) {
    yield fork(accountBase, session)
    yield takeLatest(WITHDRAW, withdrawBase, session)
    yield takeLatest(GET_GAS_COST, gasCostBase, session)
}