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
        this.props.actions.setProviderMinPrice(evt.target.value)
    }

    /**
     * [_handleMinPriceChange funcs. update maximum requestor price]
     * @param  {Event}      evt
     */
    _handleMaxPriceChange(evt) {
        this.props.actions.setRequestorMaxPrice(evt.target.value)
    }

    render() {
        const {providerMinPrice, requestorMaxPrice, isEngineOn} = this.props
        return (
            <div className="content__price">
                <div className="section__price">
                    <span>Provider Minimum</span>
                    <input type="number" min="0" value={providerMinPrice} onChange={::this._handleMinPriceChange} aria-label="Provider minimum price" disabled={isEngineOn}/>
                    <span>GNT per hour</span>
                </div>
                <div className="section__price">
                    <span>Requestor Maximum</span>
                    <input type="number" min="0" value={requestorMaxPrice} onChange={::this._handleMaxPriceChange} aria-label="Requestor maximum price" disabled={isEngineOn}/>
                    <span>GNT per hour</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Price)