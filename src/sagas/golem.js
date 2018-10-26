import { eventChannel, buffers } from 'redux-saga';
import { take, call, put, cancel } from 'redux-saga/effects';
import { dict } from '../actions'

import { config, _handleSUBPUB, _handleUNSUBPUB, _handleRPC } from './handler'

const {SET_GOLEM_STATUS} = dict

/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeGolemStatus(session) {
    return eventChannel(emit => {
        function on_status(args) {
            if (args && args.length){
                    emit({
                        type: SET_GOLEM_STATUS,
                        payload: args
                    });
                }
        }
        
        _handleSUBPUB(on_status, session, config.GOLEM_STATUS_CH);

        return () => _handleUNSUBPUB(on_status, session, config.GOLEM_STATUS_CH);
    })
}


/**
 * [*golemStatus generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield  {Object}             [Action object]
 */
export function* golemStatusFlow(session) {
    const channel = yield call(subscribeGolemStatus, session)

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