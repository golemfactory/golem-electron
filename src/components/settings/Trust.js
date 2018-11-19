import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

import Slider from './../Slider'


const mapStateToProps = state => ({
    providerTrust: state.trust.providerTrust,
    requestorTrust: state.trust.requestorTrust,
    isEngineOn: state.info.isEngineOn,
    isNodeProvider: state.info.isNodeProvider
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class Trust extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [_handleProviderSwitch onChange function]
     * @return  {Boolean}   true
     */
    _handleProviderSwitch(evt) {
        const {actions} = this.props;
        actions.setProviding(!evt.target.checked);
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
        const {providerTrust, requestorTrust, isEngineOn, isNodeProvider} = this.props
        return (
            <div className="content__trust">
                <span className="title__slider">As a requestor</span>
                <Slider 
                    inputId="requesor_slider" 
                    value={requestorTrust} 
                    iconLeft="icon-negative" 
                    iconRight="icon-positive" 
                    aria-label="Trust slider" 
                    callback={::this._handleRequestorTrustSlider} 
                    warn={false} 
                    transform={true}
                    disabled={isEngineOn}/>
                <span className="title__slider">As a provider</span>
                <Slider 
                    inputId="provider_slider" 
                    value={providerTrust} 
                    iconLeft="icon-negative" 
                    iconRight="icon-positive"  
                    aria-label="Trust slider" 
                    callback={::this._handleProviderTrustSlider} 
                    transform={true}
                    disabled={isEngineOn || !isNodeProvider}/>
                <div className="switch__trust">
                    <div className={`switch-box ${!isNodeProvider ? "switch-box--green" : ""}`}>
                        <label className="switch">
                            <input type="checkbox" onChange={::this._handleProviderSwitch} defaultChecked={!isNodeProvider}  aria-label="Trust switch providing/requesting" tabIndex="0" disabled={isEngineOn}/>
                            <div className="switch-slider round"></div>
                        </label>
                    </div>
                    <span style={{
                color: !isNodeProvider ? '#4e4e4e' : '#9b9b9b'
            }}>I want to act only as a Requestor. Don't send any tasks to my node.</span>
                </div>
                <div className="tips__trust">
                    <span>Remember! To activate the settings please stop Golem first.</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trust)
