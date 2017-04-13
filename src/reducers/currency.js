import { dict } from './../actions'

const {SET_CURRENCY} = dict

const initialState = {
    GNT: 0,
    ETH: 0
}
const setCurrency = (state = initialState, action) => {
    switch (action.type) {
    case SET_CURRENCY:
        const {currency, rate} = action.payload
        return Object.assign({}, state, {
            [currency]: rate
        });

    default:
        return state;
    }
}

export default setCurrency