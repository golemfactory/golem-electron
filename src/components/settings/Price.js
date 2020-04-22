import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import { ETH_DENOM } from '../../constants/variables';

const mapStateToProps = state => ({
    providerMinPrice: state.price.providerMinPrice,
    requestorMaxPrice: state.price.requestorMaxPrice,
    isEngineOn: state.info.isEngineOn,
    isMainNet: state.info.isMainNet
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Price extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * [_handleMinPriceChange funcs. update minimum provider price]
     * @param  {Event}      evt
     */
    _handleMinPriceChange = evt =>
        this.props.actions.setProviderMinPrice(
            Number(evt.target.valueAsNumber) * ETH_DENOM
        );

    /**
     * [_handleMinPriceChange funcs. update maximum requestor price]
     * @param  {Event}      evt
     */
    _handleMaxPriceChange = evt =>
        this.props.actions.setRequestorMaxPrice(
            Number(evt.target.valueAsNumber) * ETH_DENOM
        );

    render() {
        const {
            providerMinPrice,
            requestorMaxPrice,
            isEngineOn,
            isMainNet
        } = this.props;
        return (
            <div className="content__price">
                <div className="description">
                    <span className="description-title">Default price settings</span>
                    <br />
                    <span className="description-content">
                        Here you are able to set your default price settings as
                        a Provider, both for Clay Marketplace and Usage Market.
                        You will be able to change your default task price as a
                        Requestor during task creation.{' '}
                        <a href="">Learn more.</a>
                    </span>
                </div>
                <div className="section__price">
                    <span>Provider Offer</span>
                    <input
                        type="number"
                        min="0"
                        step={0.1}
                        value={Number(providerMinPrice) / ETH_DENOM}
                        onChange={this._handleMinPriceChange}
                        aria-label="Provider minimum price"
                        disabled={isEngineOn}
                    />
                    <span>{isMainNet ? '' : 't'}GNT per hour</span>
                </div>
                <div className="section__price">
                    <span>Requestor Default</span>
                    <input
                        type="number"
                        min="0"
                        step={0.1}
                        value={Number(requestorMaxPrice) / ETH_DENOM}
                        onChange={this._handleMaxPriceChange}
                        aria-label="Requestor maximum price"
                        disabled={isEngineOn}
                    />
                    <span>{isMainNet ? '' : 't'}GNT per hour</span>
                </div>
                <div className="tips">
                    <span>
                        Remember! To activate the settings please stop Golem
                        first.
                    </span>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Price);
