import { dict } from './../../actions'

const {CREATE_TASK, CLEAR_TASK_PLAIN} = dict

const initialState = {
    task: {}
}
const createTask = (state = initialState, action) => {
    switch (action.type) {
    case CREATE_TASK:
        return Object.assign({}, state, {
            task: {
                ...state.task,
                ...action.payload
            }
        });
    case CLEAR_TASK_PLAIN:
        return Object.assign({}, state, {
            task: {}
        });

    default:
        return state;
    }
}

export default createTask