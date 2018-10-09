import { dict } from './../../actions'

const {CREATE_TASK, CLEAR_TASK_PLAIN, ADD_MISSING_TASK_FILES} = dict

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

    case ADD_MISSING_TASK_FILES:
        return Object.assign({}, state, {
            task: {
                ...state.task,
                resources: [
                    ...state.task.resources,
                    ...action.payload
                ]
            }
        });

    default:
        return state;
    }
}

export default createTask