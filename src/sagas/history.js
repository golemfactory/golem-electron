import { eventChannel, buffers } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import { dict } from '../actions';

import { config, _handleRPC } from './handler';

const { SET_HISTORY } = dict;

/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeHistory(session) {
    const interval = 20000;

    return eventChannel(emit => {
        const iv = setInterval(
            (function fetchHistory() {
                function on_history(args) {
                    let history = args[0];
                    emit({
                        type: SET_HISTORY,
                        payload: history
                    });
                }

                _handleRPC(on_history, session, config.PAYMENT_HISTORY_RPC);
            })(),
            interval
        );

        return () => {
            console.log('negative');
            clearInterval(iv);
        };
    });
}

/**
 * [*history generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* historyFlow(session) {
    const channel = yield call(subscribeHistory, session);

    try {
        while (true) {
            let action = yield take(channel);
            yield put(action);
        }
    } finally {
        console.info('yield cancelled!');
        channel.close();
    }
}
