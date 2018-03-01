import React, { Component } from 'react';
import { Motion, spring } from 'react-motion'
import { timeStampToHR } from './../../utils/secsToHMS'

import CurrencyBox from './CurrencyBox'

const {remote} = window.electron;
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')
const {INDICATOR_ID} = dictConfig



export default class Wallet extends Component {

    constructor(props) {
        super(props);
    }

    _handleExpandWallet(){
    	const element = document.getElementById("sectionWallet");
   		element.classList.toggle("expand__wallet");
    }

    render() {
        
        return (
        	<div id="sectionWallet" className="section__wallet">
	            <div className="content__wallet">
	                <div className="panel_box">
	                	<CurrencyBox amount="300005.2323..." suffix="GNT" description="Test tooltip for GNT"/>
	                	<CurrencyBox amount="20.2123..." suffix="ETH" description="Test tooltip for ETH"/>
	                </div>
	                <span className="icon-arrow-down" onClick={::this._handleExpandWallet}/>
	            </div>
	            <div className="address-box__wallet">
		            <div>
		            	<span>Your address - </span>
		            	<span>send GNT and ETH to this address to top up your account</span>
		            </div>
		            <div>
		            	<input type="text" placeholder="0x6a7ca41fdd98e00207d2724d03e2bf72b5640bd1"/>
		            </div>
	            </div>
            </div>
        );
    }
}
