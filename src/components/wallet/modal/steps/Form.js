import React from 'react';

import {modals, currencyIcons} from './../../../../constants'

const {clipboard } = window.electron

export default class WithdrawForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            amountCopied: false,
            amount: (props.formData && props.formData.amount) || 0.2,
            sendTo: (props.formData && props.formData.sendTo) || ""
        }
    }

    componentDidMount() {
        const { formData } = this.props
        if(formData){
            this.refs.amountInput.value = formData.amount
            this.refs.sendToInput.value = formData.sendTo
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

    _handleAmountChange(e){
        this.setState({
            amount: e.target.value
        })
    }

    _handleSendToChange(e){
        this.setState({
            sendTo: e.target.value
        })
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
                        	<strong>{Number(balance).toFixed(4)}...</strong>
                        	<br/>
                        	<span className="label-estimation">est. {(Number(balance) * currency[suffix]).toFixed(2) } $</span>
                        </div>
                    </div>
                    <div className="form-field">
                    	<label>Sending from</label>
                    	<input 
                            className="input__address" 
                            type="text" 
                            value="0x6a7ca41fdd98e00207d2724d03e2bf72b5640bd1"
                            readOnly/>
                    </div>
                    <div className="form-field">
                    	<label>Amount</label>
                    	<input ref="amountInput" className="input__amount" type="number" defaultValue={0.2} step={0.1} onChange={::this._handleAmountChange}/>
                    	<span className="currency">{suffix}</span>
                    	<span className={`icon-${amountCopied ? "checkmark" : "copy"}`} onClick={::this._handleCopyToClipboard}/>
                    	{amountCopied && <span className="status-copy">balance copied</span>}
                    	<span className="amount__estimation">est. {(Number(amount) * currency[suffix]).toFixed(2)} $</span>
                    </div>
                    <div className="form-field">
                    	<label>Sending to</label>
                    	<input
                            ref="sendToInput"
                            className="input__address" 
                            type="text" 
                            placeholder="Type in GNT address"
                            pattern="0x[a-fA-F0-9]{40}"
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
