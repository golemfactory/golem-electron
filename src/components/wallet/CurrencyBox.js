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

    componentDidMount() {
            var item = this.refs["currencyBox" + this.props.suffix];
            item && item.addEventListener("animationend", this._removeItem.bind(this, item));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.expandedAmount !== this.props.expandedAmount){
            this.setState({
                amountPrecision: nextProps.expandedAmount ? 8 : 4
            })
        }
    }

    _removeItem(item){
        const {expandedAmount, suffix} = this.props
        if(expandedAmount !== suffix && expandedAmount !== null){
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
            lockedBalance,
            currency, 
            suffix, 
            description, 
            descriptionLock,
            descriptionWaiting,
            clickHandler, 
            expandAmount, 
            expandedAmount, 
            isMainNet,
            golemStatus
        } = this.props

        return (
            <div className="container">
            <div id="cube" className={expandedAmount ? (expandedAmount === suffix ? "show-top" : "show-front") : "show-top"}>
                <div className={`side1 ${suffix}`}>
                    <span className="lock__container">
                        Locked: 
                        <span>
                            <b>{lockedBalance[expandedAmount === "GNT"? 0 : 1]}</b>
                            <ReactTooltip overlayClassName="black" overlay={descriptionLock || "No information"} placement="bottomRight" trigger={['hover']} align={{
                                offset: [10, 8],
                                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                <span className="icon-question-mark"/>
                            </ReactTooltip>
                        </span>
                    </span>
                    { expandedAmount === "GNT" && 
                        <span className="lock__container">
                            Waiting: 
                            <span>
                                <b>{lockedBalance[2]}</b>
                                <ReactTooltip overlayClassName="black" overlay={descriptionWaiting || "No information"} placement="bottomRight" trigger={['hover']} align={{
                                    offset: [10, 8],
                                    }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                    <span className="icon-question-mark"/>
                                </ReactTooltip>
                            </span>
                        </span>}
                </div>
                <div className="side2">
                    <div ref={"currencyBox" + suffix} className={`content__currency-box`} onClick={expandAmount.bind(this, suffix)}>
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
                    {({balanceAnimated}) => <span className="amount">
                        {::this._formatAmount(Number(balanceAnimated), suffix)}{!expandedAmount && "..."}
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
                </div>
            </div>
        </div>
        );
    }
}
