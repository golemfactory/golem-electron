import { dict } from './../../actions'
const {remote} = window.electron;
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {CONCENT_BALANCE_STATE, CONCENT_ONBOARDING, UNLOCK_DEPOSIT_STATE} = dictConfig
const {
    SET_CONCENT_SWITCH, 
    SET_CONCENT_DEPOSIT_BALANCE, 
    SET_CONCENT_ONBOARDING_SHOWN, 
    TOGGLE_CONCENT, 
    UNLOCK_CONCENT_DEPOSIT
} = dict

const  tempCBS = CONCENT_BALANCE_STATE && getConfig(CONCENT_BALANCE_STATE)
const lastConcentStatus = tempCBS 
    ? JSON.parse(tempCBS).status
    : null

const initialState = {
    concentSwitch: false,
    hasOnboardingShown: getConfig(CONCENT_ONBOARDING) || false,
    isConcentWaiting: getConfig(UNLOCK_DEPOSIT_STATE) || false,
    concentStatus: lastConcentStatus || null
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

    case UNLOCK_CONCENT_DEPOSIT:
        setConfig(UNLOCK_DEPOSIT_STATE, true)
        return Object.assign({}, state, {
            isConcentWaiting: true
        });

    case TOGGLE_CONCENT:
        const {isSwitchOn, informRPC, toggleLock = false} = action;
        const depositState = (
            !isSwitchOn 
            && informRPC 
            && (state.concentStatus 
                === "unlocking")) 
        || (informRPC && toggleLock);
        
        setConfig(UNLOCK_DEPOSIT_STATE, depositState)
        return Object.assign({}, state, {
            isConcentWaiting: depositState
        });

    case SET_CONCENT_DEPOSIT_BALANCE:
        const {status} = action.payload
        setConfig(UNLOCK_DEPOSIT_STATE, false)
        return Object.assign({}, state, {
            isConcentWaiting: false,
            concentStatus: status
        });

    default:
        return state;
    }
}

export default setConcentSwitch