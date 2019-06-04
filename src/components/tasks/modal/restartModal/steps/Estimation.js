import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BigNumber } from 'bignumber.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../../../actions';
import ConditionalRender from '../../../../hoc/ConditionalRender';

import SubtaskInfo from './SubtaskInfo';

const ETH_DENOM = 10 ** 18;
const mapStateToProps = state => ({
	balance: state.realTime.balance,
	currency: state.currency,
	estimatedCost: state.details.estimated_cost,
	concentBalance: state.realTime.concentBalance
});
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(Actions, dispatch)
});
const Estimation = ({
	actions,
	balance,
	concentBalance,
	currency,
	estimatedCost,
	isPartial,
	item
}) => {
	const [isConcentOn, setConcent] = useState(item.concent_enabled);

	let { GNT, ETH, deposit } = estimatedCost;
	let { GNT_suggested, GNT_required, ETH: ETH_deposit } = deposit
	GNT = new BigNumber(GNT);
	ETH = new BigNumber(ETH);
	GNT_suggested = new BigNumber(GNT_suggested);
	GNT_required = new BigNumber(GNT_required);
	ETH_deposit = new BigNumber(ETH_deposit);

	actions.getEstimatedCost({
		type: item.type,
		options: item.options,
		id: item.id,
		partial: isPartial
	});

	function _handleConcentCheckbox(e){
		setConcent(e.target.checked)
	}

	return (
		<div className="container__estimation">
			<span>
				{isPartial
					? 'Restarting only timed out subtasks'
					: 'Restarting whole task as a new one'}
			</span>
			<SubtaskInfo />
			<ConditionalRender showIf={item.concent_enabled}>
				<div className="switch-box switch-box--green">
		            <label className="switch">
		                <input
		                    type="checkbox"
		                    aria-label="Task Based Concent Checkbox"
		                    tabIndex="0"
		                    checked={isConcentOn}
                            onChange={_handleConcentCheckbox}
		                />
		                <div className="switch-slider round" />
		            </label>
		            <span className="switch-label switch-label--right">
			            Restart with Concent Service
		            </span>
		        </div>
	        </ConditionalRender>
			<span className="summary-title">You have</span>
			<div className="summary">
				<div className="summary-item">
					<span className="summary-currency">
						<h4>{balance[0].toFixed(6)}</h4> GNT
					</span>
					<span className="summary-currency">
						<h4>{balance[1].toFixed(6)}</h4> ETH
					</span>
				</div>
				<div className="summary-item">
					<sub>Deposit balance</sub>
					<sub>
						<b>
							{concentBalance.value
								.dividedBy(ETH_DENOM)
								.toFixed(4)}
						</b>{' '}
						GNT
					</sub>
				</div>
			</div>
			<span className="summary-title">Total</span>
			<div className="summary">
				<div className="summary-item">
					<sub>est. ${GNT.multipliedBy(currency.GNT).toFixed(4)}</sub>
					<span className="summary-currency">
						<h4>{GNT.toFixed(4)}</h4> GNT
					</span>
				</div>
				<div className="summary-item">
					<sub>est. ${ETH.multipliedBy(currency.ETH).toFixed(4)}</sub>
					<span className="summary-currency">
						<h4>{ETH.toFixed(4)}</h4> ETH
					</span>
				</div>
				<ConditionalRender showIf={item.concent_enabled && isConcentOn}>
					<div className="summary-item deposit">
						<sub>Deposit required</sub>
						<span className="summary-currency">
							<h4>{GNT_required.toFixed(4)}</h4> GNT
						</span>
					</div>
					<div className="summary-item deposit">
						<sub>Deposit suggested</sub>
						<span className="summary-currency">
							<h4>{GNT_suggested.toFixed(4)}</h4> GNT
						</span>
					</div>
					<div className="summary-item deposit">
						<sub>Deposit tx fee</sub>
						<span className="summary-currency">
							<h4>{ETH_deposit.toFixed(4)}</h4> ETH
						</span>
					</div>
				</ConditionalRender>
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Estimation);
