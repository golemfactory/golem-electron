import { dict } from './../../actions'

const {SET_PREVIEW, UPDATE_PREVIEW_LOCK} = dict

const initialState = {
    preview: null,
    ps: {
    	enabled: false,
    	id: null,
    	frameCount: null
    }

}
const setPreview = (state = initialState, action) => {
    switch (action.type) {
    case SET_PREVIEW:
        return Object.assign({}, state, {
            preview: action.payload
        });

    case UPDATE_PREVIEW_LOCK:
        return Object.assign({}, state, {
            ps: {
            	...action.payload
            }
        });

    default:
        return state;
    }
}

export default setPreview