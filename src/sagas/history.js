import flatten from 'lodash/flatten';
import { eventChannel, buffers } from 'redux-saga';
import { take, call, put, takeLatest, select } from 'redux-saga/effects';
import { dict } from '../actions';

import { config, _handleRPC } from './handler';

const { SET_HISTORY, LOAD_HISTORY, EXPAND_HISTORY_PAGE } = dict;

let pageNumber = 1;

export function expandHistory(session, payload) {
    return new Promise((response, reject) => {
        function on_history(args) {
            let history = args[0];
            response({
                type: LOAD_HISTORY,
                payload: history
            });
        }
        _handleRPC(on_history, session, config.PAYMENT_HISTORY_RPC, [
            null,
            null,
            payload + 1,
            30
        ]);
    });
}

/**
 * [*toggleConcentUnlockBase generator to unlock concent deposit]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* expandHistoryBase(session, { payload }) {
    pageNumber = payload;
    const action = yield call(expandHistory, session, pageNumber);
    yield put(action);
}

/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeHistory(session) {
    const interval = 10000;

    return eventChannel(emit => {
        const fetchHistory = () => {
            function on_history(args) {
                let historyList = args[0];
                emit({
                    type: SET_HISTORY,
                    payload: historyList
                });
            }
            _handleRPC(on_history, session, config.PAYMENT_HISTORY_RPC, [
                null,
                null,
                1,
                30 * pageNumber
            ]);
        };

        const fetchOnStartup = () => {
            fetchHistory();

            return fetchOnStartup;
        };

        const channelInterval = setInterval(fetchOnStartup(), interval);

        return () => {
            console.log('negative');
            clearInterval(channelInterval);
        };
    });
}

/**
 * [*history generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* historyFlow(session) {
    yield takeLatest(EXPAND_HISTORY_PAGE, expandHistoryBase, session);
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
