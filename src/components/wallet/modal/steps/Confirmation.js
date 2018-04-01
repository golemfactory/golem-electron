import React from 'react';
import {BigNumber} from 'bignumber.js';

import {modals, currencyIcons} from './../../../../constants'

const {clipboard } = window.electron
const ETH_DENOM = 10 ** 18; //POW shorthand thanks to ES6

export default class Confirmation extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            lockApply: false
        }
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleBack() {
        this.props.backHandler()
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleApply() {
        const {formData, suffix} = this.props
        const {amount, sendTo} = formData
        this.setState({
            lockApply: true
        }, () => this.props.applyHandler(amount, sendTo, suffix))
        
    }

    render() {
        const {type, suffix, formData, currency, gasCost} = this.props
        const {amount, sendTo} = formData
        const { lockApply } = this.state
        return (
                <div className="content__modal content__modal--confirmation ">
                    <div>
                        <div className="currency-tag">
                        	<strong className="info-label">sending</strong>
                        	<br/>
                        	<strong className="info-price">{amount.dividedBy(ETH_DENOM).toFixed(4)}...</strong><span>{suffix}</span>
                        	<br/>
                        	<span className="info-estimation">est. {amount.dividedBy(ETH_DENOM).multipliedBy(currency[suffix]).toFixed(4)} $</span>
                        </div>
                    </div>
                    <div>
                        <strong className="info-label">to</strong>
                        <br/>
                        <span className="info-address">{sendTo}</span>
                    </div>
                    <div className="info-gas__container">
                        <strong className="info-label">GAS price</strong>
                        <br/>
                        <strong className="info-price">{gasCost.dividedBy(ETH_DENOM).toFixed(4)}...</strong><span>ETH</span>
                        <br/>
                        <span className="info-estimation">est. 0.65 $</span>
                    </div>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleBack}>Back</span>
                        <button type="button" className="btn--primary" onClick={::this._handleApply} disabled={lockApply} autoFocus>Send</button>
                    </div>
                </div>
        );
    }
}
