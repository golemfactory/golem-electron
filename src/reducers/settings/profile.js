import { dict } from './../../actions'

const {SET_AVATAR, SET_PROFILE_CHARTS, SET_NODE_NAME} = dict

const initialState = {
    avatar: null,
    charts: {
        requestor: 30,
        provider: 16
    },
    nodeName: null
}
const setProfile = (state = initialState, action) => {
    switch (action.type) {
    case SET_AVATAR:
        return Object.assign({}, state, {
            avatar: action.payload
        });

    case SET_PROFILE_CHARTS:
        return Object.assign({}, state, {
            charts: action.payload
        });

    case SET_NODE_NAME:
        return Object.assign({}, state, {
            nodeName: action.payload
        });

    default:
        return state;
    }
}

export default setProfile