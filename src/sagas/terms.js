import {fork,  takeLatest, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {
        SET_TERMS, 
        CHECK_TERMS_ACCEPTED, 
        ACCEPT_TERMS, 
        SET_TERMS_STATUS, 
        SET_CONCENT_TERMS, 
        CHECK_CONCENT_TERMS_ACCEPTED, 
        ACCEPT_CONCENT_TERMS, 
        SET_CONCENT_TERMS_STATUS
    } = dict

export function checkConcentTermsAccepted(session) {
    return new Promise((resolve, reject) => {
        function on_info(args) {
            let info = args[0];
            resolve({
                type: SET_CONCENT_TERMS_STATUS,
                payload: info
            })
        }
        _handleRPC(on_info, session, config.CHECK_CONCENT_TERMS_RPC)
    })
}

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

export function acceptConcentTerms(session, {_resolve, _reject}) {
    function on_info(args) {
        let info = args[0];
        _resolve(info)
    }

    _handleRPC(on_info, session, config.ACCEPT_CONCENT_TERMS_RPC, [])
}

export function acceptTerms(session, {monitor, sentry, _resolve, _reject}) {
    function on_info(args) {
        let info = args[0];
        _resolve(info)
    }

    _handleRPC(on_info, session, config.ACCEPT_TERMS_RPC, [monitor, sentry])
}

export function* checkTermsBase(session){
    const action = yield call(checkTermsAccepted, session);
    yield put(action)
    const actionConcent = yield call(checkConcentTermsAccepted, session);
    yield put(actionConcent)
}

export function getConcentTerms(session) {
    return new Promise((resolve, reject) => {
        function on_info(args) {
            let info = args[0];
            resolve({
                type: SET_CONCENT_TERMS,
                payload: info
            })
        }
        console.log("requested");
        _handleRPC(on_info, session, config.GET_CONCENT_TERMS_RPC)
    })
}

export function getTerms(session) {
    return new Promise((resolve, reject) => {
        function on_info(args) {
            let info = args[0];
            resolve({
                type: SET_TERMS,
                payload: info
            })
        }
        console.log("requested");
        _handleRPC(on_info, session, config.GET_TERMS_RPC)
    })
}

export function* getTermsBase(session){
    const action = yield call(getTerms, session);
    yield put(action)
    const actionConcent = yield call(getConcentTerms, session);
    yield put(actionConcent)
}


export function* termsFlow(session) {
    yield fork(getTermsBase, session)
    yield fork(checkTermsBase, session)
    yield takeLatest(ACCEPT_TERMS, acceptTerms, session)
    yield takeLatest(ACCEPT_CONCENT_TERMS, acceptConcentTerms, session)
}