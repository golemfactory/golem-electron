import { eventChannel, buffers } from 'redux-saga';
import { fork, takeLatest, take, call, put } from 'redux-saga/effects';
import { dict } from '../actions';

import { config, _handleRPC } from './handler';

const { SET_ACL_MODE, SET_ACL_NODE_LIST, SET_KNOWN_PEERS } = dict;

export function getIPsACL(session) {
	return new Promise((resolve, reject) => {
		function on_info(args) {
			let info = args[0];
		}
		_handleRPC(on_info, session, config.GET_ACL_IP_STATUS_RPC);
	});
}

export function* ipListBase(session) {
	const action = yield call(getIPsACL, session);
	yield put(action);
}

export function getNodesACL(session) {
	return new Promise((resolve, reject) => {
		function on_info(args) {
			let info = args[0];
			resolve({
                type: SET_ACL_NODE_LIST,
                payload: info
            })
		}
		_handleRPC(on_info, session, config.GET_ACL_STATUS_RPC);
	});
}

export function* nodeListBase(session) {
	const action = yield call(getNodesACL, session);
	yield put(action);
}

export function setupACL(session, payload) {
	return new Promise((resolve, reject) => {
		function on_info(args) {
			let info = args[0];
			resolve(info)
		}
		_handleRPC(on_info, session, config.SETUP_ACL_RPC, [...payload]);
	});
}

export function* setupACLBase(session, {payload, _resolve, _reject}) {
	const action = yield call(setupACL, session, payload);
	const actionNodes = yield call(getNodesACL, session);
	yield put(actionNodes);
	_resolve(action);
}

export function getKnownPeers(session) {
	return new Promise((resolve, reject) => {
		function on_info(args) {
			let info = args[0];
			resolve({
				type: SET_KNOWN_PEERS,
				payload: info
			})
		}
		_handleRPC(on_info, session, config.GET_KNOWN_PEERS_RPC);
	});
}

export function* knownPeersBase(session) {
	const action = yield call(getKnownPeers, session);
	yield put(action);
}

/**
 * [*aclFlow generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* aclFlow(session) {
	yield fork(knownPeersBase, session);
	yield fork(nodeListBase, session);
	yield fork(ipListBase, session);
	yield takeLatest(SET_ACL_MODE, setupACLBase, session);
}
