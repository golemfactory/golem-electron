import { dict } from './../../actions'

const {CREATE_TASK} = dict

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

    default:
        return state;
    }
}

export default createTask