import { dict } from './../../actions'

const {SET_CONCENT_SWITCH} = dict

const initialState = {
    concentSwitch: false
}
const setConcentSwitch = (state = initialState, action) => {
    switch (action.type) {

    case SET_CONCENT_SWITCH:
        return Object.assign({}, state, {
            concentSwitch: action.payload
        });
    default:
        return state;
    }
}

export default setConcentSwitch