import { eventChannel, buffers } from 'redux-saga'
import { fork, take, call, put, cancel } from 'redux-saga/effects'
import { dict } from '../actions'
import { config, _handleRPC, _handleSUBPUB, _handleUNSUBPUB } from './handler'
import TimeoutPromise from './timeout';


const {SET_GOLEM_VERSION, SET_LATEST_VERSION} = dict
const TEMPLATE = "Brass Golem v"

/**
 * [callVersion func. fetchs current version of golem]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
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

/**
 * [*versionBase generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* versionBase(session){
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

/**
 * [subscribeUpdate func. fetchs lateset version data from the connected peers
 * to check if current version is the latest released version or not.]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeUpdate(session) {
    return eventChannel(emit => {
        function on_update(args) {
            let update = args[0];

            emit({
                type: SET_LATEST_VERSION,
                payload: update
            })

        }
        _handleSUBPUB(on_update, session, config.UPDATE_CH)

        return () => {
            console.log('negative')
            _handleUNSUBPUB(on_update, session, config.UPDATE_CH)
        }
    })
}

/**
 * [*updateBase generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* updateBase(session) {
    const channel = yield call(subscribeUpdate, session)
    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
        channel.close()
    }
}

export function* versionFlow(session) {
     yield fork(versionBase, session)
     yield fork(updateBase, session)
}