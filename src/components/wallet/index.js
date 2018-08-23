import React, { Component } from 'react';
import { Motion, spring } from 'react-motion'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'

import * as Actions from './../../actions'
import { timeStampToHR } from './../../utils/secsToHMS'

import CurrencyBox from './CurrencyBox'

const {clipboard } = window.electron

const mapStateToProps = state => ({
    publicKey: state.account.publicKey,
    isMainNet: state.info.isMainNet,
    golemStatus: state.realTime.golemStatus
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Wallet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addressCopied: false,
            isWalletExpanded: false,
            expandedAmount: null
        }
    }

    componentWillUnmount() {
        if(this.copyTimeout){
            clearTimeout(this.copyTimeout)
        }
    }

    _handleExpandWallet(){
    	const element = document.getElementById("sectionWallet");
    	const expandButton = document.getElementById("expandWalletButton");
   		element.classList.toggle("expand__wallet");
   		expandButton.classList.toggle("arrow-expand");
        this.setState({
            isWalletExpanded: !this.state.isWalletExpanded,
            expandedAmount: null
        })
    }

    _handleCopyToClipboard(_publicKey, evt) {
        if (_publicKey) {
            clipboard.writeText(_publicKey)
            this.setState({
                addressCopied: true
            }, () => {
                this.copyTimeout = setTimeout(() => {
                    this.setState({
                        addressCopied: false
                    })
                }, 5000)
            })
        }
    }

    _handleWithdrawModal(_suffix, _currency, _balance){
        this.props.actions.callWithdrawModal(true, {
            suffix: _suffix,
            currency: _currency,
            balance: _balance
        })
    }

    _expandAmount(_type){
        if(!this.state.isWalletExpanded)
            this.setState({
                expandedAmount: this.state.expandedAmount ? null : _type
            })
    }


    render() {
        const { publicKey, balance, currency, isMainNet, golemStatus} = this.props
        const { addressCopied, isWalletExpanded, expandedAmount} = this.state
        return (
        	<div id="sectionWallet" className="section__wallet">
	            <div className="content__wallet">
	                <div className="panel_box">
	                	<CurrencyBox
                            balance={balance[0]}
                            lockedBalance={[balance[4], balance[5], balance[6]]}
                            currency={currency}
                            suffix="GNT"
                            description={ isMainNet ? 
                                        <p className="tooltip__wallet">
                                        Golem Network token 
                                        <br/>is earned and/or paid 
                                        <br/>for computations.
                                        <br/><a href="https://golem.network/documentation/12-why-do-i-need-gnt-and-eth/#gnt">Learn more</a></p>
                                        :
                                        <p className="tooltip__wallet">
                                        tGNT is testnet Golem Network token.
                                        <br/>It is earned and/or paid for computations.
                                        <br/><a href="https://github.com/golemfactory/golem/wiki/FAQ#can-i-deposit-and-withdraw-real-gnt-and-eth-during-the-alpha-test">Learn more</a></p>
                                    }
                            descriptionLock={
                                <p className="tooltip__wallet">
                                    Locked: reserved estimated 
                                    <br/>pessimistic amount that may be 
                                    <br/>needed to pay for tasks that 
                                    <br/>have been commissioned.
                                    <br/>May be overestimated.
                                </p>
                            }
                            expandAmount={::this._expandAmount}
                            expandedAmount={expandedAmount}
                            golemStatus={golemStatus}
                            isMainNet={isMainNet}
                            clickHandler={::this._handleWithdrawModal}/>
	                	<CurrencyBox
                            balance={balance[1]}
                            lockedBalance={[balance[4], balance[5], balance[6]]}
                            currency={currency}
                            suffix="ETH"
                            description={ isMainNet ?
                                        <p className="tooltip__wallet">
                                        ETH is used for 
                                        <br/>transaction fees.
                                        <br/><a href="https://golem.network/documentation/12-why-do-i-need-gnt-and-eth/#gnt">Learn more</a></p>
                                        :
                                        <p className="tooltip__wallet">
                                        tETH is testnet ETH.
                                        <br/>It is used for transaction fees.
                                        <br/><a href="https://github.com/golemfactory/golem/wiki/FAQ#can-i-deposit-and-withdraw-real-gnt-and-eth-during-the-alpha-test">Learn more</a></p>
                                    }
                            descriptionLock={
                                <p className="tooltip__wallet">
                                    Locked: reserved amount 
                                    <br/>that will be used to pay 
                                    <br/>for tasks that have been 
                                    <br/>commissioned.
                                </p>
                            }

                            descriptionWaiting={
                                <p className="tooltip__wallet">
                                    Waiting: blocked specific
                                    <br/>and exact amount to pay 
                                    <br/>for already counted 
                                    <br/>and verified tasks.
                                </p>
                            }
                            expandAmount={::this._expandAmount}
                            expandedAmount={expandedAmount}
                            golemStatus={golemStatus}
                            isMainNet={isMainNet}
                            clickHandler={::this._handleWithdrawModal}/>
	                </div>
	                <span id="expandWalletButton" className="icon-arrow-down" onClick={::this._handleExpandWallet}/>
	            </div>
	            <div className="address-box__wallet">
		            <div>
		            	<span>Your address - </span>
		            	<span>send GNT and ETH to this address to top up your account</span>
		            </div>
		            <div>
		            	<input className="input__public-key" type="text" value={isMainNet ? publicKey : "You cannot top up your TestNet account"} readOnly/>
	                	<span className={`icon-${addressCopied ? "checkmark" : "copy"}`} onClick={this._handleCopyToClipboard.bind(this, (isMainNet ? publicKey : "You cannot top up your TestNet account"))}/>
                        {addressCopied && <span className="status-copy_address">address copied</span>}
		            </div>
	            </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
