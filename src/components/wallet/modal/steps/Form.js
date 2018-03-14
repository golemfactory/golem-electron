import React from 'react';

import {modals, currencyIcons} from './../../../../constants'

const {clipboard } = window.electron

export default class WithdrawForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            amountCopied: false
        }
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.cancelHandler()
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleApply() {
        this.props.applyHandler()
    }

    /**
     * [_handleCopyToClipboard funcs.  copies node id to the clipboard]
     * @param  {String}     nodeId      [NodeId of the user]
     * @param  {Event}      evt         [Clicked event]
     */
    _handleCopyToClipboard(evt) {
        const amountValue = this.refs.amountInput.value
        if (amountValue) {
            clipboard.writeText(amountValue)
            this.setState({
                amountCopied: true
            }, () => {
                this.copyTimeout = setTimeout(() => {
                    this.setState({
                        amountCopied: false
                    })
                }, 5000)
            })
        }
    }

    render() {
        const {type, currency} = this.props
        const {amountCopied} = this.state
        return (
                <form className="content__modal content__modal--form " onSubmit={::this._handleApply}>
                    <div>
                        <span className={`icon-${currencyIcons[currency]}`}/>
                        <div className="currency-tag">
                        	<span class="label-currency">{currency}</span>
                        	<br/>
                        	<strong>300005.2323...</strong>
                        	<br/>
                        	<span className="label-estimation">est. 132000.12 $</span>
                        </div>
                    </div>
                    <div className="form-field">
                    	<label>Sending from</label>
                    	<input className="input__address" type="text" value="0x6a7ca41fdd98e00207d2724d03e2bf72b5640bd1" readOnly/>
                    </div>
                    <div className="form-field">
                    	<label>Amount</label>
                    	<input ref="amountInput" className="input__amount" type="number" defaultValue={0.2} step={0.1} />
                    	<span className="currency">{currency}</span>
                    	<span className={`icon-${amountCopied ? "checkmark" : "copy"}`} onClick={::this._handleCopyToClipboard}/>
                    	{amountCopied && <span className="status-copy">balance copied</span>}
                    	<span className="amount__estimation">est. 2800.24$</span>
                    </div>
                    <div className="form-field">
                    	<label>Sending to</label>
                    	<input className="input__address" type="text" placeholder="Type in GNT address"/>
                    </div>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="submit" className="btn--primary" autoFocus>Apply</button>
                    </div>
                </form>
        );
    }
}
