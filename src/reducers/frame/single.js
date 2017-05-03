import { dict } from './../../actions'

const {SET_FRAMES_WITH_SUBTASKS} = dict

const initialState = {
    frameList: []
}

const setSingleFrames = (state = initialState, action) => {
    switch (action.type) {

    case SET_FRAMES_WITH_SUBTASKS:
        return Object.assign({}, state, {
            frameList: action.payload
        });


    default:
        return state;
    }
}

export default setSingleFrames