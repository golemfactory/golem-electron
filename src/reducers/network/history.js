import { dict } from './../../actions';
import createCachedSelector from 're-reselect';

const { SET_HISTORY, LOAD_HISTORY, QUERY_HISTORY } = dict;

const initialState = {
    historyList: {
        all: [null, []],
        incoming: [null, []],
        outgoing: [null, []],
        deposit: [null, []]
    },
    listPage: {
        all: 1,
        incoming: 1,
        outgoing: 1,
        deposit: 1
    },
    listLoading: false,
    activeTab: 'all'
};
const setHistory = (state = initialState, action) => {
    switch (action.type) {
        case SET_HISTORY: {
            let history = { ...state.historyList };
            Object.keys(history).forEach( item => {
                history[item] = getFilteredPaymentSelector(
                { historyList: action.payload },
                item
            )
            })
            
            //filter based regular update
            // history[action.query] = getFilteredPaymentSelector(
            //     { historyList: action.payload },
            //     action.query
            // );
            return Object.assign({}, state, {
                historyList: history
            });
        }
        case LOAD_HISTORY: {
            action.payload;
            let history = { ...state.historyList };
            let size = action.payload[0];
            let list = getFilteredPaymentSelector(
                { historyList: action.payload },
                action.query
            );
            history[action.query] = [
                size,
                [...state.historyList[action.query][1], ...list[1]]
            ];

            let count = { ...state.listPage };
            count[action.query] += 1;

            return Object.assign({}, state, {
                historyList: history,
                listPage: count
            });
        }
        case QUERY_HISTORY:
            return Object.assign({}, state, {
                activeTab: action.payload
            });

        default:
            return state;
    }
};

export default setHistory;

function newestToOldest(a, b) {
    if (a.created < b.created) return 1;
    if (a.created > b.created) return -1;
    return 0;
}

const extractData = (historyList, filter) => {
    const list = historyList[1]
        .filter(item =>
            filter !== 'all'
                ? item.direction === filter || item.operation_type === filter
                : item
        )
        .sort(newestToOldest)
        .map((item, index) => {
            return {
                key: item?.created?.toString(),
                data: item
            };
        });
    return [historyList[0], list];
};

export const getFilteredPaymentSelector = createCachedSelector(
    state => state.historyList,
    (state, filter) => filter,
    (getHistoryList, filter) => extractData(getHistoryList, filter)
)(
    (state, filter) => filter // Cache selectors by type name
);
