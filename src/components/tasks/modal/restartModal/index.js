import React from 'react';
import Lottie from 'react-lottie';

import RestartOptions from './steps/Options';
import Estimation from './steps/Estimation';

import animData from './../../../../assets/anims/restart-task';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class RestartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTimedOutOnly: false,
            nextStep: false
        };
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.closeModal();

    _handleRestartOptionChange = e => {
        this.setState({
            isTimedOutOnly: e.target.value === 'pick'
        });
    };

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleRestart = () => {
        const { isTimedOutOnly, nextStep } = this.state;
        const { restartCallback, item } = this.props;
        if (!nextStep) {
            this.setState(
                {
                    nextStep: true
                },
                () => {
                    this.props.actions.getEstimatedCost({
                        type: item.type,
                        options: item.options,
                        id: item.id,
                        partial: isTimedOutOnly
                    });
                }
            );
            return;
        }
        restartCallback(item.id, isTimedOutOnly);
        this.props.closeModal();
    };

    render() {
        const { isTimedOutOnly, nextStep } = this.state;
        const { balance, currency, item, estimatedCost } = this.props;
        return (
            <div className="container__modal container__restart-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    {!nextStep ? (
                        <RestartOptions
                            handleOptionChange={this._handleRestartOptionChange}
                            status={item.status}
                        />
                    ) : (
                        <Estimation 
                            balance={balance}
                            currency={currency}
                            estimatedCost={estimatedCost} 
                            isPartial={isTimedOutOnly}/>
                    )}

                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Cancel
                        </span>
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleRestart}
                            autoFocus>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
