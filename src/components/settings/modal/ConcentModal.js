import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/deposit-unlock';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class ConcentModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            toggleConcentLock: false
        }
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
        console.log(evt.target.value)
        this.setState({
            toggleConcentLock: evt.target.value
        })
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal container__concent-modal">
                <div className="content__modal">
                    <div className="icon-container">
                        <Lottie options={defaultOptions}/>
                    </div>
                    <span>
                        Are you sure you don't want
                        <br/>to use concent anymore?
                    </span>
                    <div className="tips__conncent-modal">
                        Any tasks that have been started with Concent will
                        <br/>still continue to use the Concent Service until they're
                        <br/>finished and settled. Any future tasks as well as the
                        <br/>restarted tasks will be computed without the
                        <br/>Concent Service.
                    </div>
                    <div className="radio-group__concent-modal" onChange={this._handleUnlockCheckbox}>
                        <div className="radio-item">
                            <input type="radio" id="unlockConcentRadio" value={false} name="unlockDepositConcent" defaultChecked={true}/>
                            <label htmlFor="unlockConcentRadio">
                                <span className="overlay"/>
                                Leave the funds in the deposit
                            </label>
                        </div>
                        <div className="radio-item">
                            <input type="radio" id="unlockConcentRadio2" value={true} name="unlockDepositConcent"/>
                            <label htmlFor="unlockConcentRadio2">
                                <span className="overlay"/>
                                Withdraw deposited funds
                            </label>
                        </div>
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
