import { dict } from './../../actions'

const {SET_TASK_DETAILS, SET_TASK_PRESETS} = dict

const initialState = {
    detail: {},
    presets: {}
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

    default:
        return state;
    }
}

export default setTaskDetails