import { dict } from './../../actions'

const {SET_SYSTEM_INFO, SET_PRESET, SET_ADVANCED_CHART, SET_CHOSEN_HARDWARE_PRESET} = dict

const initialState = {
    systemInfo: {},
    presetList: [],
    chartValues: [],
    chosenPreset: 0

}
const setAdvanced = (state = initialState, action) => {
    switch (action.type) {

    case SET_SYSTEM_INFO:
        return Object.assign({}, state, {
            systemInfo: action.payload
        });

    case SET_PRESET:
        return Object.assign({}, state, {
            presetList: action.payload
        });

    case SET_ADVANCED_CHART:
        return Object.assign({}, state, {
            chartValues: action.payload
        });

    case SET_CHOSEN_HARDWARE_PRESET:
        return Object.assign({}, state, {
            chosenPreset: action.payload
        });

    default:
        return state;
    }
}

export default setAdvanced