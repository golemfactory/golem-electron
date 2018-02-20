import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../../actions'

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    localGeth: state.geth.localGeth
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Geth extends React.Component {

    constructor(props) {
        super(props);
        
    }

    /**
     * [_handleGethSwitch onChange function for switch input]
     * @return  {Boolean}   true
     */
    _handleGethSwitch() {
        const {localGeth, actions} = this.props
        const {isLocalGeth} = localGeth
        actions.setLocalGeth({
            isLocalGeth: !isLocalGeth
        })
    }

    _handleGethPort(e){
        this.props.actions.setLocalGeth({
            gethPort: e.target.value
        })
    }

    _handleGethAddress(e){
        this.props.actions.setLocalGeth({
            gethAddress: e.target.value
        })
    }

    render() {
        const {isEngineOn, localGeth} = this.props
        const {isLocalGeth, gethPort, gethAddress} = localGeth
        return (
            <div className="content__geth">
                <div className="section__flag">
                    <span>Local Geth</span>
                    <div className="switch-box switch-box--green">
                        <label className="switch">
                            <input type="checkbox" onChange={::this._handleGethSwitch} defaultChecked={isLocalGeth}  aria-label="Trust switch providing/requesting" tabIndex="0"/>
                            <div className="switch-slider round"></div>
                        </label>
                    </div>
                </div>
                <div className="section__advanced">
                    <span>Local Geth Port <br/><span className="label_optional">(optional)</span></span>
                    <input type="number" min="0" max="65535" step={1} defaultValue={gethPort} onChange={::this._handleGethPort} aria-label="Port of Local Geth" disabled={!isLocalGeth}/>
                </div>
                <div className="section__advanced">
                    <span>Remote Geth Address</span>
                    <input type="text" defaultValue={gethAddress} onChange={::this._handleGethAddress} className="address-input__geth" aria-label="URI of Local Geth" disabled={isLocalGeth}/>
                </div>
                <div className="section__tips">
                    <span className="tips__geth">Enabling custom geth option will require restart the application.</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Geth)
