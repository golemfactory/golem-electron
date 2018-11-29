import React from 'react';

export default class ConcentModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.closeModal(true) //isCancel = true
    }

    /**
     * [_handleApply func. send information as callback and close modal]
     */
    _handleApply() {
        const {toggleConcentCallback} = this.props
        const {toggleConcentLock} = this.state

        toggleConcentCallback(toggleConcentLock)
        this.props.closeModal()
    }

    _handleUnlockCheckbox = evt => {
        console.log(evt)
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal container__concent-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-lock"/>
                    </div>
                    <span>
                        Are you sure you don't want
                        <br/>to use concent anymore?
                    </span>
                    <div className="checkbox-item" onChange={this._handleUnlockCheckbox}>
                        <input id="unlockConcentRadio" type="checkbox" name="taskType" defaultChecked={true} readOnly/>
                        <label htmlFor="unlockConcentRadio" className="radio-label-left">Leave the deposit locked</label>
                    </div>
                    <div className="tips__conncent-modal">
                        Any tasks that have been started with Concent will
                        <br/>still continue to use the Concent Service until they're
                        <br/>finished and settled. Any future tasks as well as the
                        <br/>restarted tasks will be computed without the
                        <br/>Concent Service.
                    </div>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={::this._handleApply} autoFocus>Yes</button>
                    </div>
                </div>
            </div>
        );
    }
}
