import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'

import RadialProgress from './../../RadialProgress'

const mockSystemConfig = {
    cpu: 4,
    ram: 4096000,
    disk: 12288000
}

const mapStateToProps = state => ({
    presetList: state.advanced.presetList,
    chosenPreset: state.advanced.chosenPreset
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Advanced extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cpu: 0,
            ram: 0,
            disk: 0
        }
    }

    componentDidMount() {
        // /*MOCK VALUES*/
        // this._handleChange('cpu', {
        //     target: {
        //         value: 0
        //     }
        // })
        // this._handleChange('ram', {
        //     target: {
        //         value: 25000
        //     }
        // })
        // this._handleChange('disk', {
        //     target: {
        //         value: 1024
        //     }
        // })
        const {presetList, chosenPreset} = this.props
        this._handleOptionChange(presetList, {
            target: {
                value: chosenPreset
            }
        })

    }

    _handleChange(key, evt) {
        this.setState({
            [key]: evt.target.value
        })
    }

    _handleOptionChange(list, evt) {
        let values = list.filter((item, index) => item.name == evt.target.value)[0]
        values && this.setState({
            cpu: values.cpu_cores,
            ram: values.memory,
            disk: values.disk
        })
    }

    fillOption(list) {
        return list.map((item, index) => <option key={index.toString()} value={item.name}>{item.name}</option>)
    }

    render() {
        const {cpu, ram, disk} = this.state
        const {presetList, chosenPreset} = this.props
        return (
            <div className="content__advanced">
            <div className="quick-settings__advanced">
              <div className="select">
                <select onChange={this._handleOptionChange.bind(this, presetList)} defaultValue={chosenPreset}>
                 {this.fillOption(presetList)}
                </select>
              </div>
              <button className="btn--outline">Save as Preset</button>
            </div>
            <div className="section__radial-options">
              <div className="item__radial-options">
                <RadialProgress pct={cpu} title="CPU" max={mockSystemConfig.cpu}/>
                <input type="number" min="0" step="1" max={mockSystemConfig.cpu} onChange={this._handleChange.bind(this, 'cpu')} value={cpu}/>
              </div>
              <div className="item__radial-options">
                <RadialProgress pct={ram} title="RAM" max={mockSystemConfig.ram}/>
                <input type="number" min="0" step="128" max={mockSystemConfig.ram} onChange={this._handleChange.bind(this, 'ram')} value={ram}/>
              </div>
              <div className="item__radial-options">
                <RadialProgress pct={disk} title="Disk" max={mockSystemConfig.disk}/>
                <input type="number" min="0" step="1" max={mockSystemConfig.disk} onChange={this._handleChange.bind(this, 'disk')} value={disk}/>
              </div>
            </div>
            <div className="advanced__tips">
              <span>Allocate your machine’s resources exactly as you like. Remember that if you give Golem all of your processing power you will not be  able to use it at the same time.</span>
            </div>
          </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Advanced)
