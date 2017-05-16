import { dict } from './../actions'

const {SET_NETWORK_INFO} = dict

const initialState = {
    networkInfo: {}
}
const setInfo = (state = initialState, action) => {
    switch (action.type) {
    case SET_NETWORK_INFO:
        return Object.assign({}, state, {
            networkInfo: action.payload
        });

    default:
        return state;
    }
}

export default setInfo