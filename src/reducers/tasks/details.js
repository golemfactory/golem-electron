import { dict } from './../../actions'

const {SET_TASK_DETAILS} = dict

const initialState = {
    detail: {}
}
const setTaskDetails = (state = initialState, action) => {
    switch (action.type) {
    case SET_TASK_DETAILS:
        return Object.assign({}, state, {
            detail: action.payload
        });

    default:
        return state;
    }
}

export default setTaskDetails