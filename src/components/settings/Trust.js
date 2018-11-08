import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

import Slider from './../Slider'


const mapStateToProps = state => ({
    providerTrust: state.trust.providerTrust,
    requestorTrust: state.trust.requestorTrust,
    isEngineOn: state.info.isEngineOn
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class Trust extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [_handleRequestorTrustSlider]
     * @param  {Boolean}     value      [Boolean value from slider switch]
     */
    _handleRequestorTrustSlider(value) {
        const {actions} = this.props;
        actions.setRequestorTrust(value);
    }

    /**
     * [_handleProviderTrustSlider]
     * @param  {Boolean}     value      [Boolean value from slider switch]
     */
    _handleProviderTrustSlider(value) {
        const {actions} = this.props;
        actions.setProviderTrust(value);
    }

    
    // <div className="tips__trust">
    //     <span>A low setting means your node may get more task requests, but from less reliable requestors. A high setting could mean fewer tasks, but more reliable requestors.</span>
    // </div>

    render() {
        const {providerTrust, requestorTrust, isEngineOn} = this.props
        return (
            <div className="content__trust">
                <span className="title__slider">As a requestor</span>
                <Slider inputId="requesor_slider" value={requestorTrust} iconLeft="icon-negative" iconRight="icon-positive"  aria-label="Trust slider" callback={::this._handleRequestorTrustSlider} warn={false} disabled={isEngineOn}/>
                <span className="title__slider">As a provider</span>
                <Slider inputId="provider_slider" value={providerTrust} iconLeft="icon-negative" iconRight="icon-positive"  aria-label="Trust slider" callback={::this._handleProviderTrustSlider} warn={false} disabled={isEngineOn || !isNodeProvider}/>
                <div className="tips__trust">
                    <span>Remember! To activate the settings please stop Golem first.</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trust)
