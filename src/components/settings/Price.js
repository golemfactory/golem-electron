import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

const ETH_DENOM = 10 ** 18;

const mapStateToProps = state => ({
    providerMinPrice: state.price.providerMinPrice,
    requestorMaxPrice: state.price.requestorMaxPrice,
    isEngineOn: state.info.isEngineOn,
    isMainNet: state.info.isMainNet
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class Price extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [_handleMinPriceChange funcs. update minimum provider price]
     * @param  {Event}      evt
     */
    _handleMinPriceChange(evt) {
        this.props.actions.setProviderMinPrice(Number(evt.target.valueAsNumber) * ETH_DENOM)
    }

    /**
     * [_handleMinPriceChange funcs. update maximum requestor price]
     * @param  {Event}      evt
     */
    _handleMaxPriceChange(evt) {
        this.props.actions.setRequestorMaxPrice(Number(evt.target.valueAsNumber) * ETH_DENOM)
    }

    render() {
        const {providerMinPrice, requestorMaxPrice, isEngineOn, isMainNet} = this.props
        return (
            <div className="content__price">
                <div className="section__price">
                    <span>Provider Minimum</span>
                    <input type="number" min="0" step={0.1} value={Number(providerMinPrice) / ETH_DENOM} onChange={::this._handleMinPriceChange} aria-label="Provider minimum price" disabled={isEngineOn}/>
                    <span>{isMainNet ? "" : "t"}GNT per hour</span>
                </div>
                <div className="section__price">
                    <span>Requestor Maximum</span>
                    <input type="number" min="0" step={0.1} value={Number(requestorMaxPrice) / ETH_DENOM} onChange={::this._handleMaxPriceChange} aria-label="Requestor maximum price" disabled={isEngineOn}/>
                    <span>{isMainNet ? "" : "t"}GNT per hour</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Price)