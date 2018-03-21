import React, { Component } from 'react';
import { Motion, spring } from 'react-motion'
import ReactTooltip from 'rc-tooltip'
import { timeStampToHR } from './../../utils/secsToHMS'
import {currencyIcons} from './../../constants'

let motionBalanceStart = {};

export default class CurrencyBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currencyRate: 1
        }

        if(!motionBalanceStart[props.suffix]){
            motionBalanceStart[props.suffix] = 0
        }
        if(!motionBalanceStart[`${props.suffix}-USD`]){
            motionBalanceStart[`${props.suffix}-USD`] = 0
        }
    }


    _formatAmount(_balance ,_suffix, currency = 1) {
        if (this.props.balance === (_balance / currency) && motionBalanceStart[_suffix] !== _balance) {
            motionBalanceStart[_suffix] = _balance
        }
        return (_balance).toFixed(4)
    }

    render() {
        const {balance, currency, suffix, description, clickHandler, expandAmount} = this.props
        return (
            <div className="content__currency-box" onClick={expandAmount.bind(this, suffix)}>
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
                    {({balanceAnimated}) => <span className="amount">{::this._formatAmount(Number(balanceAnimated), suffix)}<span className="currency-suffix">t{suffix}</span></span>}
                </Motion>
                <Motion defaultStyle={{
                balanceAnimated: motionBalanceStart[`${suffix}-USD`]
            }} style={{
                balanceAnimated: spring(Number(balance * currency[suffix]), {
                    stiffness: 500,
                    damping: 50
                })
            }}>
                    {({balanceAnimated}) => <span className="amount">est. {::this._formatAmount(Number(balanceAnimated), `${suffix}-USD`, currency[suffix])} t$</span>}
                </Motion>
                </div>
                <ReactTooltip overlayClassName="black" overlay={description} placement="bottomRight" trigger={['hover']} align={{
                offset: [10, 8],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                	<span className="icon-question-mark"/>
                </ReactTooltip>
                <button className="btn--outline wallet__btn-withdraw" onClick={() => clickHandler(suffix, currency, balance)} disabled={true}>Withdraw</button>
            </div>
        );
    }
}
