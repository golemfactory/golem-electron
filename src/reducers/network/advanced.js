import { dict } from './../../actions'

const {SET_SYSTEM_INFO, SET_ADVANCED_PRESET, SET_ADVANCED_CHART, SET_CHOSEN_HARDWARE_PRESET, SET_ADVANCED_MANUALLY} = dict

const initialState = {
    systemInfo: {},
    presetList: [],
    chartValues: {
        cpu_cores: 0,
        memory: 0,
        disk: 0
    },
    chosenPreset: ''

}
const setAdvanced = (state = initialState, action) => {
    switch (action.type) {

    case SET_SYSTEM_INFO:
        return Object.assign({}, state, {
            systemInfo: action.payload
        });

    case SET_ADVANCED_PRESET:
        return Object.assign({}, state, {
            presetList: action.payload
        });

    case SET_ADVANCED_CHART:
        return Object.assign({}, state, {
            chartValues: {
                ...state.chartValues,
                ...action.payload
            }
        });

    case SET_CHOSEN_HARDWARE_PRESET:
        return Object.assign({}, state, {
            chosenPreset: action.payload
        });

    case SET_ADVANCED_MANUALLY:
        return Object.assign({}, state, {
            chosenPreset: 'custom',
            chartValues: {
                ...action.payload
            }
        });

    default:
        return state;
    }
}

export default setAdvanced