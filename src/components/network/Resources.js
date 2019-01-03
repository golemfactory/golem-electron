import React from 'react';
import { Spring, Transition, Keyframes, animated, config } from "react-spring";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy';

import * as Actions from '../../actions'
import {getGPUEnvironment} from '../../reducers'
import Slider from './../Slider.js'

const MEBI = 1 << 20

const preset = Object.freeze({
    CUSTOM: 'custom'
})

// Creates a keyframed trail
const TrailEffect = Keyframes.Trail({
  open: { x: 0, opacity: 1, delay: 100 },
  close: { x: -100, opacity: 0 }
})

const mapStateToProps = state => ({
    chartValues: state.advanced.chartValues,
    chosenPreset: state.advanced.chosenPreset,
    isEngineOn: state.info.isEngineOn,
    resource: state.resources.resource,
    presetList: state.advanced.presetList,
    systemInfo: state.advanced.systemInfo,
    gpuEnvironment: getGPUEnvironment(state, 'gpuEnv'),
    isNodeProvider: state.info.isNodeProvider
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Resources extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            resource: props.resource,
            toggleAdvanced: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.resource !== this.props.resource){
            this.setState({
                resource: nextProps.resource
            })
        }
    }

    /**
     * [_setResource func. will update resource and advanced states on redux store]
     * @param {Int}         value       [Percentage of the resources]
     */
    _setResource(value) {
        this.props.actions.setResources(value)
        this.props.actions.setAdvancedManually(this.calculateHardwareAmount(value))
    }

    /**
     * [calculateHardwareAmount func. will calculate amount the hardware with given resource percentage]
     * @param  {Int}        val     [Percentage of the resources]
     * @return {Object}             [Custom hardware preset object]
     */
    calculateHardwareAmount(val) {
        const {systemInfo} = this.props
        let ratio = val / 100;
        let cpu_cores = systemInfo.cpu_cores * ratio;
        const payOff = (1 - cpu_cores) / systemInfo.cpu_cores
        
        if(payOff > 0 && val > 0) {
            cpu_cores = 1;
            ratio -= payOff / 2;
        }

        const memory = systemInfo.memory * ratio;
        const disk = systemInfo.disk * ratio;
        return {
            cpu_cores,
            memory,
            disk,
            name: preset.CUSTOM
        }
    }

    _toggleAdvanced =(max) => {
        if(max.memory)
            this.setState({
                toggleAdvanced: !this.state.toggleAdvanced
            })
    }

    /**
     * [_handleGPUProviderSwitch onChange function]
     * @return  {Boolean}   true
     */
    _handleGPUProviderSwitch(evt) {
        const {actions} = this.props;
        const gpuENV = 'BLENDER_NVGPU'
        if(evt.target.checked)
          actions.enableEnvironment(gpuENV);
        else
          actions.disableEnvironment(gpuENV);
    }

    /**
     * [_handleProviderSwitch onChange function]
     * @return  {Boolean}   true
     */
    _handleProviderSwitch(evt) {
        const {actions} = this.props;
        actions.setProviding(!evt.target.checked);
    }

    /** converts memory and disk resources from KiB to GiB */
    toGibibytes(obj) {
        let ret = Object.assign({}, obj)
        ret.cpu_cores = ~~ret.cpu_cores // round
        ret.memory = Number((ret.memory / MEBI).toFixed(2))
        ret.disk = Number((ret.disk / MEBI).toFixed(2))
        return ret
    }

    /**
     * [_handleInputChange func. If there's any change on input, the func. will update state]
     * @param  {Any}        key         [State key]
     * @param  {Event}      evt
     */
    _handleInputChange(key, value) {
        let val = Number(value)
        if (['memory', 'disk'].includes(key)) {
            val *= MEBI // GiB to KiB
        }
        if (key == 'cpu_cores') {
            val = ~~val // round
        }

        const {actions, chartValues} = this.props
        actions.setAdvancedManually({
            ...chartValues,
            [key]: val,
            name: preset.CUSTOM
        })
        actions.setResources(this.calculateResourceValue({
            ...chartValues,
            [key]: val
        }))
    }

    /**
     * [calculateResourceValue func.]
     * @param  {Int}        options.cpu_cores       [Selected cpu core amount]
     * @param  {Int}        options.memory          [Selected memory amount]
     * @param  {Int}        options.disk            [Selected disk space amount]
     * @return {Int}                                [Mean of their percentage]
     */
    calculateResourceValue({cpu_cores, memory, disk}) {
        const {systemInfo} = this.props
        let cpuRatio = cpu_cores / systemInfo.cpu_cores
        let ramRatio = memory / systemInfo.memory
        let diskRatio = disk / systemInfo.disk
        return Math.min(100 * ((cpuRatio + ramRatio + diskRatio) / 3), 100)
    }

    render() {
        const {isEngineOn, chartValues, systemInfo, gpuEnvironment, isNodeProvider} = this.props
        const {resource, toggleAdvanced} = this.state
        const {cpu_cores, memory, disk} = this.toGibibytes(chartValues)
        const max = this.toGibibytes(systemInfo)

        const springFrom = toggleAdvanced
                                ? { value: resource, max: 100 }
                                : { value: cpu_cores, max: max.cpu_cores }

        const springTo = toggleAdvanced
                                ? { value: cpu_cores, max: max.cpu_cores }
                                : { value: resource, max: 100 }
        return (
            <div className="content__resources">
                <div className="advanced-toggler">
                        <h5>Resources</h5>
                        <div className="toggler-btn" onClick={this._toggleAdvanced.bind(null, max)}>
                            { toggleAdvanced
                                ? <span><span className="icon-settings-simplified"/>Simplified</span>
                                : <span><span className="icon-settings"/>Advanced</span>
                            }
                        </div>
                </div>
                <Transition
                    items={
                        !toggleAdvanced ? 
                        [
                            <Slider 
                                key={resource ? resource.toString() : 'resource_slider'} 
                                inputId="resource_slider" 
                                value={resource} 
                                max={100}
                                iconLeft="icon-single-server" 
                                iconRight="icon-multi-server" 
                                callback={::this._setResource} 
                                warn={true} 
                                transform={true}
                                disabled={isEngineOn}/>
                        ] : [
                            <Slider 
                                key={cpu_cores ? cpu_cores.toString() : 'cpu_slider'} 
                                inputId="cpu_slider" 
                                value={cpu_cores} 
                                max={max.cpu_cores}
                                textLeft="CPU" 
                                textRight="Cores" 
                                callback={this._handleInputChange.bind(this, 'cpu_cores')} 
                                warn={true} 
                                warnStep={[max.cpu_cores - 1, max.cpu_cores]}
                                transform={true}
                                disabled={isEngineOn}/>
                        ]
                    } 
                    keys={item => item.props.inputId}
                    native
                    initial={null}
                    from={{ opacity: 0, transform: 100 }}
                    enter={{ opacity: 1, transform: 0 }}
                    leave={{ opacity: 0, transform: 100}}>
                    {item => ({opacity, transform}) =>
                        <animated.div className="horizontal-transition-container" 
                        style={{
                            opacity: opacity.interpolate(x => x), 
                            transform: transform.interpolate(x => `translate3d(${x}%,0,0)`)
                        }}>{item}</animated.div>
                    }
                </Transition>
                <div style={{marginTop: "90px"}}>
                {max.memory 
                    ? <TrailEffect 
                        native 
                        items={[
                                <Slider 
                                    key={memory ? memory.toString() : 'ram_slider'} 
                                    inputId="ram_slider" 
                                    value={memory} 
                                    max={parseFloat(max.memory).toFixed(1)}
                                    textLeft="RAM" 
                                    textRight="GiB"  
                                    callback={this._handleInputChange.bind(this, 'memory')}
                                    step={0.1}
                                    warn={true} 
                                    warnStep={[max.memory - 2, max.memory-1]}
                                    transform={true}
                                    disabled={isEngineOn}/>,
                                <Slider 
                                    key={disk ? disk.toString() : 'disk_slider'} 
                                    inputId="disk_slider" 
                                    value={disk} 
                                    max={parseFloat(max.disk).toFixed(1)}
                                    textLeft="DISK" 
                                    textRight="GiB"   
                                    callback={this._handleInputChange.bind(this, 'disk')} 
                                    step={0.1}
                                    warn={true} 
                                    warnStep={[((max.disk/100) * 75), ((max.disk/100) * 90)]}
                                    transform={true}
                                    disabled={isEngineOn}/>,
                        ]} 
                        keys={[1,2,3]} 
                        reverse={false} 
                        state={toggleAdvanced ? "open" : "close"}>
                    {(item, i) => ({ x, ...props }) => (
                      <animated.div
                        style={{
                          transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                          ...props
                        }}>
                        {item}
                      </animated.div>
                    )}
                    </TrailEffect>
                    : <div style={{height: "94px"}}/> }
                    
                </div>
                <div className={`resource-switch-panel ${toggleAdvanced ? "expand" : ""}`}>
                    <div className="switch__gpu">
                    <div className={`switch-box`}>
                    <Tooltip
                        html={<p>{gpuEnvironment.supported 
                          ? "To change switch first stop Golem" 
                          : "This feature only for Linux at the moment."}</p>}
                        position="top-end"
                        trigger="mouseenter"
                        interactive={false}
                        size="small"
                        disabled={!gpuEnvironment.supported ? false : !isEngineOn}>
                          <label className="switch">
                              <input 
                                type="checkbox" 
                                onChange={::this._handleGPUProviderSwitch} 
                                defaultChecked={gpuEnvironment.supported && gpuEnvironment.accepted}  
                                aria-label="GPU switch for provider" 
                                tabIndex="0" 
                                disabled={!gpuEnvironment.supported}/>
                              <div className="switch-slider round"></div>
                          </label>
                        </Tooltip>
                    </div>
                    <span style={{
                        color: gpuEnvironment.supported ? '#4e4e4e' : '#9b9b9b'
                    }}>
                        Use my GPU as a resource. For Linux users with Nvidia card.
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
                    <div className="switch__trust">
                        <div className="switch-box switch-box--green">
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
                                    onChange={::this._handleProviderSwitch} 
                                    defaultChecked={!isNodeProvider}  
                                    aria-label="Trust switch providing/requesting" 
                                    tabIndex="0" 
                                    disabled={isEngineOn}/>
                                <div className="switch-slider round"></div>
                            </label>
                          </Tooltip>
                        </div>
                        <span style={{
                            color: !isNodeProvider ? '#4e4e4e' : '#9b9b9b'
                        }}>I want to act only as a Requestor. Don't send tasks to my node.
                        </span>
                    </div>
                        { !toggleAdvanced 
                            ?   <div className="slider__tips">
                                    Use the slider to choose how much of your machine’s resources 
                                    (CPU, RAM and disk space) Golem can use. More power means 
                                    more potential income. 
                                </div>
                            :   <div className="slider__tips">
                                    Allocate your machine's resources exactly as you like.
                                    <br/>
                                    Remember that if you give Golem all of you processing power, 
                                    <br/>
                                    you will not be able to use it at the same time.
                                </div>
                        }
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resources)