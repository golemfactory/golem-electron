import { dict } from './../../actions'

const {SET_PERFORMANCE_CHARTS} = dict

const initialState = {
    charts: {
        estimated_performance: 0,
        estimated_lux_performance: 0,
        estimated_blender_performance: 0
    }
}
const setPerformance = (state = initialState, action) => {
    switch (action.type) {

    case SET_PERFORMANCE_CHARTS:
        return Object.assign({}, state, {
            charts: {
                ...state.charts,
                ...action.payload
            }
        });


    default:
        return state;
    }
}

export default setPerformance