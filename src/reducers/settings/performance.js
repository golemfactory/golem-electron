import { dict } from './../../actions'

const {SET_PERFORMANCE_CHARTS} = dict

const initialState = {
    charts: []
}
const setPerformance = (state = initialState, action) => {
    switch (action.type) {

    case SET_PERFORMANCE_CHARTS:
        return Object.assign({}, state, {
            charts: action.payload
        });


    default:
        return state;
    }
}

export default setPerformance