import { dict } from './../../actions'

const {SET_TASK_INFO} = dict

const initialState = {
    taskInfo: {}
}

const setTaskInfo = (state = initialState, action) => {
    switch (action.type) {

    case SET_TASK_INFO:
        return Object.assign({}, state, {
            taskInfo: action.payload
        });


    default:
        return state;
    }
}

export default setTaskInfo