import React from 'react';
import Lottie from 'react-lottie';

import TaskOptions from './steps/TaskOptions';
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

export default class RestartModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isConcentOn: props?.item?.concent_enabled,
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

    _handleConcentCheckbox = value => {
        this.setState({
            isConcentOn: value
        });
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleRestart = () => {
        const { isConcentOn, isTimedOutOnly, nextStep } = this.state;
        const { restartCallback, item } = this.props;
        if (!nextStep) {
            this.setState({
                nextStep: true
            });
            return;
        }
        restartCallback(item.id, isTimedOutOnly, isConcentOn);
        this.props.closeModal();
    };

    render() {
        const { isConcentOn, isTimedOutOnly, nextStep } = this.state;
        const {
            isSubtask,
            item,
        } = this.props;

        return (
            <div className="container__modal container__restart-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    {!nextStep && !isSubtask ? (
                        <TaskOptions
                            handleOptionChange={this._handleRestartOptionChange}
                            status={item.status}
                        />
                    ) : (
                        <Estimation 
                            isConcentOn={isConcentOn} 
                            isPartial={isTimedOutOnly} 
                            isSubtask={isSubtask}
                            item={item}
                            _handleConcentCheckbox={this._handleConcentCheckbox}/>
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
