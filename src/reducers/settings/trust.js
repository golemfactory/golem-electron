import { dict } from './../../actions'

const {SET_PROV_TRUST, SET_REQ_TRUST} = dict

const initialState = {
    providerTrust: 0,
    requestorTrust: 0
}
const setTrust = (state = initialState, action) => {
    switch (action.type) {

    case SET_PROV_TRUST:
        return Object.assign({}, state, {
            providerTrust: action.payload
        });

    case SET_REQ_TRUST:
        return Object.assign({}, state, {
            requestorTrust: action.payload
        });


    default:
        return state;
    }
}

export default setTrust