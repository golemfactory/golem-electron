import { dict } from './../actions'
import { setConfig, getConfig, dictConfig } from './../utils/configStorage'

const {ONBOARDING} = dict
const {SHOW_ONBOARD} = dictConfig
const initialState = {
    showOnboard: (getConfig(SHOW_ONBOARD) === undefined || getConfig(SHOW_ONBOARD) === null) ? true : getConfig(SHOW_ONBOARD),
}
const setOnboard = (state = initialState, action) => {
    switch (action.type) {
    case ONBOARDING:
        setConfig(SHOW_ONBOARD, action.payload)
        return Object.assign({}, state, {
            showOnboard: action.payload
        });

    default:
        return state;
    }
}

export default setOnboard