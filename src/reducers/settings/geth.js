import { dict } from './../../actions'
const {remote} = window.electron;
const mainProcess = remote.require('./index')
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {SET_LOCAL_GETH} = dict
const {DEFAULT_GETH} = dictConfig
//console.log(" mainProcess.getDefaultLocation", mainProcess.getDefaultLocation())

const defaultGethObj = {
    isLocalGeth: false,
    gethPort: 8545,
    gethAddress: ""
}

const initialState = {
    localGeth: getConfig(DEFAULT_GETH) || defaultGethObj
}
const setLocalGeth = (state = initialState, action) => {
    switch (action.type) {

    case SET_LOCAL_GETH:
        setConfig(DEFAULT_GETH, action.payload)
        return Object.assign({}, state, {
            localGeth: {
                ...state.localGeth,
                ...action.payload
            }
        });


    default:
        return state;
    }
}

export default setLocalGeth