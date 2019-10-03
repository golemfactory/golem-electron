import { dict } from './../../actions';
import createCachedSelector from 're-reselect';

const { SET_HISTORY, LOAD_HISTORY } = dict;

const initialState = {
    historyList: [null, []],
    listPage: 1,
    listLoading: false
};
const setHistory = (state = initialState, action) => {
    switch (action.type) {
        case SET_HISTORY:
            return Object.assign({}, state, {
                historyList: action.payload
            });

        case LOAD_HISTORY:
            const [size, list] = action.payload;
            return Object.assign({}, state, {
                historyList: [size, [...state.historyList[1], ...list]],
                listPage: state.listPage + 1
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

const extractData = (historyList, filter, isDefault) => {
    return historyList
        .filter(item => (filter ? item.direction === filter : item))
        .sort(newestToOldest)
        .map((item, index) => {
            return {
                key: item?.created?.toString(),
                data: item
            };
        });
};

export const getFilteredPaymentSelector = createCachedSelector(
    state => state.historyList[1],
    (state, filter) => filter,
    (state, filter, isDefault) => isDefault,
    (getHistoryList, filter, isDefault) =>
        extractData(getHistoryList, filter, isDefault)
)(
    (state, filter) => (filter ? filter : 'all') // Cache selectors by type name
);
