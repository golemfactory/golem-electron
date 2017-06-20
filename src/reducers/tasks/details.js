import { dict } from './../../actions'

const {SET_TASK_DETAILS, SET_TASK_PRESETS, SET_ESTIMATED_COST} = dict

const initialState = {
    detail: {},
    presets: {},
    estimated_cost: 0
}
const setTaskDetails = (state = initialState, action) => {
    switch (action.type) {
    case SET_TASK_DETAILS:
        return Object.assign({}, state, {
            detail: action.payload
        });

    case SET_TASK_PRESETS:
        return Object.assign({}, state, {
            presets: action.payload
        });

    case SET_ESTIMATED_COST:
        return Object.assign({}, state, {
            estimated_cost: action.payload
        });

    default:
        return state;
    }
}

export default setTaskDetails