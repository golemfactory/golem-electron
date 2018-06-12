import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'

import RadialProgress from './../../RadialProgress'
import Dropdown from './../../Dropdown'

const MEBI = 1 << 20

const mockSystemInfo = {
    num_cores: 3,
    max_memory_size: 3 * MEBI,    // in KiB
    max_resource_size: 10 * MEBI  // in KiB
}

const preset = Object.freeze({
    CUSTOM: 'custom'
})

const mapStateToProps = state => ({
    systemInfo: state.advanced.systemInfo,
    presetList: state.advanced.presetList,
    chosenPreset: state.advanced.chosenPreset,
    chartValues: state.advanced.chartValues,
    isEngineOn: state.info.isEngineOn
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Advanced extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
      const {actions, presetList, chosenPreset} = this.props
      const value = presetList.find(item => item.name === chosenPreset);
      if (value) {
          actions.setAdvancedChart({
              ...value
          });
      }
    }

    /**
     * [_handleInputChange func. If there's any change on input, the func. will update state]
     * @param  {Any}        key         [State key]
     * @param  {Event}      evt
     */
    _handleInputChange(key, evt) {
        evt.target.value = Math.max(1, evt.target.value)
        let val = Number(evt.target.value)
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
     * [_handleOptionChange func. will update adnvanced chart if there's any change on dropdown]
     * @param  {Array}          list          [List of dropdown]
     * @param  {String}         selectedIndex [0-originated number of selected option]
     * @param  {String}         init          [Initial loading: true, personal choose: false]
     */
    _handleOptionChange(list, selectedIndex, init = false) {
        const {actions, chartValues} = this.props
        const value = list.find(item => item.name === selectedIndex);
        if (value) {
            actions.setChosenPreset(value.name, init)
            actions.setAdvancedChart({
                ...value
            });
            !init && actions.setResources(this.calculateResourceValue(value))
        }
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

    /**
     * [fillOption func. will populate dropdown from Redux store]
     * @param  {Array}      list        [List of hardware presets]
     * @return {DOM}                    [option elements for the select list]
     */
    fillOption(list) {
        return list.map((item, index) => <option key={index.toString()} value={item.name}>{item.name}</option>)
    }

    /**
     * [_handleSavePresetModal func. will open save preset modal]
     * @param  {Object}     data    [Custom hardware preset object]
     */
    _handleSavePresetModal(data) {
        this.props.modalHandler(data)
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
        const {presetList, chosenPreset, manageHandler, systemInfo, chartValues, isEngineOn} = this.props
        let {cpu_cores, memory, disk} = this.toGibibytes(chartValues)
        let max = this.toGibibytes(systemInfo)

        return (
            <div className="content__advanced">
            <div className="quick-settings__advanced">
              <Dropdown list={presetList} selected={presetList.map(item => item.name).indexOf(chosenPreset)} handleChange={this._handleOptionChange.bind(this, presetList)} manageHandler={manageHandler}  presetManager disabled={isEngineOn}/>
              <button className="btn--outline" onClick={this._handleSavePresetModal.bind(this, {
                cpu_cores,
                memory,
                disk
            })} disabled={isEngineOn}>Save as Preset</button>
            </div>
            <div className="section__radial-options">
                <RadialProgress pct={cpu_cores} title="CPU" unit="Cores" max={max.cpu_cores} warn={true} disabled={isEngineOn}
                                onChange={this._handleInputChange.bind(this, 'cpu_cores')}/>
                <RadialProgress pct={memory} title="RAM" unit="GiB" max={max.memory} warn={true} disabled={isEngineOn}
                                onChange={this._handleInputChange.bind(this, 'memory')}/>
                <RadialProgress pct={disk} title="Disk" unit="GiB" max={max.disk} warn={true} disabled={isEngineOn}
                                onChange={this._handleInputChange.bind(this, 'disk')}/>
            </div>
            <div className="advanced__tips">
              <span>Allocate your machine’s resources exactly as you like. Remember that if you give Golem all of your processing power you will not be able to use it at the same time.
              <br/>
              <br/>
              Remember! To activate the settings please stop Golem first.
              </span>
            </div>
          </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Advanced)
