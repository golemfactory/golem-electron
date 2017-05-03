import { dict } from './../../actions'

const {SET_PRESET, SET_ADVANCED_CHART} = dict

const initialState = {
    presetList: [],
    chartValues: []

}
const setAdvanced = (state = initialState, action) => {
    switch (action.type) {
    case SET_PRESET:
        return Object.assign({}, state, {
            presetList: action.payload
        });

    case SET_ADVANCED_CHART:
        return Object.assign({}, state, {
            chartValues: action.payload
        });

    default:
        return state;
    }
}

export default setAdvanced