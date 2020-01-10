import flatten from 'lodash/flatten';
import { eventChannel, buffers } from 'redux-saga';
import { take, call, put, takeLatest, select } from 'redux-saga/effects';
import { dict } from '../actions';

import { config, _handleRPC } from './handler';

const { SET_HISTORY, LOAD_HISTORY, EXPAND_HISTORY_PAGE } = dict;

const queries = ['all', 'outgoing', 'incoming', 'deposit_transfer'];
const getQuery = state => state.txHistory.activeTab;
const getPageNumber = state => state.txHistory.listPage;

export function expandHistory(session, { pageNumber, query }) {
    return new Promise((response, reject) => {
        function on_history(args) {
            let history = args[0];
            response({
                type: LOAD_HISTORY,
                payload: history,
                query: query
            });
        }

        // check if query about deposit, then put as first param (operation_type) if not put as second (direction)
        query === 'all' ? null : query;
        let params = [null, null, 1 + pageNumber, 30];
        params[query === queries[3] ? 0 : 1] = query;
        _handleRPC(on_history, session, config.PAYMENT_HISTORY_RPC, params);
    });
}

/**
 * [*toggleConcentUnlockBase generator to unlock concent deposit]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* expandHistoryBase(session, { payload }) {
    let query = yield select(getQuery);
    payload.query = query;
    const action = yield call(expandHistory, session, payload);
    yield put(action);
}

let query, pageNumber;
/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeHistory(session) {
    const interval = 10000;
    let promises = [];

    return eventChannel(emit => {
        const fetchHistory = () => {
            function on_history(_query, resolve, args) {
                let historyList = args[0];
                resolve({
                    query: _query,
                    payload: historyList
                });
            }

            for (let i = queries.length; i-- > 0; ) {
                let _query = queries[i];
                let _pageNumber = pageNumber[_query];
                let params = [null, null, 1, 30 * _pageNumber];
                params[_query === queries[3] ? 0 : 1] = _query;
                let _promise = new Promise((resolve, reject) => {
                    _handleRPC(
                        on_history.bind(null, _query, resolve),
                        session,
                        config.PAYMENT_HISTORY_RPC,
                        params
                    );
                });
                promises.push(_promise);
            }

            Promise.all(promises).then(result => {
                let _payload = {};
                result.forEach(item => {
                    _payload[item.query] = item.payload;
                });
                emit({
                    type: SET_HISTORY,
                    payload: _payload
                });
            });
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

    query = yield select(getQuery);
    pageNumber = yield select(getPageNumber);
    const channel = yield call(subscribeHistory, session, query, pageNumber);
    try {
        while (true) {
            query = yield select(getQuery);
            pageNumber = yield select(getPageNumber);
            let action = yield take(channel);
            yield put(action);
        }
    } finally {
        console.info('yield cancelled!');
        channel.close();
    }
}
