import { dict } from './../../actions'
import createCachedSelector from 're-reselect';
import { spring } from 'react-motion'

const {SET_HISTORY} = dict

const initialState = {
    historyList: []
}
const setHistory = (state = initialState, action) => {
    switch (action.type) {
    case SET_HISTORY:
        return Object.assign({}, state, {
            historyList: action.payload
        });

    default:
        return state;
    }
}

export default setHistory

function newestToOldest(a, b) {
    if (a.created < b.created)
        return 1;
    if (a.created > b.created)
        return -1;
    return 0;
}

const extractData = (historyList, filter, isDefault) => historyList
				.filter(item => filter 
                        ? item.type === filter
                        : item)
                .sort(newestToOldest)
                .map((item, index) => {
                    return {
                        key: item.created.toString(),
                        data: item,
                        style: isDefault
                        ? 	{
		                        height: 0,
		                        opacity: 0,
		                        borderWidth: 0
	                    	}
                        : 	{
	                            height: spring(76, {
	                                stiffness: 150,
	                                damping: 22
	                            }),
	                            opacity: spring(1, {
	                                stiffness: 150,
	                                damping: 22
	                            }),
	                            borderWidth: spring(1, {
	                                stiffness: 150,
	                                damping: 22
                            	}),
                        	}
                    }
                })

export const getFilteredPaymentSelector = createCachedSelector(
		(state) => state.historyList,
		(state, filter) => filter,
		(state, filter, isDefault) => isDefault,
		(getHistoryList, filter, isDefault) => extractData(getHistoryList, filter, isDefault)
	)(
	  	(state, type) => type ? type : "all", // Cache selectors by type name
	)