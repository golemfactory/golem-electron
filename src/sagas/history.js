import flatten from 'lodash/flatten';
import { eventChannel, buffers } from 'redux-saga';
import { take, call, put, takeLatest, select } from 'redux-saga/effects';
import { dict } from '../actions';

import { config, _handleRPC } from './handler';

const { SET_HISTORY, LOAD_HISTORY, EXPAND_HISTORY_PAGE } = dict;

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
        query === 'all' ? null : query;
        _handleRPC(on_history, session, config.PAYMENT_HISTORY_RPC, [
            null,
            query,
            pageNumber + 1,
            30
        ]);
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

    return eventChannel(emit => {
        const fetchHistory = () => {
            function on_history(args) {
                let historyList = args[0];
                emit({
                    type: SET_HISTORY,
                    payload: historyList,
                    // query: query
                });
            }

            let _pageNumber = pageNumber['all'];
            
            // filter based regular updaate, 
            // let _operation_type =
            //     query === 'deposit' ? 'deposit_transfer' : null;
            // let _query = null;

            // if (!_operation_type && query !== 'all') {
            //     _query = query;
            // }
            _handleRPC(on_history, session, config.PAYMENT_HISTORY_RPC, [
                null,
                null,
                1,
                30 * _pageNumber
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
