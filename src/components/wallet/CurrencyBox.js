import React, { Component } from "react";
import { Spring } from "react-spring";
import { Tooltip } from "react-tippy";
import { BigNumber } from "bignumber.js";

import { timeStampToHR } from "./../../utils/secsToHMS";
import { currencyIcons } from "./../../constants";

let motionBalanceStart = {};

function isGolemReady(status) {
    return status === "Ready";
}

export default class CurrencyBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyRate: 1,
            amountPrecision: 4
        };

        if (!motionBalanceStart[props.suffix]) {
            motionBalanceStart[props.suffix] = 0;
        }
        if (!motionBalanceStart[`${props.suffix}-USD`]) {
            motionBalanceStart[`${props.suffix}-USD`] = 0;
        }
    }

    componentDidMount() {
        const item = this.refs["currencyBox" + this.props.suffix];
        item && item.addEventListener("animationend", this._removeItem.bind(this, item));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.expandedAmount !== this.props.expandedAmount) {
            this.setState({
                amountPrecision: nextProps.expandedAmount ? 8 : 4
            });
        }
    }

    _removeItem(item) {
        const { expandedAmount, suffix } = this.props;
        if (expandedAmount !== suffix && expandedAmount !== null) {
        }
    }

    _formatAmount = (_balance, _suffix, currency = 1) => {
        const totalBalance = this.props.balance.precision(this.state.amountPrecision).toString();

        const animatedBalance = new BigNumber(_balance.toString())
            .dividedBy(currency)
            .precision(this.state.amountPrecision)
            .toString();

        if (totalBalance === animatedBalance && motionBalanceStart[_suffix] !== _balance) {
            motionBalanceStart[_suffix] = _balance;
        }

        if (_suffix.includes("USD")) {
            return _balance.toFixed(2);
        }

        return _balance.toFixed(this.state.amountPrecision);
    };

    _toggleFlipper() {
        const item = this.refs["currencyBox" + this.props.suffix];
        item && item.classList.toggle("flip");
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
            golemStatus,
            lockWithdraw
        } = this.props;
        return (
            <div className="container__currency-box">
                <div id="cube" className={expandedAmount ? (expandedAmount === suffix ? "show-top" : "show-front") : "show-top"}>
                    <div className={`side1 ${suffix}`}>
                        <span className="lock__container">
                            Locked:
                            <span>
                                <b>{lockedBalance[expandedAmount === "GNT" ? 0 : 1]}</b>
                                <Tooltip html={descriptionLock || "No information"} position="bottom" trigger="mouseenter" interactive={true}>
                                    <span className="icon-question-mark" />
                                </Tooltip>
                            </span>
                        </span>
                        {expandedAmount === "GNT" && (
                            <span className="lock__container">
                                Waiting:
                                <span>
                                    <b>{lockedBalance[2]}</b>
                                    <Tooltip html={descriptionWaiting || "No information"} position="bottom" trigger="mouseenter" interactive={true}>
                                        <span className="icon-question-mark" />
                                    </Tooltip>
                                </span>
                            </span>
                        )}
                    </div>
                    <div className="side2">
                        <div ref={"currencyBox" + suffix} className="content__currency-box flipper" onClick={expandAmount.bind(this, suffix)}>
                            <div className="front">
                                <div>
                                    <span className={`icon-${currencyIcons[suffix]}`} />
                                </div>
                                <div>
                                    <Spring from={{ balanceAnimated: motionBalanceStart[suffix] }} to={{ balanceAnimated: Number(balance) }}>
                                        {({ balanceAnimated }) => (
                                            <span className="amount">
                                                {this._formatAmount(Number(balanceAnimated), suffix)}
                                                {!expandedAmount && "..."}
                                                <span className="currency-suffix">
                                                    {!isMainNet ? "t" : ""}
                                                    {suffix}
                                                </span>
                                            </span>
                                        )}
                                    </Spring>
                                    <Spring
                                        from={{ balanceAnimated: motionBalanceStart[`${suffix}-USD`] }}
                                        to={{ balanceAnimated: Number(balance.multipliedBy(currency[suffix])) }}>
                                        {({ balanceAnimated }) => (
                                            <span className="amount amount-usd">
                                                est. {!isMainNet ? "t" : ""}${" "}
                                                {this._formatAmount(Number(balanceAnimated), `${suffix}-USD`, currency[suffix])}...
                                            </span>
                                        )}
                                    </Spring>
                                </div>
                                <div className="locked-amount">
                                    <Spring
                                        from={{ balanceAnimated: motionBalanceStart[`${suffix}-USD`] }}
                                        to={{ balanceAnimated: Number(balance.multipliedBy(currency[suffix])) }}>
                                        {({ balanceAnimated }) => (
                                            <span>
                                                Locked:{" "}
                                                <span className="amount">
                                                    {this._formatAmount(
                                                        Number(lockedBalance[expandedAmount === "GNT" ? 0 : 1]),
                                                        `${suffix}-USD`,
                                                        currency[suffix]
                                                    )}
                                                </span>{" "}
                                                {!isMainNet ? "t" : ""}
                                                {suffix}{" "}
                                            </span>
                                        )}
                                    </Spring>
                                </div>
                                <Tooltip html={description} position="bottom" trigger="mouseenter" interactive={true} className="tip">
                                    <span className="icon-question-mark" />
                                </Tooltip>
                                <div className="action-menu">
                                    <button className="btn--ghost wallet__btn-withdraw" onClick={() => this._toggleFlipper()}>
                                        <span className="icon-info-small" />Details
                                    </button>
                                    <button
                                        className="btn--ghost wallet__btn-withdraw"
                                        onClick={() => clickHandler(suffix, currency, balance)}
                                        disabled={!isMainNet || !isGolemReady(golemStatus.status) || lockWithdraw}>
                                        <span className="icon-withdraw" />Withdraw
                                    </button>
                                </div>
                            </div>
                            <div className="back">
                                <div>
                                    <div className="available-amount">
                                        <span>Available amount</span>
                                        <Spring from={{ balanceAnimated: motionBalanceStart[suffix] }} to={{ balanceAnimated: Number(balance) }}>
                                            {({ balanceAnimated }) => (
                                                <span className="amount">
                                                    {this._formatAmount(Number(balanceAnimated), suffix)}
                                                    {!expandedAmount && "..."}
                                                    <span className="currency-suffix">
                                                        {!isMainNet ? "t" : ""}
                                                        {suffix}
                                                    </span>
                                                </span>
                                            )}
                                        </Spring>
                                    </div>
                                    <div className="locked-amount">
                                        <span>Locked:</span>
                                        <Spring
                                            from={{ balanceAnimated: motionBalanceStart[`${suffix}-USD`] }}
                                            to={{ balanceAnimated: Number(balance.multipliedBy(currency[suffix])) }}>
                                            {({ balanceAnimated }) => (
                                                <span>
                                                    <span className="amount">
                                                        {this._formatAmount(
                                                            Number(lockedBalance[expandedAmount === "GNT" ? 0 : 1]),
                                                            `${suffix}-USD`,
                                                            currency[suffix]
                                                        )}
                                                    </span>{" "}
                                                    {!isMainNet ? "t" : ""}
                                                    {suffix}{" "}
                                                </span>
                                            )}
                                        </Spring>
                                    </div>
                                    <div className="unconverted-amount">
                                        <span>Unconverted:</span>
                                        <Spring
                                            from={{ balanceAnimated: motionBalanceStart[`${suffix}-USD`] }}
                                            to={{ balanceAnimated: Number(balance.multipliedBy(currency[suffix])) }}>
                                            {({ balanceAnimated }) => (
                                                <span>
                                                    <span className="amount">
                                                        {this._formatAmount(
                                                            Number(lockedBalance[expandedAmount === "GNT" ? 0 : 1]),
                                                            `${suffix}-USD`,
                                                            currency[suffix]
                                                        )}
                                                    </span>{" "}
                                                    {!isMainNet ? "t" : ""}
                                                    {suffix}{" "}
                                                </span>
                                            )}
                                        </Spring>
                                    </div>
                                </div>
                                <div className="batch-contract-adress">
                                    <span>
                                        GNTb contract address<a href="">
                                            <span className="icon-new-window" />
                                        </a>
                                    </span>
                                </div>
                                <div className="action-menu">
                                    <button className="btn--ghost wallet__btn-withdraw" onClick={() => this._toggleFlipper()}>
                                        <span className="icon-back-up" />Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
