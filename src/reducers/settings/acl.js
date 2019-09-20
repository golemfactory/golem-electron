import someFP from 'lodash/fp/some';
import filter from 'lodash/filter';
import includes from 'lodash/fp/includes';
import { dict } from './../../actions';
import createCachedSelector from 're-reselect';

const { SET_ACL_NODE_LIST, SET_KNOWN_PEERS } = dict;

const initialState = {
    nodeListACL: {},
    knownPeers: []
};
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
};

export default setACL;

const includesValue = val => someFP(includes(val));

function diffArray(a = [], b = []) {
    const result = a.filter(
        item => !b.some(other => item.key === other.identity)
    );
    return result;
}

function extractData(peerList, aclList, key) {
    const listDiff = diffArray(peerList, aclList?.rules);
    const filteredList =
        key == 0 ? listDiff : filter(listDiff, includesValue(key));
    return filteredList;
}

export const getKnownPeersSelector = createCachedSelector(
    state => state.knownPeers,
    state => state.nodeListACL,
    (state, filter) => filter,
    (peerList, aclList, filter) => extractData(peerList, aclList, filter)
)(
    () => 'aclFilter' // Cache selectors by type name
);
