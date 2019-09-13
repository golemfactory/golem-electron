import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';
import Tooltip from '@tippy.js/react';
import isEqual from 'lodash/isEqual';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../../../actions';
import { ETH_DENOM } from '../../../../../constants/variables';
import { taskStatus } from '../../../../../constants/statusDicts';
import ConditionalRender from '../../../../hoc/ConditionalRender';

import SubtaskInfo from './SubtaskInfo';

const mapStateToProps = state => ({
	balance: state.realTime.balance,
	currency: state.currency,
	estimatedCost: state.details.estimated_cost,
	concentBalance: state.realTime.concentBalance,
	concentSwitch: state.concent.concentSwitch,
	isMainNet: state.info.isMainNet
});
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(Actions, dispatch)
});

class Estimation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			GNT: new BigNumber(0),
			ETH: new BigNumber(0),
			GNT_suggested: new BigNumber(0),
			GNT_required: new BigNumber(0),
			ETH_deposit: new BigNumber(0)
		};

		this._handleConcentCheckbox = this._handleConcentCheckbox.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.GNT.isEqualTo(nextProps.estimatedCost.GNT)) {
			let { GNT, ETH, deposit } = nextProps.estimatedCost;
			let { GNT_suggested, GNT_required, ETH: ETH_deposit } = deposit;

			this.setState({
				GNT: new BigNumber(GNT),
				ETH: new BigNumber(ETH),
				GNT_suggested: new BigNumber(GNT_suggested),
				GNT_required: new BigNumber(GNT_required),
				ETH_deposit: new BigNumber(ETH_deposit)
			});
		}
	}

	componentWillMount() {
		const { actions, isPartial, item } = this.props;

		actions.getEstimatedCost({
			type: item.type,
			options: item.options,
			id: item.id,
			subtask_ids: item?.subtask_ids,
			partial: isPartial
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			!this.state.GNT.isEqualTo(nextProps.estimatedCost.GNT) ||
			nextProps.isConcentOn !== this.props.isConcentOn
		) {
			return true;
		}
		return !isEqual(nextProps.balance, this.props.balance);
	}

	_handleConcentCheckbox(e) {
		this.props._handleConcentCheckbox(
			e.target.checked && this.props.concentSwitch
		);
	}

	_fetchTitle = (isConcentOn, isPartial, isSubtask, item) => {
		if (isConcentOn) {
			return (
				<span>
					You are restarting concent task.
					<br />
					Please confirm the amount that is required for toping up
					your Concent Service deposit:
				</span>
			);
		} else {
			if (isPartial) {
				return <span>Restarting only timed out subtasks</span>;
			} else {
				return isSubtask ? (
					<SubtaskInfo item={item} />
				) : (
					<span>Restarting whole task as a new one</span>
				);
			}
		}
	};

	render() {
		const {
			GNT,
			ETH,
			GNT_suggested,
			GNT_required,
			ETH_deposit
		} = this.state;
		const {
			actions,
			balance,
			concentBalance,
			concentSwitch,
			currency,
			estimatedCost,
			isConcentOn,
			isMainNet,
			isPartial,
			isSubtask,
			item
		} = this.props;
		return (
			<div className="container__estimation">
				<span className="container__estimation__title">
					{this._fetchTitle(isConcentOn, isPartial, isSubtask, item)}
				</span>
				<ConditionalRender
					showIf={
						item.concent_enabled &&
						concentSwitch &&
						!isMainNet &&
						item.status !== taskStatus.COMPUTING &&
						item.status !== taskStatus.WAITING
					}>
					<div className="switch-box switch-box--green">
						<label className="switch">
							<input
								type="checkbox"
								aria-label="Task Based Concent Checkbox"
								tabIndex="0"
								checked={isConcentOn && concentSwitch}
								onChange={this._handleConcentCheckbox}
							/>
							<div className="switch-slider round" />
						</label>
						<span className="switch-label switch-label--right">
							Restart with{isConcentOn ? '' : 'out'} Concent
							Service
						</span>
					</div>
				</ConditionalRender>
				<span className="summary-title">You have</span>
				<div className="summary">
					<div className="summary-item">
						<span className="summary-currency">
							<h4>{balance[0].toFixed(6)}</h4>{' '}
							{isMainNet ? '' : 't'}GNT
						</span>
						<span className="summary-currency">
							<h4>{balance[1].toFixed(6)}</h4>{' '}
							{isMainNet ? '' : 't'}ETH
						</span>
					</div>
					<ConditionalRender showIf={concentSwitch && !isMainNet}>
						<div className="summary-item">
							<sub>Deposit balance</sub>
							<sub>
								<b>
									{concentBalance?.value
										.dividedBy(ETH_DENOM)
										.toFixed(4)}
								</b>
								{isMainNet ? ' ' : ' t'}
								GNT
							</sub>
						</div>
					</ConditionalRender>
				</div>
				<span className="summary-title">Total</span>
				<div className="summary">
					<div className="summary-item">
						<sub>
							est. {isMainNet ? '' : 't'}$
							{GNT.multipliedBy(currency.GNT).toFixed(4)}
						</sub>
						<span className="summary-currency">
							<h4>{GNT.toFixed(4)}</h4> {isMainNet ? '' : 't'}GNT
						</span>
					</div>
					<div className="summary-item">
						<sub>
							est. {isMainNet ? '' : 't'}$
							{ETH.multipliedBy(currency.ETH).toFixed(4)}
						</sub>
						<span className="summary-currency">
							<h4>{ETH.toFixed(4)}</h4> {isMainNet ? '' : 't'}ETH
						</span>
					</div>
					<ConditionalRender
						showIf={
							item.concent_enabled &&
							isConcentOn &&
							concentSwitch &&
							!isMainNet
						}>
						<Tooltip
							content={
								<p>
									Minimum amount of GNT that is required (no
									less than twice the amount of funds in your
									Deposit for covering a task payment). <br />
									<a href="https://docs.golem.network/#/Products/Brass-Beta/Usage?id=how-does-it-work">
										Learn more
									</a>
								</p>
							}
							placement="top"
							size="small"
							trigger="mouseenter"
							interactive>
							<div className="summary-item deposit">
								<sub>
									Deposit required
									<span className="icon-question-mark" />
								</sub>
								<span className="summary-currency">
									<h4>{GNT_required.toFixed(4)}</h4>{' '}
									{isMainNet ? '' : 't'}GNT
								</span>
							</div>
						</Tooltip>
						<Tooltip
							content={
								<p>
									In order to save transaction fees cost of
									future tasks the Concent Service will try to
									update your Deposit with higher amount.{' '}
									<br />
									<a href="https://docs.golem.network/#/Products/Brass-Beta/Usage?id=why-is-deposit-amount-higher-than-the-cost-of-task">
										Learn more
									</a>
								</p>
							}
							placement="top"
							size="small"
							trigger="mouseenter"
							interactive>
							<div className="summary-item deposit">
								<sub>
									Deposit suggested
									<span className="icon-question-mark" />
								</sub>
								<span className="summary-currency">
									<h4>{GNT_suggested.toFixed(4)}</h4>{' '}
									{isMainNet ? '' : 't'}GNT
								</span>
							</div>
						</Tooltip>
						<div className="summary-item deposit">
							<sub>Deposit tx fee</sub>
							<span className="summary-currency">
								<h4>{ETH_deposit.toFixed(4)}</h4>{' '}
								{isMainNet ? '' : 't'}ETH
							</span>
						</div>
					</ConditionalRender>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Estimation);
