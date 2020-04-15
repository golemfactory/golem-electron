import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './../../actions';
import {
  getStatus
} from './../../reducers';

import { animated } from 'react-spring/renderprops.cjs';
import { componentStatus } from './../../constants/statusDicts';

function _fetchEnvironment(env) {
	switch (env) {
		case 'BLENDER': 		return ' (CPU - Blender)';
		case 'BLENDER_NVGPU': 	return ' (GPU - Blender)';
		case 'BLENDER_SGX': 	return ' (SGX - Blender)';
		case 'WASM': 			return ' (CPU - gWasm)';
		default: 				return '';
	}
}

function _fetchState(stat) {
	if (stat) {
		let state = stat.status;
		if (stat?.environment) {
			state += _fetchEnvironment(stat.environment);
		}
		return state;
	}
}

const ProviderStatus = ({
	actions,
	isGracefulShutdownEnabled,
	opacity,
	position,
	stats,
	status,
	transform
}) => {

	const _cancelShutdown = () => actions.gracefulShutdown();
  const _forceQuit = () => actions.toggleForceQuit();

	return (
		<animated.div
			style={{
				opacity: opacity.interpolate(opacity => opacity),
				transform: transform.interpolate(y => `translateX(${y}px)`),
				position: position
			}}
			className="status-node">
			<span>Provider state: {_fetchState(stats.provider_state)}</span>
			<br />
			{status?.client?.status === componentStatus.SHUTDOWN ||
			isGracefulShutdownEnabled ? (
				<div className="action__graceful-shutdown">
					<div
						className="action__graceful-shutdown-item"
						onClick={cancelShutdown}>
						<span className="icon-failure" />
						<span>Cancel shutdown</span>
					</div>
					<div className="action__graceful-shutdown-item" onClick={forceQuit}>
						<span className="icon-force-quit" />
						<span>Force quit</span>
					</div>
				</div>
			) : (
				[
					<span key="stats_01">
						Attempted:{' '}
						{stats.subtasks_computed &&
							stats.subtasks_computed[1] +
								stats.subtasks_with_timeout[1] +
								stats.subtasks_with_errors[1]}
					</span>,
					<br key="stats_02" />,
					<span key="stats_03">
						{stats.subtasks_with_errors &&
							`${
								stats.subtasks_with_errors[1]
							} error | ${stats.subtasks_with_timeout &&
								stats
									.subtasks_with_timeout[1]} timeout | ${stats.subtasks_accepted &&
								stats.subtasks_accepted[1]} success`}
					</span>
				]
			)}
		</animated.div>
	);
};

ProviderStatus.displayName = 'ProviderStatus';

const mapStateToProps = state => ({
	status: getStatus(state, 'golemStatus'),
	stats: state.stats.stats.provider || state.stats.stats,
	isGracefulShutdownEnabled: state.info.isGracefulShutdownEnabled
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(Actions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProviderStatus);
