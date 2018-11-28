import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy';

import * as Actions from './../../actions'

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Concent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isConcentOn: this.props.isConcentOn
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isConcentOn !== this.props.isConcentOn){
            this.setState({
                isConcentOn: nextProps.isConcentOn
            })
        }
    }
    
    _toggleConcentSwitch = () => {
        this.setState({
            isConcentOn: !this.state.isConcentOn
        },() => {
            this.props.toggleConcentSwitch(this.state.isConcentOn)
        })
    }

    render() {
        const {isEngineOn} = this.props
        const {isConcentOn} = this.state
        return (
            <div className="content__concent">
                <span>Concent is service of the Golem network, which aims to improve the integrity
                <br/>and security of marketplace. As a Provider, you should be paid for
                <br/>computations, and as a Requestor, you are assured to get proper results.
                <br/><a href="">Learn more</a> about Concent Service.</span>
                <div className="tips__concent">
                    <span>Remember! To activate the settings please stop Golem first.</span>
                </div>
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
                                    tabIndex="0" 
                                    disabled={isEngineOn}/>
                                <div className="switch-slider round"></div>
                            </label>
                          </Tooltip>
                        </div>
                        <span style={{
                            color: isConcentOn ? '#4e4e4e' : '#9b9b9b'
                        }}>Concent Service turned {!isConcentOn ? "off" : "on"}.
                          <Tooltip
                                    html={<p className='info-gpu'>
                                            For now there is no option to set the amount of shared resources 
                                            <br/> with GPU.So Golem will take up to 100% of your graphic card
                                            <br/> during computation. <a href="https://golem.network/documentation/faq/#why-am-i-not-able-to-select-the-amount-of-gpu-resources-in-golem">
                                            Learn more.</a>
                                        </p>}
                                    position="top"
                                    trigger="mouseenter"
                                    interactive={true}>
                              <span className="icon-question-mark"/>
                          </Tooltip>
                        </span>
                    </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Concent)
