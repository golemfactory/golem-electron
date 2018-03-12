import { dict } from './../actions'

const {SET_PUBLIC_KEY} = dict
//setConfig(HIDE_ONBOARD, false)
const initialState = {
    publicKey: "",
}
const setAccount = (state = initialState, action) => {
    switch (action.type) {
    case SET_PUBLIC_KEY:
        return Object.assign({}, state, {
            publicKey: action.payload
        });

    default:
        return state;
    }
}

export default setAccount