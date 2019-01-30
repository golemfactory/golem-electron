import { dict } from './../../actions'
const {remote} = window.electron;
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {SET_LOCAL_GETH} = dict
const {DEFAULT_GETH} = dictConfig

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
        const {isLocalGeth, gethPort, gethAddress} = action.payload
        if((isLocalGeth && gethPort) || (!isLocalGeth && gethAddress))
            setConfig(DEFAULT_GETH, action.payload)
        else
            setConfig(DEFAULT_GETH, false)

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