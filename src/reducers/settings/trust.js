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
            providerTrust:  Math.trunc((action.payload + 1) * 50),
        });

    case SET_REQ_TRUST:
        return Object.assign({}, state, {
            requestorTrust: Math.trunc((action.payload + 1) * 50),
        });


    default:
        return state;
    }
}

export default setTrust