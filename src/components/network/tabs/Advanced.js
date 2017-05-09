import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'

import RadialProgress from './../../RadialProgress'

const mockSystemConfig = {
    cpu: 8,
    ram: 32768,
    disk: 2048
}

const mapStateToProps = state => ({
    //chartValues: state.advance.chartValues
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
        /*MOCK VALUES*/
        this._handleChange('cpu', {
            target: {
                value: 8
            }
        })
        this._handleChange('ram', {
            target: {
                value: 25000
            }
        })
        this._handleChange('disk', {
            target: {
                value: 1024
            }
        })
    }

    _handleChange(key, evt) {
        this.setState({
            [key]: evt.target.value
        })
    }

    render() {
        const {cpu, ram, disk} = this.state
        return (
            <div className="content__advanced">
            <div className="quick-settings__advanced">
              <div className="select">
                <select >
                 <option>Custom</option>
                </select>
              </div>
              <button className="btn--outline">Save as Preset</button>
            </div>
            <div className="section__radial-options">
              <div className="item__radial-options">
                <RadialProgress pct={cpu} title="CPU" max={mockSystemConfig.cpu}/>
                <input type="number" min="0" step="1" max={mockSystemConfig.cpu} onChange={this._handleChange.bind(this, 'cpu')} defaultValue={8}/>
              </div>
              <div className="item__radial-options">
                <RadialProgress pct={ram} title="RAM" max={mockSystemConfig.ram}/>
                <input type="number" min="0" step="128" max={mockSystemConfig.ram} onChange={this._handleChange.bind(this, 'ram')} defaultValue={25000}/>
              </div>
              <div className="item__radial-options">
                <RadialProgress pct={disk} title="Disk" max={mockSystemConfig.disk}/>
                <input type="number" min="0" step="1" max={mockSystemConfig.disk} onChange={this._handleChange.bind(this, 'disk')} defaultValue={1024}/>
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
