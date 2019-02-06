import { dict } from './../../actions'

const {SET_FRAMES_WITH_SUBTASKS, SET_SUBTASKS_BORDER, SET_PREVIEW_LIST, 
    SET_SUBTASKS_LIST, SET_SUBTASKS_VISIBILITY, SET_FRAME_ID, 
    SET_FRAME_INDEX, NEXT_FRAME, PREVIOUS_FRAME, CLEAR_TASK_PLAIN} = dict


const initialState = {
    frameList: [],
    borderList: [],
    isSubtaskShown: false,
    previewList: {
        size: 0
    },
    subtasksList: [],
    hasSubtasksLoaded: false,
    frameIndex: 0,
    frameId: 0
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

    case SET_SUBTASKS_LIST:
        return Object.assign({}, state, {
            subtasksList: action.payload,
            hasSubtasksLoaded: true
        });

    case SET_PREVIEW_LIST:
        return Object.assign({}, state, {
            previewList: {
                ...action.payload,
                size: Object.keys(action.payload).length
            },
        });

    case SET_FRAME_ID:
        return Object.assign({}, state, {
            frameId: action.payload
        });

    case SET_FRAME_INDEX:
        return Object.assign({}, state, {
            frameIndex: action.payload
        });

    case NEXT_FRAME:
        const nextIndex = Number(state.frameIndex) + 1;
        const nextKeys = Object.keys( state.previewList );
        return Object.assign({}, state, {
            frameIndex: nextIndex,
            frameId: nextKeys[nextIndex]
        });

    case PREVIOUS_FRAME:
        const prevIndex = Number(state.frameIndex) - 1;
        const prevKeys = Object.keys( state.previewList );
        return Object.assign({}, state, {
            frameIndex: prevIndex,
            frameId: prevKeys[prevIndex]
        });

    case CLEAR_TASK_PLAIN:
        return Object.assign({}, state, {
            subtasksList: [],
            hasSubtasksLoaded: false
        });

    default:
        return state;
    }
}

export default setSingleFrames