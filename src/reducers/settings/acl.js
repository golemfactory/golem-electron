import { dict } from './../../actions'

const { SET_ACL_NODE_LIST, SET_KNOWN_PEERS } = dict

const initialState = {
    nodeListACL: {},
    knownPeers: []
}
const setACL = (state = initialState, action) => {
    switch (action.type) {

    case SET_ACL_NODE_LIST:
        return Object.assign({}, state, {
            nodeListACL: action.payload
        });

    case SET_KNOWN_PEERS:
        return Object.assign({}, state, {
            knownPeers: action.payload
        });

    default:
        return state;
    }
}

export default setACL