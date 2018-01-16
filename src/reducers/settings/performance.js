import { dict } from './../../actions'

const {RECOUNT_BENCHMARK, SET_PERFORMANCE_CHARTS} = dict

const initialState = {
    charts: {
        estimated_performance: 0,
        estimated_lux_performance: 0,
        estimated_blender_performance: 0,
        estimated_dummytask_performance: 0
    },
    loadingIndicator: false
}
const setPerformance = (state = initialState, action) => {
    switch (action.type) {

    case SET_PERFORMANCE_CHARTS:
        //console.log(Object.keys(action.payload))
        return Object.assign({}, state, {
            charts: {
                ...state.charts,
                ...action.payload
            },
            loadingIndicator: (Object.keys(action.payload).length > 1 || Object.keys(action.payload)[0] === "estimated_performance") ? false : true
        });

    case RECOUNT_BENCHMARK:
        return Object.assign({}, state, {
            loadingIndicator: true
        });

    default:
        return state;
    }
}

export default setPerformance