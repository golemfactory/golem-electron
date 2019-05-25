import React from 'react';
import { BigNumber } from 'bignumber.js';
import Lottie from 'react-lottie';

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
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.closeModal('insufficientAmountModal');

    _handleTopUp = () => window.routerHistory.push('/');

    _handleRetry = () => window.routerHistory.push('/tasks');

    render() {
        const { message } = this.props;
        const { error_details, error_msg, error_type } = message;
        
        return (
            <div className="container__modal container__task-error-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    <span className="info">
                        You {error_details ? "don't have enough funds to" : "cannot"} send this task to the
                        network.
                    </span>
                    <div className="amount__panel">
                        {error_details ? (
                            error_details?.missing_funds.map(item => (
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
                            ))
                        ) : (
                            <pre className="message-from-server">{message}</pre>
                        )}
                    </div>
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Cancel
                        </span>
                        {error_type === 'NotEnoughFunds' ? (
                            <button
                                type="button"
                                className="btn--primary"
                                onClick={this._handleTopUp}
                                autoFocus>
                                Top up
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn--primary"
                                onClick={this._handleRetry}
                                autoFocus>
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
