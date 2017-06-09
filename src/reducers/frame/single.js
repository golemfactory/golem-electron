import { dict } from './../../actions'

const {SET_FRAMES_WITH_SUBTASKS, SET_SUBTASKS_BORDER, SET_SUBTASKS_VISIBILITY} = dict

const initialState = {
    frameList: [],
    borderList: [],
    isSubtaskShown: false
}

const setSingleFrames = (state = initialState, action) => {
    switch (action.type) {

    case SET_FRAMES_WITH_SUBTASKS:
        return Object.assign({}, state, {
            frameList: action.payload
        });

    case SET_SUBTASKS_BORDER:
        return Object.assign({}, state, {
            borderList: action.payload
        });

    case SET_SUBTASKS_VISIBILITY:
        return Object.assign({}, state, {
            isSubtaskShown: !state.isSubtaskShown
        });


    default:
        return state;
    }
}

export default setSingleFrames