import { dict } from './../../actions'

const {SET_PROV_MIN_PRICE, SET_REQ_MAX_PRICE} = dict

const initialState = {
    providerMinPrice: 0,
    requestorMaxPrice: 0
}
const setPrice = (state = initialState, action) => {
    switch (action.type) {

    case SET_PROV_MIN_PRICE:
        return Object.assign({}, state, {
            providerMinPrice: action.payload
        });

    case SET_REQ_MAX_PRICE:
        return Object.assign({}, state, {
            requestorMaxPrice: action.payload
        });


    default:
        return state;
    }
}

export default setPrice