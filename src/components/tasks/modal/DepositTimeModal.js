import React from "react";

export default class DepositTimeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTaskWithoutConcent: true
        };
    }

    _toggleConcentTaskSwitch = () => {
        this.setState( prevState => ({
            isTaskWithoutConcent: !prevState.isTaskWithoutConcent
        }));
    };

    _handleCancel = () => this.props.closeModal("depositTimeModal");

    _handleApply = () => {
        this.props.createTaskOnHighGas(!this.state.isTaskWithoutConcent, true);
    };

    render() {
        const { isTaskWithoutConcent } = this.state;
        return (
            <div className="container__modal container__deposit-time-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-locked" />
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
                    <div className="checkbox-item">
                        <input
                            id="concentTaskCheckbox"
                            type="checkbox"
                            name="concentForTask"
                            defaultChecked={true}
                            onChange={this._toggleConcentTaskSwitch}
                        />
                        <label
                            htmlFor="concentTaskCheckbox"
                            className="checkbox-label-left">
                            Compute this task with
                            {!isTaskWithoutConcent ? "" : "out"} concent.
                        </label>
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
