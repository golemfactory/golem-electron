import React from 'react';

import {modals, currencyIcons} from './../../../../constants'

const {clipboard } = window.electron

export default class Confirmation extends React.Component {


    constructor(props) {
        super(props);
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
        this.props.applyHandler(amount, sendTo, suffix)
    }

    render() {
        const {type, suffix, formData, currency} = this.props
        const {amount, sendTo} = formData
        return (
                <div className="content__modal content__modal--confirmation ">
                    <div>
                        <div className="currency-tag">
                        	<strong className="info-label">sending</strong>
                        	<br/>
                        	<strong className="info-price">{Number(amount).toFixed(4)}...</strong><span>{suffix}</span>
                        	<br/>
                        	<span className="info-estimation">est. {(Number(amount) * currency[suffix]).toFixed(4)} $</span>
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
                        <strong className="info-price">0.0213...</strong><span>ETH</span>
                        <br/>
                        <span className="info-estimation">est. 0.65 $</span>
                    </div>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleBack}>Back</span>
                        <button type="button" className="btn--primary" onClick={::this._handleApply} autoFocus>Send</button>
                    </div>
                </div>
        );
    }
}
