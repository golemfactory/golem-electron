import { dict } from './../../actions'
const {remote} = window.electron
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')

const {SET_RESOURCES} = dict
const {RESOURCE_SLIDER} = dictConfig

const initialState = {
    resource: getConfig(RESOURCE_SLIDER),
}
const setResources = (state = initialState, action) => {
    switch (action.type) {
    case SET_RESOURCES:
        setConfig(RESOURCE_SLIDER, action.payload)
        return Object.assign({}, state, {
            resource: action.payload
        });

    default:
        return state;
    }
}

export default setResources