import { dict } from './../../actions'

const {SET_PREVIEW} = dict

const initialState = {
    preview: null
}
const setPreview = (state = initialState, action) => {
    switch (action.type) {
    case SET_PREVIEW:
        return Object.assign({}, state, {
            preview: action.payload
        });

    default:
        return state;
    }
}

export default setPreview