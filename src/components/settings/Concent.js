import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy';

import * as Actions from './../../actions'

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    concentSwitch: state.concent.concentSwitch
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Concent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isConcentOn: props.concentSwitch
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.concentSwitch !== this.props.concentSwitch){
            this.setState({
                isConcentOn: nextProps.concentSwitch
            })
        }
    }
    
    _toggleConcentSwitch = () => {
        this.setState({
            isConcentOn: !this.state.isConcentOn
        },() => {
            if(this.state.isConcentOn)
                this.props.actions.toggleConcent(this.state.isConcentOn, true)
            else
                this.props.actions.toggleConcent(this.state.isConcentOn, false)
        })
    }

    _handleUnlockDeposit = () => {
        this.props.actions.unlockConcentDeposit()
    }

    render() {
        const {isEngineOn} = this.props
        const {isConcentOn} = this.state
        return (
            <div className="content__concent" style={{height: isConcentOn ? 200 : 360 }}>
                <span>Concent is service of the Golem network, which aims to improve the integrity
                <br/>and security of marketplace. As a Provider, you should be paid for
                <br/>computations, and as a Requestor, you are assured to get proper results.
                <br/><a href="">Learn more</a> about Concent Service.</span>
                <div className="switch__concent">
                    <div className={`switch-box ${!isConcentOn ? "switch-box--green" : ""}`}>
                      <Tooltip
                        html={<p>To change switch first stop Golem</p>}
                        position="top-end"
                        trigger="mouseenter"
                        interactive={false}
                        size="small"
                        disabled={!isEngineOn}>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                onChange={::this._toggleConcentSwitch} 
                                checked={isConcentOn}  
                                aria-label="Trust switch providing/requesting" 
                                tabIndex="0" />
                            <div className="switch-slider round"></div>
                        </label>
                      </Tooltip>
                    </div>
                    <span style={{
                        color: isConcentOn ? '#4e4e4e' : '#9b9b9b'
                    }}>Concent Service turned {!isConcentOn ? "off" : "on"}.
                    </span>
                </div>
                {
                    !isConcentOn 
                        && <div className="deposit-info__concent">
                            <div>
                                <span>
                                    Deposit amount: <b>213123123 GNT</b>
                                    <br/>
                                    <br/>If you keep the deposit you can turn concent on later without any additional
                                    <br/> transaction fees or you can unlock it now. <a href="">Learn more</a>
                                </span>
                            </div>
                            <div className="action__concent">
                                <button className="btn--outline" onClick={this._handleUnlockDeposit}>Unlock deposit</button>
                                <span className="action-info__concent">By leaving the Deposit locked you can
                                <br/>reduce future Deposit creation transaction
                                <br/>fee <a href="">Learn more</a></span>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Concent)
