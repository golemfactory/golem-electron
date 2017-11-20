import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'
import Slider from './../../Slider.js'


const preset = Object.freeze({
    DEFAULT: 'default',
    CUSTOM: 'custom'
})

const mapStateToProps = state => ({
    resource: state.resources.resource,
    systemInfo: state.advanced.systemInfo,
    isEngineOn: state.info.isEngineOn,
    presetList: state.advanced.presetList,
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Resources extends React.Component {

    constructor(props) {
        super(props);

        if(props.resource === undefined){
            const defaultPreset = props.presetList.filter(item => item.name = preset.DEFAULT)[0]

            if(defaultPreset){
                const value = this.calculateResourceValue(defaultPreset)
                this.props.actions.setResources(value)
            }
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

    /********* DUPLICATED IN ADVANCED *********/

    /**
     * [calculateResourceValue func.]
     * @param  {Int}        options.cpu_cores       [Selected cpu core amount]
     * @param  {Int}        options.memory          [Selected memory amount]
     * @param  {Int}        options.disk            [Selected disk space amount]
     * @return {Int}                                [Mean of their percentage]
     */
    calculateResourceValue({cpu_cores, memory, disk}) {
        const {systemInfo} = this.props
        let cpuRatio = (this.maxVal(cpu_cores, systemInfo.cpu_cores) / systemInfo.cpu_cores)
        let ramRatio = (this.maxVal(memory, systemInfo.memory) / systemInfo.memory)
        let diskRatio = (this.maxVal(disk, systemInfo.disk) / systemInfo.disk)
        return 100 * ((cpuRatio + ramRatio + diskRatio) / 3)
    }

    /**
     * [maxVal check the max limit for the resources]
     * @param  {Number} val   [Given resource value]
     * @param  {Number} limit [Max limit for the given resource value]
     * @return {Number}       [Min value of between]
     */
    maxVal(val, limit) {
        return Math.min(val, limit)
    }

    render() {
        const {resource, isEngineOn} = this.props
        return (
            <div className="content__resources">
                <Slider value={resource} iconLeft="icon-single-server" iconRight="icon-multi-server" callback={::this._setResource} warn={true} disabled={isEngineOn}/>
                <div className="slider__tips">
                        Use the slider to choose how much of your machine’s resources 
                    (CPU, RAM and disk space) Golem can use. More power means 
                    more potential income.
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resources)