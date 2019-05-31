import React from 'react';
import PropTypes from 'prop-types';

const Estimation = ({ balance, currency, estimatedCost, isPartial }) => {
	const { GNT, ETH, deposit } = estimatedCost;
	return (
		<div className="container__estimation">
			<span>
				{isPartial
					? 'Restarting only timed out subtasks'
					: 'Restarting whole task as a new one'}
			</span>
			<div className="summary">
				<div className="summary-item">
					<h4>{GNT.toFixed(8)} GNT</h4>
					<sub>Available: {balance[0].toFixed(8)} GNT</sub>
				</div>
				<div className="summary-item">
					<h4>{ETH.toFixed(8)} ETH</h4>
					<sub>Available: {balance[1].toFixed(8)} GNT</sub>
				</div>
			</div>
		</div>
	);
};

Estimation.displayName = 'Estimation';

Estimation.propTypes = {
	balance: PropTypes.array.isRequired,
	estimatedCost: PropTypes.object.isRequired,
	isPartial: PropTypes.bool
};

export default Estimation;
