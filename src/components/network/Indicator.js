import React from 'react';
import { Motion, spring } from 'react-motion'


let dictCurrency = Object.freeze({
    GNT: 'GNT',
    ETH: 'ETH',
    USD: 'USD'
})


export default class indicator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currencyRate: 1,
            defaultCurrency: 'GNT'
        }
    }

    /**
     * _convertTo description Currency convertion menu onClick handler
     * @param  {String}     to      [Currency name which will convert to]
     * @param  {[type]}     elm     [clicked DOM Element]
     */
    _convertTo(to, elm) {

        ::this.navigateTo(elm)
        this.setState({
            currencyRate: this.convert(to),
            defaultCurrency: to
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
            return GNT / ETH
        case dictCurrency.USD:
            return GNT
        }
    }

    /**
     * [navigateTo funct. navigates clicked currency item to active]
     * @param  {Object}     elm     [clicked DOM Element]
     * @return nothing
     */
    navigateTo(elm) {
        let navItems = document.getElementsByClassName('amont__item')
        for (var i = 0; i < navItems.length; i++) {
            navItems[i].classList.remove('active')
        }
        elm.currentTarget.classList.add('active')
    }

    render() {
        const {message, actions} = this.props
        const {defaultCurrency, currencyRate} = this.state
        return (
            <div className="content__indicator">
                <span>{defaultCurrency === 'GNT' ? 'Your Golem balance' : 'Approximately'}</span>
                <Motion defaultStyle={{
                messageAnimated: 0
            }} style={{
                messageAnimated: spring(Number(message), {
                    stiffness: 50,
                    damping: 25
                })
            }}>
                    {({messageAnimated}) => <span className="amount">{(messageAnimated * currencyRate).toFixed(2)}</span>}
                </Motion>
                <ul role="menu">
                    <li className="amont__item active" role="menuitemradio" tabIndex="0" aria-label="GNT" onClick={this._convertTo.bind(this, dictCurrency.GNT)}>GNT</li>
                    <li className="amont__item" role="menuitemradio" tabIndex="0" aria-label="ETH" onClick={this._convertTo.bind(this, dictCurrency.ETH)}>ETH</li>
                    <li className="amont__item" role="menuitemradio" tabIndex="0" aria-label="USD" onClick={this._convertTo.bind(this, dictCurrency.USD)}>USD</li>
                </ul>
            </div>
        );
    }
}
