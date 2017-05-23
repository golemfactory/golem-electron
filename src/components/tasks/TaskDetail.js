import React from 'react';
import { Link } from 'react-router';
import PresetModal from './modal/PresetModal'
import Dropdown from './../Dropdown'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {remote} = window.require('electron');
const {dialog} = remote

import * as Actions from './../../actions'

const mockPresetList = [{
    name: '4K Best Quality'
}]

const mockFormatList = [
    {
        name: 'PNG'
    },
    {
        name: 'EXR'
    }
]

const mapStateToProps = state => ({
    task: state.create.task
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class TaskDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showBackOption: props.params.id != "settings", //<-- HARDCODED
            presetModal: false,
            //INPUTS
            compositing: false,
            resolution: [0, 0],
            frames: null,
            output_path: null,
            timeout: null,
            subtask_count: null,
            subtask_timeout: null,
            bid: 0
        }
    }

    _handleFormInputs(states) {
        this.setState({
            ...states
        })
    }

    _handleOptionChange(list, name) {
        let values = list.filter((item, index) => item.name == name)[0]
        values && this.setState({
            format: values.name
        })
    }

    _handleSavePresetModal() {
        this.setState({
            presetModal: true,
        })
    }

    _closeModal() {
        this.setState({
            presetModal: false,
        })
    }

    _handleOutputPath() {
        let onFolderHandler = data => {
            console.log(data)
            this.setState({
                output_path: data[0]
            })
        }

        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        }, onFolderHandler)
    }

    _handleStartTaskButton() {
        const {resolution, frames, format, output_path, timeout, subtask_count, subtask_timeout, bid, compositing} = this.state
        const {task} = this.props
        this.props.actions.createTask({
            ...task,
            timeout,
            subtask_count,
            subtask_timeout,
            bid,
            options: {
                resolution,
                frames,
                format,
                compositing,
                output_path,
            }
        })
    }

    render() {
        const {showBackOption, presetModal, output_path, timeout, subtask_timeout, bid, compositing} = this.state
        return (
            <div>
                <form onSubmit={::this._handleStartTaskButton} className="content__task-detail">
                <section className="section-preview__task-detail">
                        { showBackOption && <div className="panel-preview__task-detail">
                            <Link to="/tasks" aria-label="Back button to task list">
                                <div>
                                    <span className="icon-arrow-left-white"/>
                                    <span>Back</span>
                                </div>
                            </Link>
                        </div>}
                        {!showBackOption && <button className="btn--outline">Render Local Test</button>}
                    </section>
                        <div className="container__task-detail">
                            <section className="section-settings__task-detail">
                                <h4>Settings</h4>
                                <div className="item-settings">
                                    <span className="title">Preset</span>
                                    <Dropdown list={mockPresetList} selected={0} handleChange={this._handleOptionChange.bind(this, mockPresetList)}/> 
                                </div>
                                <div className="item-settings">
                                    <span className="title">Dimensions</span>
                                    <input type="number" min="0" aria-label="Dimension (width)" onChange={ e => {
                this._handleFormInputs.call(this, {
                    resolution: [parseInt(e.target.value), this.state.resolution[1]]
                })
            }} required/>
                                    <span className="icon-cross"/>
                                    <input type="number" min="0" aria-label="Dimension (height)" onChange={ e => {
                this._handleFormInputs.call(this, {
                    resolution: [this.state.resolution[0], parseInt(e.target.value)]
                })
            }} required/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Frame Range</span>
                                    <input type="text" aria-label="Frame Range" onChange={ e => {
                this._handleFormInputs.call(this, {
                    frames: e.target.value
                })
            }} required/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Format</span>
                                    <Dropdown list={mockFormatList} selected={0} handleChange={this._handleOptionChange.bind(this, mockFormatList)}/> 
                                </div>
                                <div className="item-settings">
                                    <span className="title">Output to</span>
                                    <input type="text" placeholder="…Docs/Golem/Output" aria-label="Output path" value={output_path ? output_path : ''} disabled/>
                                    <button className="btn--outline" onClick={::this._handleOutputPath}>Change</button>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Blender Compositing</span>
                                    <div className="switch-box switch-box--green">
                                        <span>{compositing ? 'On' : 'Off'}</span>
                                        <label className="switch">
                                            <input type="checkbox" aria-label="Blender Compositing Checkbox" tabIndex="0" onChange={ e => {
                this._handleFormInputs.call(this, {
                    compositing: e.target.checked
                })
            }}/>
                                            <div className="switch-slider round"></div>
                                        </label>
                                    </div>
                                </div>
                                 <div className="item-settings">
                                    <span className="title">Task Timeout</span>
                                    <input type="text" placeholder="16:20:00" aria-label="Task Timeout" onChange={ e => {
                this._handleFormInputs.call(this, {
                    timeout: e.target.value
                })
            }} required/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Subtask Amount</span>
                                    <input type="text" placeholder="8" aria-label="Subtask amount" onChange={ e => {
                this._handleFormInputs.call(this, {
                    subtask_count: e.target.value
                })
            }} required/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Subtask Timeout</span>
                                    <input type="text" placeholder="4:10:00" aria-label="Deadline" onChange={ e => {
                this._handleFormInputs.call(this, {
                    subtask_timeout: e.target.value
                })
            }} required/>
                                </div>
                                <div className="item-settings item__preset-button">
                                    <button className="btn--outline" onClick={::this._handleSavePresetModal}>Save as preset</button>
                                </div>
                            </section>
                            <section className="section-price__task-detail">
                                <h4 className="title-price__task-detail">Price</h4>
                                <div className="item-price estimated-price__panel">
                                    <span className="title">Estimated</span>
                                    <span className="estimated-price">0.2</span>
                                    <span>GNT</span>
                                </div>
                                <div className="item-price">
                                    <span className="title">Your bid</span>
                                    <input type="number" min="0" step="0.000001" aria-label="Your bid" onChange={ e => {
                this._handleFormInputs.call(this, {
                    bid: e.target.value
                })
            }} required/>
                                    <span>GNT</span>
                                </div>
                                <span className="item-price tips__price">
                                    You can accept the estimated price or you can bid higher if you would like to increase your chances of quicker processing.
                                </span>
                            </section>
                        </div>
                    
                            {!showBackOption && <section className="section-action__task-detail">
                                <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                                    <span >Cancel</span>
                                </Link>
                                <button type="submit" className="btn--primary">Start Task</button>
                            </section>}
                            </form>
                        {presetModal && <PresetModal closeModal={::this._closeModal}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail)
