import React from 'react';
import { animated } from 'react-spring/renderprops.cjs';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './../../actions';
import { getStatus } from './../../reducers';

import { componentStatus } from './../../constants/statusDicts';

const ModuleStatus = ({
	connectionProblem,
	golemDotClass,
	opacity,
	position,
	networkInfo,
	stats,
	status,
	transform
}) => {
	return (
		<animated.div
			style={{
				opacity: opacity.interpolate(opacity => opacity),
				transform: transform.interpolate(y => `translateX(${y}px)`),
				position: position
			}}
			className="status-node__loading">
			{status?.client?.status &&
			status.client.status !== componentStatus.EXCEPTION ? (
				<div className="status__components">
					<div className="item__status">
						<div>
							<span
								className={`component-dot component-dot--${golemDotClass(
									status?.hyperdrive,
									connectionProblem
								)}`}
							/>
							<span>Hyperg: </span>
						</div>
						<span>{status?.hyperdrive?.message}</span>
					</div>
					<div className="item__status">
						<div>
							<span
								className={`component-dot component-dot--${golemDotClass(
									status?.hypervisor,
									connectionProblem
								)}`}
							/>
							<span>Hypervisor: </span>
						</div>
						<span>{status?.hypervisor?.message}</span>
					</div>
					<div className="item__status">
						<div>
							<span
								className={`component-dot component-dot--${golemDotClass(
									status?.docker,
									connectionProblem
								)}`}
							/>
							<span>Docker: </span>
						</div>
						<span>{status?.docker?.message}</span>
					</div>
					<div className="item__status">
						<div>
							<span
								className={`component-dot component-dot--${golemDotClass(
									status?.ethereum,
									connectionProblem
								)}`}
							/>
							<span>Geth: </span>
						</div>
						<span>{status?.ethereum?.message}</span>
					</div>
				</div>
			) : (
				<span>Error while fetching status</span>
			)}
		</animated.div>
	);
};

ModuleStatus.displayName = 'ModuleStatus';

const mapStateToProps = state => ({
	connectionProblem: state.info.connectionProblem,
	networkInfo: state.info.networkInfo,
	status: getStatus(state, 'golemStatus'),
	stats: state.stats.stats.provider || state.stats.stats
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(Actions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ModuleStatus);
