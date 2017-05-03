import { dict } from './../../actions'

const {SET_RESOURCES} = dict

const initialState = {
    resource: 0
}
const setResources = (state = initialState, action) => {
    switch (action.type) {
    case SET_RESOURCES:
        return Object.assign({}, state, {
            resource: action.payload
        });

    default:
        return state;
    }
}

export default setResources