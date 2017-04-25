import React from 'react';
import Slider from './../Slider'

export default class Trust extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            trust: true
        }
    }

    /**
     * [_handleTrustSwitch onChange function for switch input]
     * @return  {Boolean}   true
     */

    _handleTrustSwitch() {
        this.setState({
            trust: !this.state.trust
        })
    }

    render() {
        const {trust} = this.state
        return (
            <div className="content__trust">
                <Slider value="25" iconLeft="icon-negative" iconRight="icon-positive"  aria-label="Trust slider"/>
                <div className="switch__trust">
                    <span style={{
                color: trust ? '#9b9b9b' : '#4e4e4e'
            }}>Providing</span>
                    <div className="switch-box switch-box--green">
                        <label className="switch">
                            <input type="checkbox" onChange={::this._handleTrustSwitch} defaultChecked={trust}  aria-label="Trust switch providing/requesting" tabIndex="0"/>
                            <div className="switch-slider round"></div>
                        </label>
                    </div>
                    <span style={{
                color: trust ? '#4e4e4e' : '#9b9b9b'
            }}>Requesting</span>
                </div>
                <div className="tips__trust">
                    <span>A low setting means your node may get more task requests,  but from less reliable requestors. A high setting could mean  less tasks, but more reliable requestors.</span>
                </div>
            </div>
        );
    }
}
