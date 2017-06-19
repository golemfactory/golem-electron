import React from 'react';
import { Link, browserHistory } from 'react-router'
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
    taskInfo: state.details.detail,
    presets: state.details.presets
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class TaskDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalData: null,
            showBackOption: props.params.id != "settings", //<-- HARDCODED
            presetModal: false,
            //INPUTS
            compositing: false,
            resolution: [0, 0],
            frames: '',
            showFrames: this.checkIfTaskBlender(props.task.type),
            format: '',
            formatIndex: 0,
            output_path: '',
            timeout: '',
            subtasks: 0,
            subtask_timeout: '',
            bid: 0,
            presetList: []
        }
    }

    componentDidMount() {
        const {params, actions, task, presets} = this.props
        if (params.id != "settings") {
            actions.getTaskDetails(params.id)
        } else {
            actions.getTaskPresets(task.type)
        }


        if (document.addEventListener) {
            document.addEventListener('invalid', function(e) {
                e.target.classList.add("invalid");
            }, true);
        }
    }

    componentWillUnmount() {
        if (!this._nextStep) {
            this.props.actions.clearTaskPlain()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.taskInfo && nextProps.params.id != "settings") {
            const {type, timeout, subtasks, subtask_timeout, options, bid} = nextProps.taskInfo
            const {resolutionW, resolutionH, formatRef, outputPath, compositingRef, taskTimeout, subtaskCount, subtaskTimeout, bidRef} = this.refs
            resolutionW.value = options.resolution[0]
            resolutionH.value = options.resolution[1]
            outputPath.value = options.output_path
            compositingRef.checked = options.compositing
            taskTimeout.value = timeout
            subtaskCount.value = subtasks
            subtaskTimeout.value = subtask_timeout
            bidRef.value = bid
            let formatIndex = mockFormatList.map(item => item.name).indexOf(options.format)
            this.setState({
                formatIndex,
                compositing: options.compositing
            })
            if (this.state.showFrames || this.checkIfTaskBlender(type)) {
                this.setState({
                    showFrames: this.checkIfTaskBlender(type)
                }, () => {
                    this.refs.framesRef.value = options.frames ? options.frames : 1
                })

            }
        }

        if (nextProps.presets != this.props.presets) {
            this.parsePresets(nextProps.presets)
        }

    }

    /**
     * [parsePresets parses preset object from redux store to the array as state]
     * @param  {Object}     presets     [Task preset object]
     */
    parsePresets(presets) {
        let presetList = []
        Object.keys(presets).forEach(item => {
            presetList.push({
                name: item,
                value: presets[item]
            })
        })
        this.setState({
            presetList
        })
    }

    /**
     * [checkIfTaskBlender func. check task type if Blender task type]
     * @param  {string}     type    [Type of task item]
     * @return {Boolean}
     */
    checkIfTaskBlender(type) {
        return type === "Blender"
    }

    /**
     * [checkInputValidity func. checks if given input valid]
     * @param  {Event}  e
     */
    checkInputValidity(e) {
        e.target.checkValidity();
        if (e.target.validity.valid)
            e.target.classList.remove("invalid");
    }

    /**
     * [_handleResolution func. updates resolution state with given input]
     * @param  {Number}     index   [Index of resolution list]
     * @param  {Event}      e
     */
    _handleResolution(index, e) {
        this.checkInputValidity(e)
        let res = this.state.resolution
        res[index] = parseInt(e.target.value)
        this.setState({
            resolution: res
        })
    }

    /**
     * [_handleCheckbox func. updates checkbox value]
     * @param  {Event}  e
     */
    _handleCheckbox(e) {
        this.setState({
            compositing: e.target.checked
        })
    }

    /**
     * [_handleFormInputs func. updtes all the rest form inputs]
     * @param  {Any}    state   [Name of the state]
     * @param  {Event}  e
     */
    _handleFormInputs(state, e) {
        this.checkInputValidity(e)
        this.setState({
            [state]: e.target.value
        })
    }

    /**
     * [_handlePresetOptionChange func. updates task preset dropdown changes]
     * @param  {Array}      list    [List of the task presets]
     * @param  {String}     name    [Name of selected preset]
     */
    _handlePresetOptionChange(list, name) {
        let values = list.filter((item, index) => item.name == name)[0]
        if (values) {
            console.log("values", values);
            const {compositing, format, frames, output_path, resolution} = values.value
            const {resolutionW, resolutionH, framesRef, formatRef, outputPath, compositingRef} = this.refs
            resolutionW.value = resolution[0]
            resolutionH.value = resolution[1]
            framesRef.value = frames
            formatRef.value = format
            outputPath.value = output_path
            compositingRef.checked = compositing
            let formatIndex = mockFormatList.map(item => item.name).indexOf(format)
            this.setState({
                resolution,
                output_path,
                frames,
                format,
                formatIndex,
                compositing
            })
        }

    }

    /**
     * [_handleFormatOptionChange func.  updates format dropdown changes]
     * @param  {Array}      list    [List of formats]
     * @param  {String}     name    [Name of selected format]
     */
    _handleFormatOptionChange(list, name) {
        let values = list.filter((item, index) => item.name == name)[0]
        values && this.setState({
            format: values.name
        })
    }

    /**
     * [_handleSavePresetModal func. sends custom preset data to modal and makes modal visible]
     */
    _handleSavePresetModal() {
        const {resolution, frames, format, output_path, compositing} = this.state
        this.setState({
            presetModal: true,
            modalData: {
                resolution,
                frames,
                format,
                output_path,
                compositing
            }
        })
    }

    /**
     * [_handlePresetSave func.]
     * @param  {String} preset_name [Name of the custom preset]
     * @param  {Object} data        [Custom preset object]
     */
    _handlePresetSave(preset_name, data) {
        this.props.actions.saveTaskPreset({
            preset_name,
            task_type: this.props.task.type,
            data
        })
    }

    /**
     * [_closeModal func. closes all modals]
     */
    _closeModal() {
        this.setState({
            presetModal: false,
        })
    }

    /**
     * [_handleOutputPath func. opens file chooser dialog and updates output path of that task]
     */
    _handleOutputPath() {
        let onFolderHandler = data => {
            console.log(data)
            if (data) {
                this.setState({
                    output_path: data[0]
                }, () => {
                    this.refs.outputPath.value = data[0]
                })
            }
        }

        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, onFolderHandler)
    }

    /**
     * [_handleStartTaskButton func. creates task with given task information, then it redirects users to the tasks screen]
     */
    _handleStartTaskButton() {
        this._nextStep = true
        const {resolution, frames, format, output_path, timeout, subtasks, subtask_timeout, bid, compositing} = this.state
        const {task} = this.props
        this.props.actions.createTask({
            ...task,
            timeout,
            subtasks,
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
        setTimeout(() => {
            browserHistory.push('/tasks');
        }, 1000);
    }

    _handleLocalRender() {
        console.info('local sended')
        const {actions, task} = this.props;
        const {resources, type} = task
        actions.runTestTask({
            resources,
            type,
            subtasks: 1 // <--- HARDCODED
        })
    }

    render() {
        const {modalData, showBackOption, presetModal, resolution, frames, showFrames, formatIndex, output_path, timeout, subtasks, subtask_timeout, bid, compositing, presetList} = this.state
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
                        {!showBackOption && <button type="button" className="btn--outline" onClick={::this._handleLocalRender}>Render Local Test</button>}
                    </section>
                        <div className="container__task-detail">
                            <section className="section-settings__task-detail">
                                <h4>Settings</h4>
                                <div className="item-settings">
                                    <span className="title">Preset</span>
                                    <Dropdown list={presetList} handleChange={this._handlePresetOptionChange.bind(this, presetList)} disabled={showBackOption}/> 
                                </div>
                                <div className="item-settings">
                                    <span className="title">Dimensions</span>
                                    <input ref="resolutionW" type="number" min="0" aria-label="Dimension (width)" onChange={this._handleResolution.bind(this, 0)} required={!showBackOption} disabled={showBackOption}/>
                                    <span className="icon-cross"/>
                                    <input ref="resolutionH" type="number" min="0" aria-label="Dimension (height)" onChange={this._handleResolution.bind(this, 1)} required={!showBackOption} disabled={showBackOption}/>
                                </div>
                                { showFrames && <div className="item-settings">
                                    <span className="title">Frame Range</span>
                                    <input ref="framesRef" type="text" aria-label="Frame Range" pattern="^[0-9]?(([0-9\s;,-]*)[0-9])$" onChange={this._handleFormInputs.bind(this, 'frames')} required={!showBackOption} disabled={showBackOption}/>
                                </div>}
                                <div className="item-settings">
                                    <span className="title">Format</span>
                                    <Dropdown ref="formatRef" list={mockFormatList} selected={formatIndex} handleChange={this._handleFormatOptionChange.bind(this, mockFormatList)} disabled={showBackOption}/> 
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
                                            <input ref="compositingRef" type="checkbox" aria-label="Blender Compositing Checkbox" tabIndex="0" onChange={this._handleCheckbox.bind(this, 'compositing')} disabled={showBackOption}/>
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
                                    <input ref="subtaskCount" type="text" placeholder="8" aria-label="Subtask amount" onChange={this._handleFormInputs.bind(this, 'subtasks')} required={!showBackOption} disabled={showBackOption}/>
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
                        {presetModal && <PresetModal closeModal={::this._closeModal} saveCallback={::this._handlePresetSave} {...modalData}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail)
