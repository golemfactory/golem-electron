import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'
import TimeoutPromise from './timeout';


const {SET_GOLEM_VERSION} = dict
const TEMPLATE = "Brass Golem v"


export function callVersion(session) {

    const versionPromise = new Promise((response, reject) => {
        
        function on_version(args) {

            const version = args[0];

            response({
                type: SET_GOLEM_VERSION,
                payload: { 
                    number: version, 
                    message: TEMPLATE, 
                    error: false
                }
            })
        }
        
        _handleRPC(on_version, session, config.VERSION_RPC)
        
    })

    return TimeoutPromise(5000, versionPromise, "version")
}

export function* versionFlow(session) {
    try {
        const action = yield call(callVersion, session);
        yield action && put(action)
    }
    catch(error) {
        console.warn("version fetch error: ", error);
        yield put({
                type: SET_GOLEM_VERSION,
                payload: { 
                    number: null, 
                    message: error, 
                    error: true
                }
            })
    }
}