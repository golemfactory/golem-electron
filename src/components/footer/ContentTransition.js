import React, { useEffect, useState } from 'react';
import { Transition, animated } from 'react-spring/renderprops.cjs';

import ModuleStatus from './ModuleStatus';
import PortStatus from './PortStatus';
import ProviderStatus from './ProviderStatus';

import { componentStatus } from './../../constants/statusDicts';

const phases = ['MODULE', 'PORT', 'PROVIDER'];

const styles = {
	FROM: {
		position: 'absolute',
		opacity: 0,
		transform: 90
	},
	ENTER: {
		position: 'initial',
		opacity: 1,
		transform: 0
	},
	LEAVE: {
		position: 'absolute',
		opacity: 0,
		transform: -180
	}
};

const ContentTransition = ({
	golemDotClass,
	portSkipped,
	setPortInfo,
	skipPortChecker,
	stats,
	status
}) => {
	const [phase, setPhase] = useState(phases[0]);

	useEffect(() => {
		const ifPortCheckable =
			(stats && !!Object.keys(stats).length) ||
			status?.client?.message.includes('configuration') ||
			status?.client?.status === componentStatus.SHUTDOWN;
		if (portSkipped) setPhase(phases[2]);
		else if (ifPortCheckable) setPhase(phases[1]);
		else setPhase(phases[0]);

	}, [portSkipped, stats, status]);
	return (
		<Transition
			native
			initial={null}
			items={phase}
			from={styles.FROM}
			enter={styles.ENTER}
			leave={styles.LEAVE}>
			{phase => {
				switch (phase) {
					case phases[2]:
						return props => <ProviderStatus {...props} />;
					case phases[1]:
						return props => (
							<PortStatus
								{...props}
								golemDotClass={golemDotClass}
								setPortInfo={setPortInfo}
								skipChecker={skipPortChecker}
							/>
						);
					case phases[0]:
						return props => (
							<ModuleStatus {...props} golemDotClass={golemDotClass} />
						);
				}
			}}
		</Transition>
	);
};

ContentTransition.displayName = 'ContentTransition';

export default ContentTransition;
