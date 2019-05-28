import React from "react";
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/warning';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class DepositTimeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            withConcent: true
        };
    }

    _toggleConcentTaskSwitch = () => {
        this.setState( prevState => ({
            withConcent: !prevState.withConcent
        }));
    };

    _handleCancel = () => this.props.closeModal("depositTimeModal");

    _handleApply = () => this.props.createTaskOnHighGas(this.state.withConcent);

    render() {
        const { withConcent } = this.state;
        return (
            <div className="container__modal container__deposit-time-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    <div className="deposit-time__desc">
                        <span>
                            Due to current high gas prices, we cannot guarantee
                            that Deposit creation time will be acceptable.
                        </span>
                    </div>
                    <div className="deposit-time__tips">
                        <span>
                            We strongly recommend commisioning this task without
                            Concent Service. If you want to compute with Concent
                            Service wait for the gas price to normalize.
                        </span>
                    </div>
                    <div className="checkbox-group">
                        <div
                            className="checkbox-item"
                            onChange={this._toggleConcentTaskSwitch}>
                            <input
                                id="concentTaskCheckbox"
                                type="checkbox"
                                name="concentForTask"
                                defaultChecked={true}
                                onChange={this._toggleConcentTaskSwitch}
                            />
                            <label
                                htmlFor="concentTaskCheckbox">
                                <span className="overlay"/>
                                Compute this task with
                                {withConcent ? "" : "out"} concent.
                            </label>
                        </div>
                    </div>
                    <div className="deposit-time__action">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Cancel
                        </span>
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleApply}
                            autoFocus>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
