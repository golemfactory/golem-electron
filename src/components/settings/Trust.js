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
        this.state = {
            isRequestorTrust: false
        }
    }

    /**
     * [_handleTrustSwitch onChange function for switch input]
     * @return  {Boolean}   true
     */
    _handleTrustSwitch() {
        this.setState({
            isRequestorTrust: !this.state.isRequestorTrust
        })
    }

    /**
     * [_handleTrustSlider swtichs between provider/requestor sldiers]
     * @param  {Boolean}     value      [Boolean value from slider switch]
     */
    _handleTrustSlider(value) {
        const {actions} = this.props
        this.state.isRequestorTrust ? actions.setRequestorTrust(value) : actions.setProviderTrust(value)
    }

    /**
     * [fetchTrust func.]
     * @param  {Boolean} isRequestor    [Boolean value from slider switch]
     * @return {DOM}                    [Slider element]
     */
    fetchTrust(isRequestor) {
        const {providerTrust, requestorTrust, isEngineOn} = this.props
        if (isRequestor)
            return <Slider key="requesor_slider" value={requestorTrust} iconLeft="icon-negative" iconRight="icon-positive"  aria-label="Trust slider" callback={::this._handleTrustSlider} warn={false} disabled={isEngineOn}/>
        else
            return <Slider key="provider_slider" value={providerTrust} iconLeft="icon-negative" iconRight="icon-positive"  aria-label="Trust slider" callback={::this._handleTrustSlider} warn={false} disabled={isEngineOn}/>
    }

    render() {
        const {isRequestorTrust} = this.state
        return (
            <div className="content__trust">
                {this.fetchTrust(isRequestorTrust)}
                <div className="switch__trust">
                    <span style={{
                color: isRequestorTrust ? '#9b9b9b' : '#4e4e4e'
            }}>Providing</span>
                    <div className="switch-box switch-box--green">
                        <label className="switch">
                            <input type="checkbox" onChange={::this._handleTrustSwitch} defaultChecked={isRequestorTrust}  aria-label="Trust switch providing/requesting" tabIndex="0"/>
                            <div className="switch-slider round"></div>
                        </label>
                    </div>
                    <span style={{
                color: isRequestorTrust ? '#4e4e4e' : '#9b9b9b'
            }}>Requesting</span>
                </div>
                <div className="tips__trust">
                    <span>A low setting means your node may get more task requests,  but from less reliable requestors. A high setting could mean  fewer tasks, but more reliable requestors.</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trust)
