import { dict } from './../actions'
const {remote} = window.electron
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {ONBOARDING, SET_TERMS_STATUS} = dict
const {HIDE_ONBOARD} = dictConfig
//setConfig(HIDE_ONBOARD, false)
const initialState = {
    showOnboard: !getConfig(HIDE_ONBOARD),
}
const setOnboard = (state = initialState, action) => {
    switch (action.type) {
    case ONBOARDING:
        setConfig(HIDE_ONBOARD, action.payload)
        return Object.assign({}, state, {
            showOnboard: !action.payload
        });
    case SET_TERMS_STATUS:
        return Object.assign({}, state, {
            showOnboard: !action.payload
        });

    default:
        return state;
    }
}

export default setOnboard