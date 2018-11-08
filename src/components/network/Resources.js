import React from 'react';
import { Spring, Transition, Keyframes, animated, config } from "react-spring";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'
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
    systemInfo: state.advanced.systemInfo
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
        let cpu_cores = systemInfo.cpu_cores * ratio
        if (cpu_cores < 1 && val > 0) {
            cpu_cores = 1
            ratio = ratio / 2
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

    _toggleAdvanced(){
        this.setState({
            toggleAdvanced: !this.state.toggleAdvanced
        })
    }

    /** converts memory and disk resources from KiB to GiB */
    toGibibytes(obj) {
        let ret = Object.assign({}, obj)
        ret.cpu_cores = ~~ret.cpu_cores // round
        ret.memory = Number((ret.memory / MEBI).toFixed(2))
        ret.disk = Number((ret.disk / MEBI).toFixed(2))
        return ret
    }

    render() {
        const {isEngineOn, chartValues, systemInfo} = this.props
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
                <div className="advanced-toggler" onClick={::this._toggleAdvanced}>
                        { toggleAdvanced
                            ? <span><span className="icon-settings-simplified"/>Simplified</span>
                            : <span><span className="icon-settings"/>Advanced</span>
                        }
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
                                max={max.cpu_cores }
                                iconLeft="icon-single-server" 
                                iconRight="icon-multi-server" 
                                callback={::this._setResource} 
                                warn={true} 
                                transform={true}
                                disabled={isEngineOn}/>
                        ]
                    } 
                    keys={item => item.key}
                    native
                    from={{ opacity: 0, transform: 100 }}
                    enter={{ opacity: 1, transform: 0 }}
                    leave={{ opacity: 0, transform: 00}}>
                    {item => ({opacity, transform}) =>
                        <animated.div className="horizontal-transition-container" 
                        style={{
                            opacity: opacity.interpolate(x => x), 
                            transform: transform.interpolate(x => `translate3d(${x}%,0,0)`)
                        }}>{item}</animated.div>
                    }
                </Transition>
                <div style={{marginTop: "80px"}}>
                    <TrailEffect 
                        native 
                        items={[
                                <Slider 
                                    key={memory ? memory.toString() : 'ram_slider'} 
                                    inputId="ram_slider" 
                                    value={memory} 
                                    max={max.memory} 
                                    iconLeft="icon-single-server" 
                                    iconRight="icon-multi-server" 
                                    callback={::this._setResource} 
                                    warn={true} 
                                    transform={true}
                                    disabled={isEngineOn}/>,
                                <Slider 
                                    key={disk ? disk.toString() : 'disk_slider'} 
                                    inputId="disk_slider" 
                                    value={disk} 
                                    max={max.disk}
                                    iconLeft="icon-single-server" 
                                    iconRight="icon-multi-server" 
                                    callback={::this._setResource} 
                                    warn={true} 
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
                </div>
                <div className={`slider__tips ${toggleAdvanced ? "expand" : ""}`}>
                        Use the slider to choose how much of your machine’s resources 
                    (CPU, RAM and disk space) Golem can use. More power means 
                    more potential income.
                    <br/>
                    <br/>
                    Remember! To activate the settings please stop Golem first.
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resources)