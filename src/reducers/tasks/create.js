import { dict } from "./../../actions";

const {
    CREATE_TASK,
    ADD_MISSING_TASK_FILES,
    CLEAR_TASK_PLAIN,
    SET_DIRECTORY_TREE
} = dict;

const initialState = {
    task: {},
    directoryTree: {}
};
const createTask = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_TASK:
            return Object.assign({}, state, {
                task: {
                    ...state.task,
                    ...action.payload
                }
            });
        case SET_DIRECTORY_TREE:
            return Object.assign({}, state, {
                directoryTree: {
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
};

export default createTask;
