import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../../actions'

const {remote} = window.electron;
const mainProcess = remote.require('./index')

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    localGeth: state.geth.localGeth,
    isMainnet: state.info.isMainnet
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Geth extends React.Component {

    constructor(props) {
        super(props);
        const {localGeth} = props
        this.state = {
            isLocalGeth: (localGeth && localGeth.isLocalGeth) || false,
            gethPort: (localGeth && localGeth.gethPort) || "",
            gethAddress: (localGeth && localGeth.gethAddress) || "",
            isStartLocked: true
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const {localGeth} = nextProps
        const {isLocalGeth, gethPort, gethAddress, isStartLocked} = nextState

        if(
            isLocalGeth !== localGeth.isLocalGeth ||
            gethPort !== localGeth.gethPort ||
            gethAddress !== localGeth.gethAddress
        ){
            if(nextState.isStartLocked)
                this.setState({
                    isStartLocked: false
                })
        } else if(!nextState.isStartLocked) {
            this.setState({
                isStartLocked: true
            })
        }
    }

    /**
     * [_handleGethSwitch onChange function for switch input]
     * @return  {Boolean}   true
     */
    _handleGethSwitch() {
        const {isLocalGeth} = this.state
        this.setState({
            isLocalGeth: !isLocalGeth
        })
    }

    _preventSpace(event){
        var key = event.which || window.event.which;
        if (key === 32) {
          event.preventDefault();
        }
    }

    _handleGethPort(e){

        this.setState({
            gethPort: e.target.value || ''
        })
        // this.props.actions.setLocalGeth({
        //     gethPort: e.target.value
        // })
    }

    _handleGethAddress(e){
        e.target.checkValidity();
        if (!e.target.validity.valid)
                e.target.classList.add("invalid");
        else{
            e.target.classList.remove("invalid");
            this.setState({
                gethAddress: e.target.value || ''
            })
        }
    }

    _checkAnyChanges(e){
        const {localGeth} = this.props
        const {isLocalGeth, gethPort, gethAddress} = this.state
        if(
            isLocalGeth !== localGeth.isLocalGeth ||
            gethPort !== localGeth.gethPort ||
            gethAddress !== localGeth.gethAddress ||
            !isLocalGeth ||
            !gethPort || 
            !gethAddress
        ){
                return true
        }

        return false
    }

    _handleSave(e){
        const {isLocalGeth, gethPort, gethAddress} = this.state
        const {isMainnet} = this.props

        if(gethAddress || isLocalGeth){
            //TODO check geth
            const deferred = mainProcess.validateGeth(isLocalGeth, gethAddress, gethPort, isMainnet)
            deferred.then(result => {
                if(result && !!result.status){
                    this.props.actions.setLocalGeth({
                        isLocalGeth, 
                        gethPort, 
                        gethAddress
                    })

                    this.setState({
                        gethError: result.error
                    })

                } else if(result && !result.status){
                    this.setState({
                        gethError: result.error
                    })
                }
            });
        }
    }

    render() {
        const {isStartLocked, isLocalGeth, gethError} = this.state
        const {isEngineOn, localGeth} = this.props
        const { gethPort, gethAddress} = localGeth
        return (
            <form className="content__geth" onSubmit={::this._handleSave}>
                <div className="section__flag">
                    <span>Local Geth</span>
                    <div className="switch-box switch-box--green">
                        <label className="switch">
                            <input type="checkbox" onChange={::this._handleGethSwitch} defaultChecked={isLocalGeth}  aria-label="Trust switch providing/requesting" tabIndex="0"/>
                            <div className="switch-slider round"></div>
                        </label>
                    </div>
                    <span>Local Geth Port <br/><span className="label_optional">(optional)</span></span>
                    <input type="number" min="0" max="65535" step={1} defaultValue={gethPort} onChange={::this._handleGethPort} aria-label="Port of Local Geth" disabled={!isLocalGeth}/>
                </div>
                <div className="section__advanced">
                    <span>Remote Geth Address</span>
                    <input 
                        type="text" 
                        defaultValue={gethAddress} 
                        onChange={::this._handleGethAddress} 
                        onKeyPress={::this._preventSpace}
                        className="address-input__geth" 
                        aria-label="URI of Local Geth" 
                        pattern="^(https?)://.*$"
                        placeholder="To connect default geth leave blank."
                        disabled={isLocalGeth}/>
                </div>
                <button type="submit" className="btn btn--outline" disabled={isStartLocked}>Save</button>
                <div className="section__tips">
                    <span className="tips__geth">Enabling custom geth option will require restart of the application</span>
                    {gethError && <span className="error_geth">{gethError}</span>}
                </div>
            </form>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Geth)
