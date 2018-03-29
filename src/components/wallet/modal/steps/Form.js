import React from 'react';
import {BigNumber} from 'bignumber.js';

import {modals, currencyIcons} from './../../../../constants'

const {clipboard } = window.electron
const ETH_DENOM = 10 ** 18; //POW shorthand thanks to ES6

export default class WithdrawForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            amountCopied: false,
            amount: new BigNumber(0.2).multipliedBy(ETH_DENOM),
            sendTo: ""
        }
    }

    componentDidMount() {
        const { formData } = this.props
        if(formData){
            this.refs.amountInput.value = formData.amount.dividedBy(ETH_DENOM);
            this.refs.sendToInput.value = formData.sendTo
            this.setState({
                amount: formData.amount,
                sendTo: formData.sendTo
            })
        }
    }

    componentWillUnmount() {
        if(this.copyTimeout){
            clearTimeout(this.copyTimeout)
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
    _handleApply(e) {
        e.preventDefault()
        const { amount, sendTo } = this.state
        this.props.applyHandler(amount, sendTo, this.props.suffix)
    }

    /**
     * [_handleCopyToClipboard funcs.  copies node id to the clipboard]
     * @param  {String}     nodeId      [NodeId of the user]
     * @param  {Event}      evt         [Clicked event]
     */
    _handleCopyToClipboard(evt) {
        const amountValue = this.refs.amountInput.value
        if (amountValue) {
            clipboard.writeText(this.state.formData.amount)
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

    checkInputValidity(e) {
        e.target.checkValidity();
        if (e.target.validity.valid)
            e.target.classList.remove("invalid");
        else
            e.target.classList.add("invalid");
        return e.target.validity.valid
    }

    _handleAmountChange(e){
        const isValid = this.checkInputValidity(e)
        if(isValid)
            this.setState({
                amount: new BigNumber(e.target.value).multipliedBy(ETH_DENOM)
            })
    }

    _handleSendToChange(e){
        const isValid = this.checkInputValidity(e)
        if(isValid)
            this.setState({
                sendTo: e.target.value
            })
    }

    _preventSpace(event){
        var key = event.which || window.event.which;
        if (key === 32) {
          event.preventDefault();
        }
    }

    render() {
        const {type, suffix, currency, balance} = this.props
        const {amountCopied, amount} = this.state
        return (
                <form className="content__modal content__modal--form " onSubmit={::this._handleApply}>
                    <div>
                        <span className={`icon-${currencyIcons[suffix]}`}/>
                        <div className="currency-tag">
                        	<span className="label-currency">{suffix}</span>
                        	<br/>
                        	<strong>{balance.toFixed(2)}...</strong>
                        	<br/>
                        	<span className="label-estimation">est. {balance.multipliedBy(currency[suffix]).toFixed(2)} $</span>
                        </div>
                    </div>
                    <div className="form-field">
                    	<label>Amount</label>
                    	<input 
                            ref="amountInput" 
                            className="input__amount" 
                            type="number" 
                            min={0.00001}
                            defaultValue={0.2} 
                            step={0.1} 
                            onChange={::this._handleAmountChange}/>
                    	<span className="currency">{suffix}</span>
                    	<span className={`icon-${amountCopied ? "checkmark" : "copy"}`} onClick={::this._handleCopyToClipboard}/>
                    	{amountCopied && <span className="status-copy">balance copied</span>}
                    	<span className="amount__estimation">est. {amount.dividedBy(ETH_DENOM).multipliedBy(currency[suffix]).toFixed(2)} $</span>
                    </div>
                    <div className="form-field">
                    	<label>Sending to</label>
                    	<input
                            ref="sendToInput"
                            className="input__address" 
                            type="text" 
                            placeholder="Type in GNT address"
                            pattern="0x[a-fA-F0-9]{40}"
                            onKeyPress={::this._preventSpace}
                            onChange={::this._handleSendToChange}
                            required/>
                    </div>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="submit" className="btn--primary" autoFocus>Apply</button>
                    </div>
                </form>
        );
    }
}
