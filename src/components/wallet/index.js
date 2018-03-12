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
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Wallet extends Component {

    constructor(props) {
        super(props);
    }

    _handleExpandWallet(){
    	const element = document.getElementById("sectionWallet");
    	const expandButton = document.getElementById("expandWalletButton");
   		element.classList.toggle("expand__wallet");
   		expandButton.classList.toggle("icon-arrow-down");
   		expandButton.classList.toggle("icon-arrow-up");
    }

    _handleCopyToClipboard(_publicKey, evt) {
        if (_publicKey) {
            clipboard.writeText(_publicKey)
        }
    }

    render() {
        const { publicKey } = this.props
        return (
        	<div id="sectionWallet" className="section__wallet">
	            <div className="content__wallet">
	                <div className="panel_box">
	                	<CurrencyBox amount="300005.2323..." suffix="GNT" description="Test tooltip for GNT"/>
	                	<CurrencyBox amount="20.2123..." suffix="ETH" description="Test tooltip for ETH"/>
	                </div>
	                <span id="expandWalletButton" className="icon-arrow-down" onClick={::this._handleExpandWallet}/>
	            </div>
	            <div className="address-box__wallet">
		            <div>
		            	<span>Your address - </span>
		            	<span>send GNT and ETH to this address to top up your account</span>
		            </div>
		            <div>
		            	<input className="input__public-key" type="text" value={publicKey} readOnly/>
	                	<span className="icon-copy" onClick={this._handleCopyToClipboard.bind(this, publicKey)}/>
		            </div>
	            </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
