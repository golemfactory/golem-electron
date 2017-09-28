import { dict } from './../actions'
import { setConfig, getConfig, dictConfig } from './../utils/configStorage'

const {SET_GOLEM_VERSION, SET_NETWORK_INFO, SET_FILE_CHECK, SET_CONNECTION_PROBLEM, SET_GOLEM_PAUSE_STATUS} = dict
const {GOLEM_STARTER} = dictConfig

const initialState = {
    version: "",
    networkInfo: {},
    fileCheckModal: {
        status: false,
        files: []
    },
    connectionProblem: false,
    isEngineOn: getConfig(GOLEM_STARTER) === null ? true : getConfig(GOLEM_STARTER),
}
//console.log(getConfig(GOLEM_STARTER))
const setInfo = (state = initialState, action) => {
    switch (action.type) {
    case SET_GOLEM_VERSION:
        return Object.assign({}, state, {
            version: action.payload
        });

    case SET_NETWORK_INFO:
        setConfig(GOLEM_STARTER, true)
        return Object.assign({}, state, {
            networkInfo: action.payload,
            isEngineOn: true
        });

    case SET_FILE_CHECK:
        const {status, files} = action.payload
        return Object.assign({}, state, {
            fileCheckModal: {
                status,
                files: files || []
            }
        });

    case SET_CONNECTION_PROBLEM:
        return Object.assign({}, state, {
            connectionProblem: action.payload
        });

    case SET_GOLEM_PAUSE_STATUS:
        setConfig(GOLEM_STARTER, action.payload)
        return Object.assign({}, state, {
            isEngineOn: action.payload
        });

    default:
        return state;
    }
}

export default setInfo