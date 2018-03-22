import { takeLatest, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {CHECK_TERMS_ACCEPTED, ACCEPT_TERMS, SET_TERMS_STATUS} = dict


export function checkTermsAccepted(session) {
    return new Promise((resolve, reject) => {
        function on_info(args) {
            let info = args[0];
            resolve({
                type: SET_TERMS_STATUS,
                payload: info
            })
        }
        _handleRPC(on_info, session, config.CHECK_TERMS_RPC)
    })
}

export function acceptTerms(session, {_resolve, _reject}) {
    return new Promise((resolve, reject) => {
        function on_info(args) {
            let info = args[0];
            _resolve(info)
        }

        _handleRPC(on_info, session, config.ACCEPT_TERMS_RPC)
    })
}

export function* checkTermsBase(session){
    const action = yield call(checkTermsAccepted, session);
    yield put(action)
}

export function* termsFlow(session) {
    yield takeLatest(CHECK_TERMS_ACCEPTED, checkTermsBase, session)   
    yield takeLatest(ACCEPT_TERMS, acceptTerms, session)
}