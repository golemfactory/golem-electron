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
        this.props.applyHandler()
    }

    render() {
        const {type, currency} = this.props
        return (
                <div className="content__modal content__modal--confirmation ">
                    <div>
                        <div className="currency-tag">
                        	<strong className="info-label">sending</strong>
                        	<br/>
                        	<strong className="info-price">20.3421...</strong><span>{currency}</span>
                        	<br/>
                        	<span className="info-estimation">est. 0.2256 $</span>
                        </div>
                    </div>
                    <div>
                        <strong className="info-label">to</strong>
                        <br/>
                        <span className="info-address">0x6a7ca41fdd98e00207d2724d03e2bf72b5640bd1</span>
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
