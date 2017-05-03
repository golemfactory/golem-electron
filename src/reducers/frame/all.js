import { dict } from './../../actions'

const {SET_ALL_FRAMES} = dict

const initialState = {
    frameList: []
}
const setAllFrames = (state = initialState, action) => {
    switch (action.type) {

    case SET_ALL_FRAMES:
        return Object.assign({}, state, {
            frameList: action.payload
        });


    default:
        return state;
    }
}

export default setAllFrames