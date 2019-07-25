import { dict } from './../../actions'

const { SET_ACL_NODE_LIST } = dict

const initialState = {
    nodeListACL: {}
}
const setACL = (state = initialState, action) => {
    switch (action.type) {

    case SET_ACL_NODE_LIST:
        return Object.assign({}, state, {
            nodeListACL: action.payload
        });

    default:
        return state;
    }
}

export default setACL