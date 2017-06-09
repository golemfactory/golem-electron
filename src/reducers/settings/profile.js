import { dict } from './../../actions'

const {SET_AVATAR, SET_NODE_NAME, SET_NET_PROV_TRUST, SET_NET_REQ_TRUST} = dict

const initialState = {
    avatar: null,
    nodeName: null,
    networkRequestorTrust: 0,
    networkProviderTrust: 0
}

const setProfile = (state = initialState, action) => {
    switch (action.type) {
    case SET_AVATAR:
        return Object.assign({}, state, {
            avatar: action.payload
        });

    case SET_NODE_NAME:
        return Object.assign({}, state, {
            nodeName: action.payload
        });

    case SET_NET_PROV_TRUST:
        return Object.assign({}, state, {
            networkRequestorTrust: action.payload
        });

    case SET_NET_REQ_TRUST:
        return Object.assign({}, state, {
            networkProviderTrust: action.payload
        });

    default:
        return state;
    }
}

export default setProfile