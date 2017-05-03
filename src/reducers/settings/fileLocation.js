import { dict } from './../../actions'

const {SET_FILE_LOCATION} = dict

const initialState = {
    location: ''
}
const setFileLocation = (state = initialState, action) => {
    switch (action.type) {

    case SET_FILE_LOCATION:
        return Object.assign({}, state, {
            location: action.payload
        });


    default:
        return state;
    }
}

export default setFileLocation