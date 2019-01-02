import { dict } from './../../actions'
const {remote} = window.electron;
const mainProcess = remote.require('./index')
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {SET_CONCENT_SWITCH, SET_CONCENT_ONBOARDING_SHOWN} = dict
const {CONCENT_ONBOARDING} = dictConfig

const initialState = {
    concentSwitch: false,
    hasOnboardingShown: getConfig(CONCENT_ONBOARDING) || false
}
const setConcentSwitch = (state = initialState, action) => {
    switch (action.type) {

    case SET_CONCENT_SWITCH:
        return Object.assign({}, state, {
            concentSwitch: action.payload
        });

    case SET_CONCENT_ONBOARDING_SHOWN:
    	setConfig(CONCENT_ONBOARDING, true)
        return Object.assign({}, state, {
            hasOnboardingShown: true
        });

    default:
        return state;
    }
}

export default setConcentSwitch