import React from 'react';
import { BigNumber } from 'bignumber.js';
import Lottie from 'react-lottie';
import Tooltip from '@tippy.js/react';

import animData from './../../../assets/anims/warning';

const ETH_DENOM = 10 ** 18;

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class InsufficientAmountModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            withConcent: false
        };

        this._initContent = this._initContent.bind(this);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.closeModal('insufficientAmountModal');

    _handleTopUp = () => window.routerHistory.push('/wallet');

    _handleApply = () => {
        if (this.state.withConcent) {
            this._handleTopUp();
        } else {
            this.props.createTaskConditionally(false);
            this._handleCancel();
        }
    };

    _handleConcentCheckbox = e =>
        this.setState({ withConcent: e.target.value == 'true' });

    _initContent(message) {
        const { error_details, error_msg, error_type } = message;

        const createFundsInfo = missing_funds => {
            const result = [
                <div className="amount__panel" key="amountPanel">
                    {missing_funds.map(item => (
                        <div className="amount__item" key={item.currency}>
                            <div>
                                <span className="amount__missing">
                                    {new BigNumber(item.required)
                                        .dividedBy(ETH_DENOM)
                                        .toFixed(4)}{' '}
                                    {item.currency}
                                </span>
                            </div>
                            <div>
                                <center>Available:</center>
                                <span className="amount__available">
                                    <b>
                                        {new BigNumber(item.available)
                                            .dividedBy(ETH_DENOM)
                                            .toFixed(8)}
                                    </b>{' '}
                                    {item.currency}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ];
            if(error_type === 'NotEnoughDepositFunds')
                result.push(
                    <div
                        className="radio-group"
                        onChange={this._handleConcentCheckbox}
                        key="concentRadioGroup">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="createConcentRadio"
                                value={true}
                                name="createConcentRadio"
                                defaultChecked={true}
                            />
                            <label htmlFor="createConcentRadio">
                                <span className="overlay" />
                                Top up account and finish with Concent
                                <span className="icon-question-mark" />
                            </label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="createConcentRadio2"
                                value={false}
                                name="createConcentRadio"
                            />
                            <label htmlFor="createConcentRadio2">
                                <span className="overlay" />
                                Compute this task without concent
                                <span className="icon-question-mark" />
                            </label>
                        </div>
                    </div>
                );
            return result;
        };

        switch (error_type) {
            case 'NotEnoughFunds':
                return {
                    title:
                        "You don't have enough funds to send this task to the network.",
                    content: createFundsInfo(error_details?.missing_funds),
                    actionButton: (
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleTopUp}
                            autoFocus>
                            Top up
                        </button>
                    )
                };
            case 'NotEnoughDepositFunds':
                return {
                    title:
                        "You don't have enough deposit to create this task with concent.",
                    content: createFundsInfo(error_details?.missing_funds),
                    actionButton: (
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleApply}
                            autoFocus>
                            Apply
                        </button>
                    )
                };
            default:
                return {
                    title: 'You cannot send this task to the network.',
                    content: (
                        <pre className="message-from-server">{message}</pre>
                    ),
                    actionButton: (
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleCancel}
                            autoFocus>
                            Retry
                        </button>
                    )
                };
        }
    }

    render() {
        const { message } = this.props;
        const { title, content, actionButton } = this._initContent(message);

        return (
            <div className="container__modal container__task-error-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    <span className="info">{title}</span>
                    {content}
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Cancel
                        </span>
                        {actionButton}
                    </div>
                </div>
            </div>
        );
    }
}
