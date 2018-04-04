import React, { Component } from 'react';
import { Motion, spring } from 'react-motion'
import ReactTooltip from 'rc-tooltip'
import {BigNumber} from 'bignumber.js';

import { timeStampToHR } from './../../utils/secsToHMS'
import {currencyIcons} from './../../constants'

let motionBalanceStart = {};

function isGolemReady(status) {
    return status === "Ready"
}

export default class CurrencyBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currencyRate: 1,
            amountPrecision: 4
        }

        if(!motionBalanceStart[props.suffix]){
            motionBalanceStart[props.suffix] = 0
        }
        if(!motionBalanceStart[`${props.suffix}-USD`]){
            motionBalanceStart[`${props.suffix}-USD`] = 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.expandedAmount !== this.props.expandedAmount){
            this.setState({
                amountPrecision: nextProps.expandedAmount ? 13 : 4
            })
        }
    }


    _formatAmount(_balance ,_suffix, currency = 1) {
        if (this.props.balance.toNumber() === (new BigNumber(_balance.toString())
            .dividedBy(currency)
            .toNumber()) && 
            motionBalanceStart[_suffix] !== _balance) {
                motionBalanceStart[_suffix] = _balance
        }

        if(_suffix.includes('USD')){
            return (_balance).toFixed(2)
        }

        return (_balance).toFixed(this.state.amountPrecision)
    }

    render() {
        const {
            balance, 
            currency, 
            suffix, 
            description, 
            clickHandler, 
            expandAmount, 
            expandedAmount, 
            isMainNet,
            golemStatus
        } = this.props

        return (
            <div className={`content__currency-box ${expandedAmount ? (expandedAmount === suffix ? "expand" : "shrink") : ""}`}>
                <div>
                	<span className={`icon-${currencyIcons[suffix]}`}/>
                </div>
                <div>
                    <Motion defaultStyle={{
                balanceAnimated: motionBalanceStart[suffix]
            }} style={{
                balanceAnimated: spring(Number(balance), {
                    stiffness: 500,
                    damping: 50
                })
            }}>
                    {({balanceAnimated}) => <span className="amount" onClick={expandAmount.bind(this, suffix)}>
                        {::this._formatAmount(Number(balanceAnimated), suffix)}...
                        <span className="currency-suffix">{!isMainNet ? "t" : ""}{suffix}</span>
                    </span>}
                </Motion>
                <Motion defaultStyle={{
                balanceAnimated: motionBalanceStart[`${suffix}-USD`]
            }} style={{
                balanceAnimated: spring(Number(balance.multipliedBy(currency[suffix])), {
                    stiffness: 500,
                    damping: 50
                })
            }}>
                    {({balanceAnimated}) => <span className="amount">est. {::this._formatAmount(Number(balanceAnimated), `${suffix}-USD`, currency[suffix])}... {!isMainNet ? "t" : ""}$</span>}
                </Motion>
                </div>
                <ReactTooltip overlayClassName="black" overlay={description} placement="bottomRight" trigger={['hover']} align={{
                offset: [10, 8],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                	<span className="icon-question-mark"/>
                </ReactTooltip>
                <button className="btn--outline wallet__btn-withdraw" onClick={() => clickHandler(suffix, currency, balance)} disabled={(!isMainNet || !isGolemReady(golemStatus.status))}>Withdraw</button>
            </div>
        );
    }
}
