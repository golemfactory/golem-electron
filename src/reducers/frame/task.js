import { dict } from './../../actions'

const {SET_TASK_INFO, LOGIN_FRAME} = dict

const initialState = {
    taskInfo: {},
    taskId: null
}

const setTaskInfo = (state = initialState, action) => {
    switch (action.type) {

    case LOGIN_FRAME:
        return Object.assign({}, state, {
            taskId: action.payload
        });

    case SET_TASK_INFO:
        return Object.assign({}, state, {
            taskInfo: action.payload
        });


    default:
        return state;
    }
}

export default setTaskInfo