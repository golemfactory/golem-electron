import { dict } from './../../actions'

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