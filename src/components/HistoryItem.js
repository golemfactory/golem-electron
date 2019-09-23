import React, { Component } from 'react';
import Tooltip from '@tippy.js/react';
import { timeStampToHR } from '../utils/time';
import {
	ETH_DENOM,
	mainEtherscanTx,
	testEtherscanTx
} from '../constants/variables';
const { clipboard } = window.electron;

const operation = {
	TRANSFER: 'transfer',
	TASK_PAYMENT: 'task_payment',
	DEPOSIT: 'deposit_transfer'
};

const filter = {
	PAYMENT: 'outgoing',
	INCOME: 'incoming',
	DEPOSIT: 'deposit'
};

/**
 * { Class for not found(404) component. }
 *
 * @class      NotFound (name)
 */
export default class HistoryItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDataCopied: {}
		};

		this.copyTimeout = false;
	}

	componentWillUnmount() {
		this.copyTimeout && clearTimeout(this.copyTimeout);
	}

	_copyField = item => {
		if (this.copyTimeout && this.state.isDataCopied) return;

		if (item) {
			clipboard.writeText(item);
			this.setState(prevData => {
				const isDataCopied = prevData.isDataCopied;
				isDataCopied[item] = !isDataCopied[item];
				return { isDataCopied };
			});
			this.copyTimeout = setTimeout(() => {
				this.setState(prevData => {
					const isDataCopied = prevData.isDataCopied;
					isDataCopied[item] = !isDataCopied[item];
					return { isDataCopied };
				});
				clearTimeout(this.copyTimeout);
				this.copyTimeout = null;
			}, 2000);
		}
	};

	_fetchTitle = (operation_type, direction) => {
		switch (operation_type) {
			case operation.TRANSFER:
				if (direction == filter.PAYMENT) return 'Withdraw';
				if (direction == filter.INCOME) return 'Top Up';
				if (direction == filter.DEPOSIT) return 'Deposit Payment';
			case operation.TASK_PAYMENT:
				if (direction == filter.PAYMENT) return 'Job payment';
				if (direction == filter.INCOME) return 'Income for job';
				if (direction == filter.DEPOSIT) return 'Deposit Payment';
			case operation.DEPOSIT:
				if (direction == filter.PAYMENT) return 'Deposit payment';
				if (direction == filter.INCOME) return 'Deposit Withdraw';
				if (direction == filter.DEPOSIT) return 'Deposit Payment';
		}
	};

	render() {
		const { paymentHistory, isMainNet, tx } = this.props;
		const { isDataCopied } = this.state;
		const {
			payee,
			payer,
			created,
			status,
			amount,
			direction,
			operation_type,
			sender_address,
			recipient_address,
			task_payment,
			transaction_hash
		} = tx.data;
		return (
			<div className="item__history">
				<div className="info__history">
					<div>
						<span>
							<h5>
								{this._fetchTitle(operation_type, direction)}
							</h5>
							{operation_type === operation.TASK_PAYMENT && (
								<Tooltip
									content={
										<p>
											{isDataCopied[
												(task_payment?.subtask_id)
											]
												? 'Copied successfully!'
												: 'Copy Subtask ID'}
										</p>
									}
									placement="bottom"
									trigger="mouseenter"
									size="small"
									hideOnClick={false}
									isEnabled={!!task_payment}>
									<span
										className={`icon-copy ${
											!!task_payment
												? ''
												: 'icon--color-gray'
										}`}
										onClick={
											!!task_payment
												? this._copyField.bind(
														null,
														task_payment?.subtask_id
												  )
												: undefined
										}
									/>
								</Tooltip>
							)}
						</span>
						<span>
							<b>
								{direction == filter.PAYMENT
									? 'Payee'
									: 'Payer'}
								:{' '}
							</b>
							<Tooltip
								content={
									<p>
										{isDataCopied[
											direction == filter.PAYMENT
												? recipient_address
												: sender_address
										]
											? 'Copied successfully!'
											: 'Copy Node Address'}
									</p>
								}
								placement="bottom"
								trigger="mouseenter"
								size="small"
								hideOnClick={false}>
								<span
									className="node-address"
									onClick={this._copyField.bind(
										null,
										direction == filter.PAYMENT
											? recipient_address
											: sender_address
									)}>
									{(direction == filter.PAYMENT
										? recipient_address
										: sender_address
									).replace(
										new RegExp('^(.{0,4}).*(.{4})$', 'im'),
										'$1...$2'
									)}
								</span>
							</Tooltip>
						</span>
					</div>
					<span>{timeStampToHR(created)}</span>
					<span className="status__history">{status}</span>
				</div>
				<div className="action__history">
					<span className="amount__history">
						<span
							className={`finance__indicator ${
								direction === filter.PAYMENT
									? 'indicator--down'
									: 'indicator--up'
							}`}>
							{direction === filter.PAYMENT ? '- ' : '+ '}
						</span>
						{(
							(!!Number(amount)
								? amount
								: task_payment?.missing_amount) / ETH_DENOM
						).toFixed(4)}
						{isMainNet ? ' ' : ' t'}GNT
					</span>
					{transaction_hash && (
						<Tooltip
							content={<p>See on Etherscan</p>}
							placement="bottom"
							trigger="mouseenter">
							<a
								href={`${
									isMainNet
										? mainEtherscanTx
										: testEtherscanTx
								}${transaction_hash}`}>
								<span className="icon-new-window" />
							</a>
						</Tooltip>
					)}
				</div>
			</div>
		);
	}
}
