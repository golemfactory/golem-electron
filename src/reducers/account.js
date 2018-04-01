import {BigNumber} from 'bignumber.js';
import { dict } from './../actions'

const {SET_PUBLIC_KEY, CALL_WITHDRAW_MODAL} = dict
//setConfig(HIDE_ONBOARD, false)
const initialState = {
    publicKey: "",
    withdrawModal: {
    	status: false,
    	currency: ''
    },
    gasCost: new BigNumber(0)
}
const setAccount = (state = initialState, action) => {
    switch (action.type) {
    case SET_PUBLIC_KEY:
        return Object.assign({}, state, {
            publicKey: action.payload
        });

    case CALL_WITHDRAW_MODAL:
        return Object.assign({}, state, {
            withdrawModal: {...action.payload}
        });

    default:
        return state;
    }
}

export default setAccount