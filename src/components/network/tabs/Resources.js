import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'
import Slider from './../../Slider.js'

const MEBI = 1 << 20

const preset = Object.freeze({
    CUSTOM: 'custom'
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
        let {cpu_cores, memory, disk} = this.toGibibytes(chartValues)
        let max = this.toGibibytes(systemInfo)
        return (
            <div className="content__resources">
                <div className="advanced-toggler" onClick={::this._toggleAdvanced}>
                        { toggleAdvanced
                            ? <span><span className="icon-settings"/>Simplified</span>
                            : <span><span className="icon-settings"/>Advanced</span>
                        }
                </div>
                 { toggleAdvanced
                    ? <div>
                            <Slider 
                                key={cpu_cores ? cpu_cores.toString() : 'empty'} 
                                inputId="cpu_slider" 
                                value={cpu_cores} 
                                max={max.cpu_cores}
                                iconLeft="icon-cpu" 
                                iconRight="icon-multi-server" 
                                callback={::this._setResource} 
                                warn={true} 
                                disabled={isEngineOn}/> 
                            <Slider 
                                key={memory ? memory.toString() : 'empty'} 
                                inputId="ram_slider" 
                                value={memory} 
                                max={max.memory} 
                                iconLeft="icon-single-server" 
                                iconRight="icon-multi-server" 
                                callback={::this._setResource} 
                                warn={true} 
                                disabled={isEngineOn}/> 
                            <Slider 
                                key={disk ? disk.toString() : 'empty'} 
                                inputId="disk_slider" 
                                value={disk} 
                                max={max.disk}
                                iconLeft="icon-single-server" 
                                iconRight="icon-multi-server" 
                                callback={::this._setResource} 
                                warn={true} 
                                disabled={isEngineOn}/> 
                        </div>
                    : <Slider 
                        key={resource ? resource.toString() : 'empty'} 
                        inputId="resource_slider" 
                        value={resource} 
                        iconLeft="icon-single-server" 
                        iconRight="icon-multi-server" 
                        callback={::this._setResource} 
                        warn={true} 
                        disabled={isEngineOn}/> 
                    }
                
                <div className="slider__tips">
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