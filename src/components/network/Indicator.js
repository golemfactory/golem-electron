import React from "react";
import { Spring } from "react-spring";
import { timeStampToHR } from "./../../utils/secsToHMS";
const { remote } = window.electron;
const { setConfig, getConfig, dictConfig } = remote.getGlobal("configStorage");
const { INDICATOR_ID } = dictConfig;

let dictCurrency = Object.freeze({
    GNT: "GNT",
    ETH: "ETH",
    USD_GNT: "USD_GNT",
    USD_ETH: "USD_ETH"
});

let motionBalanceStart = 0,
    motionLastTimeStart = 0;

export default class Indicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyRate: 1,
            defaultCurrency: "GNT",
            motionBalanceStart: 0,
            idx: getConfig(INDICATOR_ID) || 0,
            toggler: true
        };
    }

    componentDidMount() {
        const amountItem = document.getElementsByClassName("amount__item");
        if (!isNaN(parseFloat(this.state.idx)) && amountItem[this.state.idx])
            amountItem[this.state.idx].classList.add("active");
    }

    /**
     * _convertTo description Currency convertion menu onClick handler
     * @param  {String}     to      [Currency name which will convert to]
     * @param  {[type]}     elm     [clicked DOM Element]
     */
    _convertTo(to, elm, val) {
        this.navigateTo(elm);
        let idx = to == dictCurrency.GNT ? 0 : 1;
        if (idx !== this.state.idx) setConfig(INDICATOR_ID, idx);
        this.setState({
            currencyRate: this.convert(to),
            defaultCurrency: to,
            idx: idx,
            toggler: true
        });
    }

    /**
     * convert funct. checks currency rate
     * @param  {String}     to      [Currency name which will convert to]
     * @return {int}                [Currency rate]
     */
    convert(to, isUSDBase = false) {
        const { GNT, ETH } = this.props.currency;
        switch (to) {
            case dictCurrency.GNT:
                return isUSDBase ? GNT : 1;
            case dictCurrency.ETH:
                return isUSDBase ? ETH : 1;
        }
    }

    /**
     * [calculateAmount func. checks if animation ends to play animation once]
     * @param  {Number} balance [Balance value]
     * @param  {Number} rate    [Currency rate]
     * @return {Number}         [Current value to fixed 2]
     */

    // calculateAmount(balance, rate) {
    //     if (this.props.balance.some((elm) => elm === balance) && motionBalanceStart !== balance) {
    formatAmount = balance => {
        if (
            this.props.balance.some(elm => elm === balance) &&
            motionBalanceStart !== balance
        ) {
            motionBalanceStart = balance;
        }
        return balance.toFixed(2);
    };

    formatTime(time) {
        motionLastTimeStart = time;
        return timeStampToHR(time);
    }

    toggleUSD = rate => {
        const { toggler } = this.state;
        this.setState({
            currencyRate: this.convert(rate, toggler),
            toggler: !toggler
        });
    };

    /**
     * [navigateTo funct. navigates clicked currency item to active]
     * @param  {Object}     elm     [clicked DOM Element]
     * @return nothing
     */
    navigateTo = elm => {
        let navItems = document.getElementsByClassName("amount__item");
        for (var i = 0; i < navItems.length; i++) {
            navItems[i].classList.remove("active");
        }
        elm.currentTarget.classList.add("active");
    };

    render() {
        const { balance, actions } = this.props;
        const { defaultCurrency, currencyRate, idx, toggler } = this.state;
        return (
            <div className="content__indicator">
                <span>{idx == 0 ? "Wallet balance" : "Gas balance"}</span>
                <Spring
                    from={{
                        balanceAnimated: motionBalanceStart
                    }}
                    to={{
                        balanceAnimated: Number(balance[idx] * currencyRate)
                    }}>
                    {({ balanceAnimated }) => (
                        <span
                            className="amount"
                            onClick={this.toggleUSD.bind(
                                this,
                                defaultCurrency
                            )}>
                            {!toggler && <span className="symbol__usd">$</span>}
                            {this.formatAmount(Number(balanceAnimated))}
                        </span>
                    )}
                </Spring>
                <div className="currency-menu" role="menu">
                    <span
                        className="amount__item"
                        role="menuitemradio"
                        tabIndex="0"
                        aria-label="GNT"
                        onClick={this._convertTo.bind(this, dictCurrency.GNT)}>
                        {!toggler && defaultCurrency == dictCurrency.GNT
                            ? "tUSD"
                            : "tGNT"}
                    </span>
                    <span
                        className="amount__item"
                        role="menuitemradio"
                        tabIndex="0"
                        aria-label="ETH"
                        onClick={this._convertTo.bind(this, dictCurrency.ETH)}>
                        {!toggler && defaultCurrency == dictCurrency.ETH
                            ? "tUSD"
                            : "tETH"}
                    </span>
                </div>
                {!toggler && (
                    <span className="currency-info">Estimated Amount</span>
                )}
                {toggler && balance[2] && (
                    <Spring
                        from={{
                            timeAnimated: motionLastTimeStart
                        }}
                        to={{
                            timeAnimated: +balance[idx + 2]
                        }}>
                        {({ timeAnimated }) => (
                            <span className="currency-info__update">
                                Last update: {this.formatTime(timeAnimated)}
                            </span>
                        )}
                    </Spring>
                )}
            </div>
        );
    }
}
