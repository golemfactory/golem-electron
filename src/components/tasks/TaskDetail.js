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
    task: state.create.task,
    taskInfo: state.details.detail
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
            frames: '',
            format: '',
            formatIndex: 0,
            output_path: '',
            timeout: '',
            subtask_count: 0,
            subtask_timeout: '',
            bid: 0
        }
    }

    componentDidMount() {
        const {params, actions} = this.props
        if (params.id != "settings") {
            actions.getTaskDetails(params.id)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.taskInfo && nextProps.params.id != "settings") {
            const {timeout, subtask_count, subtask_timeout, options, bid} = nextProps.taskInfo
            const {resolutionW, resolutionH, framesRef, formatRef, outputPath, compositing, taskTimeout, subtaskCount, subtaskTimeout, bidRef} = this.refs
            resolutionW.value = options.resolution[0]
            resolutionH.value = options.resolution[1]
            framesRef.value = options.frames ? options.frames : 1
            outputPath.value = options.output_path
            compositing.value = options.compositing
            taskTimeout.value = timeout
            subtaskCount.value = subtask_count
            subtaskTimeout.value = subtask_timeout
            bidRef.value = bid
            let formatIndex = mockFormatList.map(item => item.name).indexOf(options.format)
            this.setState({
                formatIndex
            })
            console.log(formatIndex)
        }

    }

    _handleResolution(index, e) {
        let res = this.state.resolution
        res[index] = parseInt(e.target.value)
        this.setState({
            resolution: res
        })
    }

    _handleFormInputs(state, e) {
        this.setState({
            [state]: e.target.value
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
            }, () => {
                this.refs.outputPath.value = data[0]
            })
        }

        dialog.showOpenDialog({
            properties: ['openDirectory']
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
        const {showBackOption, presetModal, resolution, frames, formatIndex, output_path, timeout, subtask_count, subtask_timeout, bid, compositing} = this.state
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
                                    <Dropdown list={mockPresetList} selected={0} handleChange={this._handleOptionChange.bind(this, mockPresetList)} disabled={showBackOption}/> 
                                </div>
                                <div className="item-settings">
                                    <span className="title">Dimensions</span>
                                    <input ref="resolutionW" type="number" min="0" aria-label="Dimension (width)" onChange={this._handleResolution.bind(this, 0)} required={!showBackOption} disabled={showBackOption}/>
                                    <span className="icon-cross"/>
                                    <input ref="resolutionH" type="number" min="0" aria-label="Dimension (height)" onChange={this._handleResolution.bind(this, 1)} required={!showBackOption} disabled={showBackOption}/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Frame Range</span>
                                    <input ref="framesRef" type="text" aria-label="Frame Range" onChange={this._handleFormInputs.bind(this, 'frames')} required={!showBackOption} disabled={showBackOption}/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Format</span>
                                    <Dropdown ref="formatRef" list={mockFormatList} selected={formatIndex} handleChange={this._handleOptionChange.bind(this, mockFormatList)} disabled={showBackOption}/> 
                                </div>
                                <div className="item-settings">
                                    <span className="title">Output to</span>
                                    <input ref="outputPath" type="text" placeholder="…Docs/Golem/Output" aria-label="Output path" disabled/>
                                    <button className="btn--outline" onClick={::this._handleOutputPath} disabled={showBackOption}>Change</button>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Blender Compositing</span>
                                    <div className="switch-box switch-box--green">
                                        <span>{compositing ? 'On' : 'Off'}</span>
                                        <label className="switch">
                                            <input ref="compositing" type="checkbox" aria-label="Blender Compositing Checkbox" tabIndex="0" onChange={this._handleFormInputs.bind(this, 'compositing')} disabled={showBackOption}/>
                                            <div className="switch-slider round"></div>
                                        </label>
                                    </div>
                                </div>
                                 <div className="item-settings">
                                    <span className="title">Task Timeout</span>
                                    <input ref="taskTimeout" type="text" placeholder="16:20:00" aria-label="Task Timeout" onChange={this._handleFormInputs.bind(this, 'timeout')} required={!showBackOption} disabled={showBackOption}/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Subtask Amount</span>
                                    <input ref="subtaskCount" type="text" placeholder="8" aria-label="Subtask amount" onChange={this._handleFormInputs.bind(this, 'subtask_count')} required={!showBackOption} disabled={showBackOption}/>
                                </div>
                                <div className="item-settings">
                                    <span className="title">Subtask Timeout</span>
                                    <input ref="subtaskTimeout" type="text" placeholder="4:10:00" aria-label="Deadline" onChange={this._handleFormInputs.bind(this, 'subtask_timeout')} required={!showBackOption} disabled={showBackOption}/>
                                </div>
                                {!showBackOption && <div className="item-settings item__preset-button">
                                    <button className="btn--outline" onClick={::this._handleSavePresetModal}>Save as preset</button>
                                </div> }
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
                                    <input ref="bidRef" type="number" min="0" step="0.000001" aria-label="Your bid" onChange={this._handleFormInputs.bind(this, 'bid')} required={!showBackOption} disabled={showBackOption}/>
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
