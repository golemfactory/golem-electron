import { dict } from './../actions'
const {remote} = window.electron
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {ONBOARDING} = dict
const {SHOW_ONBOARD} = dictConfig
//setConfig(SHOW_ONBOARD, false)
const initialState = {
    showOnboard: (!getConfig(SHOW_ONBOARD)) ? true : getConfig(SHOW_ONBOARD),
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