import { eventChannel, buffers } from 'redux-saga';
import { fork, takeLatest, take, call, put } from 'redux-saga/effects';
import { dict } from '../actions';

import { config, _handleRPC } from './handler';

const {
	SET_ACL_MODE,
	SET_ACL_NODE_LIST,
	SET_KNOWN_PEERS,
	BLOCKED_NODES,
	TRUSTED_NODE
} = dict;

export function trustNode(session, payload, _resolve, _reject) {
	function on_info(args) {
		let info = args[0];
		resolve(info);
	}
	function on_error(error) {
		_reject(error);
	}
	_handleRPC(on_info, session, config.TRUST_NODE_RPC, [payload], on_error);
}

export function* trustNodeBase(session, { payload, _resolve, _reject }) {
	yield call(trustNode, session, payload, _resolve, _reject);
	const nodeList = yield call(getNodesACL, session);
	yield put(nodeList);
}

export function blockNodes(session, payload, _resolve, _reject) {
	function on_info(args) {
		let info = args[0];
		_resolve(info);
	}
	function on_error(error) {
		_reject(error);
	}
	_handleRPC(on_info, session, config.BLOCK_NODE_RPC, [payload], on_error);
}

export function* blockNodesBase(session, { payload, _resolve, _reject }) {
	yield call(blockNodes, session, payload, _resolve, _reject);
	const nodeList = yield call(getNodesACL, session);
	yield put(nodeList);
}

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
			});
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
			resolve(info);
		}
		_handleRPC(on_info, session, config.SETUP_ACL_RPC, [...payload]);
	});
}

export function* setupACLBase(session, { payload, _resolve, _reject }) {
	const action = yield call(setupACL, session, payload);
	const actionNodes = yield call(getNodesACL, session);
	yield put(actionNodes);
	_resolve(action);
}

export function getKnownPeers(session) {
	const interval = 2000;

	return eventChannel(emit => {
		const fetchUnsupportedStats = () => {
			function on_stats(args) {
				let peers = args[0];
				emit({
					type: SET_KNOWN_PEERS,
					payload: peers
				});
			}

			_handleRPC(on_stats, session, config.GET_KNOWN_PEERS_RPC);
		};

		const fetchOnStartup = () => {
			fetchUnsupportedStats();

			return fetchOnStartup;
		};

		const channelInterval = setInterval(fetchOnStartup(), interval);

		return () => {
			console.log('negative');
			clearInterval(channelInterval);
		};
	});
}

export function* knownPeersBase(session) {
	const channel = yield call(getKnownPeers, session);
	try {
		while (true) {
			let action = yield take(channel);
			yield put(action);
		}
	} finally {
		console.info('yield cancelled!');
		channel.close();
	}
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
	yield takeLatest(BLOCKED_NODES, blockNodesBase, session);
	yield takeLatest(TRUSTED_NODE, trustNodeBase, session);
}
