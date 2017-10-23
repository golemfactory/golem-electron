import React from 'react';
import { Motion, spring } from 'react-motion'
const {remote} = window.electron;
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')
const {INDICATOR_ID} = dictConfig


let dictCurrency = Object.freeze({
    GNT: 'GNT',
    ETH: 'ETH',
    USD: 'USD'
})

let motionBalanceStart = 0;


export default class indicator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currencyRate: 1,
            defaultCurrency: 'GNT',
            motionBalanceStart: 0,
            idx: getConfig(INDICATOR_ID) || 0,
        }
    }

    componentDidMount() {
        document.getElementsByClassName('amount__item')[this.state.idx].classList.add('active')
    }

    /**
     * _convertTo description Currency convertion menu onClick handler
     * @param  {String}     to      [Currency name which will convert to]
     * @param  {[type]}     elm     [clicked DOM Element]
     */
    _convertTo(to, elm, val) {

        ::this.navigateTo(elm)
        let idx =  to == dictCurrency.GNT ? 0 : 1;
        if(idx !== this.state.idx) setConfig(INDICATOR_ID, idx)
        this.setState({
            currencyRate: this.convert(to),
            defaultCurrency: to,
            idx: idx
        })
    }

    /**
     * convert funct. checks currency rate
     * @param  {String}     to      [Currency name which will convert to]
     * @return {int}                [Currency rate]
     */
    convert(to) {
        const {GNT, ETH} = this.props.currency
        switch (to) {
        case dictCurrency.GNT:
            return 1
        case dictCurrency.ETH:
            return 1
        case dictCurrency.USD:
            return GNT
        }
    }

    /**
     * [calculateAmount func. checks if animation ends to play animation once]
     * @param  {Number} balance [Balance value]
     * @param  {Number} rate    [Currency rate]
     * @return {Number}         [Current value to fixed 2]
     */
    calculateAmount(balance, rate) {
        if (this.props.balance.some((elm) => elm === balance) && motionBalanceStart !== balance) {
            motionBalanceStart = balance
        }
        return (balance * rate).toFixed(2)
    }

    /**
     * [navigateTo funct. navigates clicked currency item to active]
     * @param  {Object}     elm     [clicked DOM Element]
     * @return nothing
     */
    navigateTo(elm) {
        let navItems = document.getElementsByClassName('amount__item')
        for (var i = 0; i < navItems.length; i++) {
            navItems[i].classList.remove('active')
        }
        elm.currentTarget.classList.add('active')
    }

    render() {
        const {balance, actions} = this.props
        const {defaultCurrency, currencyRate, idx} = this.state
        return (
            <div className="content__indicator">
                <span>{'Your balance'}</span>
                <Motion defaultStyle={{
                balanceAnimated: motionBalanceStart
            }} style={{
                balanceAnimated: spring(Number(balance[idx]), {
                    stiffness: 50,
                    damping: 25
                })
            }}>
                    {({balanceAnimated}) => <span className="amount">{::this.calculateAmount(Number(balanceAnimated), Number(currencyRate))}</span>}
                </Motion>
                <div className="currency-menu" role="menu">
                    <span className="amount__item" role="menuitemradio" tabIndex="0" aria-label="GNT" onClick={this._convertTo.bind(this, dictCurrency.GNT)}>GNT</span>
                    <span className="amount__item" role="menuitemradio" tabIndex="0" aria-label="ETH" onClick={this._convertTo.bind(this, dictCurrency.ETH)}>ETH</span>
                </div>
            </div>
        );
    }
}
