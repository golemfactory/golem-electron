import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

const mapStateToProps = state => ({
    providerMinPrice: state.price.providerMinPrice,
    requestorMaxPrice: state.price.requestorMaxPrice,
    isEngineOn: state.info.isEngineOn
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
        this.props.actions.setProviderMinPrice(Number(evt.target.valueAsNumber) * (10 ** 18))
    }

    /**
     * [_handleMinPriceChange funcs. update maximum requestor price]
     * @param  {Event}      evt
     */
    _handleMaxPriceChange(evt) {
        this.props.actions.setRequestorMaxPrice(Number(evt.target.valueAsNumber) * (10 ** 18))
    }

    render() {
        const {providerMinPrice, requestorMaxPrice, isEngineOn} = this.props
        return (
            <div className="content__price">
                <div className="section__price">
                    <span>Provider Minimum</span>
                    <input type="number" min="0" step={0.1} value={Number(providerMinPrice) / (10 ** 18)} onChange={::this._handleMinPriceChange} aria-label="Provider minimum price" disabled={isEngineOn}/>
                    <span>GNT per hour</span>
                </div>
                <div className="section__price">
                    <span>Requestor Maximum</span>
                    <input type="number" min="0" step={0.1} value={Number(requestorMaxPrice) / (10 ** 18)} onChange={::this._handleMaxPriceChange} aria-label="Requestor maximum price" disabled={isEngineOn}/>
                    <span>GNT per hour</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Price)