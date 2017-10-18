import React from 'react';
import { Link, hashHistory } from 'react-router'
import TimeSelection from 'timepoint-selection'
const {clipboard} = window.require('electron')
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

import PresetModal from './modal/PresetModal'
import ManagePresetModal from './modal/ManagePresetModal'
import Dropdown from './../Dropdown'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {remote} = window.require('electron');
const {dialog} = remote
const {getConfig, dictConfig} = remote.getGlobal('configStorage')

import * as Actions from './../../actions'

const editMode = "settings"
const taskType = Object.freeze({
    BLENDER: 'Blender',
    LUXRENDER: 'LuxRender'
})

const testStatusDict = Object.freeze({
    STARTED: 'Started',
    SUCCESS: 'Success',
    ERROR: 'Error'
})

const mockFormatList = [
    {
        name: 'PNG'
    },
    {
        name: 'EXR'
    }
]

/*############# HELPER FUNCTIONS ############# */

function getTimeAsFloat(time) {
    let result = 0;
    time = time.split(':')
    result += Number(time[0]) * 3600
    result += Number(time[1]) * 60
    result += Number(time[2])
    return result / 3600
}

function floatToString(timeFloat) {
    let time = timeFloat * 3600;
    let date = new Date(1970, 0, 1); //time travel :)
    let startDay = date.getDate()
    date.setSeconds(time);

    let endDay = date.getDate()
    let day = endDay - startDay
    let hours = date.getHours() + (day * 24)
    return hours +':'+ date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

const mapStateToProps = state => ({
    task: state.create.task,
    taskInfo: state.details.detail,
    presets: state.details.presets,
    testStatus: state.details.test_status,
    estimated_cost: state.details.estimated_cost,
    location: state.fileLocation.location,
    subtasksList: state.single.subtasksList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class TaskDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalData: null,
            isDetailPage: props.params.id != "settings", //<-- HARDCODED
            presetModal: false,
            //INPUTS
            compositing: false,
            resolution: [100, 100],
            frames: '',
            format: '',
            formatIndex: 0,
            output_path: props.location,
            sample_per_pixel: '',
            timeout: '',
            subtasks: 0,
            subtask_timeout: '',
            bid: 0,
            presetList: [],
            managePresetModal: false,
            savePresetLock: true,
            isDataCopied: false
        }
    }

    componentDidMount() {
        const {params, actions, task, presets, location} = this.props
        actions.setEstimatedCost(0)
        if (params.id != editMode) {
            actions.getTaskDetails(params.id)
            this.isDeveloperMode = getConfig(dictConfig.DEVELOPER_MODE);
            this.liveSubList = this.isDeveloperMode && setInterval(()=>{
                actions.fetchSubtasksList(params.id)
            }, 1000)
        } else {
            actions.getTaskPresets(task.type)
        }


        if (document.addEventListener) {
            document.addEventListener('invalid', (e) => {
                e.target.classList.add("invalid");
            }, true);
        }

        if (!!this.refs.taskTimeout && !!this.refs.subtaskTimeout) {
            this._setTimeStamp()
        }

        if (!this.state.isDetailPage) {
            this.refs.outputPath.value = location
            this._handleLocalRender()
        }
    }

    componentWillUnmount() {
        if (!this._nextStep) {
            this.props.actions.clearTaskPlain()
            this.liveSubList && clearInterval(this.liveSubList);
            this.copyTimeout && clearTimeout(this.copyTimeout);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.taskInfo).length > 0 && nextProps.params.id != editMode) {
            if (!!this.taskTimeoutInput && !!this.subtaskTaskTimeoutInput) {
                this._setTimeStamp()
            }
            this.setState({
                type: nextProps.taskInfo.type
            }, () => {

                const {type, timeout, subtasks, subtask_timeout, options, bid} = nextProps.taskInfo
                const {resolutionW, resolutionH, formatRef, outputPath, compositingRef, haltspp, taskTimeout, subtaskCount, subtaskTimeout, bidRef} = this.refs
                this.taskTimeoutInput.setValue((getTimeAsFloat(timeout) * 3600) || 0)
                subtaskCount.value = subtasks || 0
                this.subtaskTaskTimeoutInput.setValue((getTimeAsFloat(subtask_timeout) * 3600) || 0)
                bidRef.value = bid || 0
                if (options) {
                    resolutionW.value = options.resolution[0]
                    resolutionH.value = options.resolution[1]
                    outputPath.value = options.output_path
                    let formatIndex = mockFormatList.map(item => item.name).indexOf(options.format)
                    this.setState({
                        formatIndex,
                    })

                    if ((nextProps.task.type || this.state.type) === taskType.BLENDER) {
                        compositingRef.checked = options.compositing
                        this.setState({
                            compositing: options.compositing
                        })
                        this.refs.framesRef.value = options.frames ? options.frames : 1
                    } else if ((nextProps.task.type || this.state.type) === taskType.LUXRENDER) {
                        haltspp.value = options.haltspp
                    }

                    this.props.actions.getEstimatedCost({
                        type: nextProps.taskInfo.type,
                        options: {
                            price: Number(bid),
                            num_subtasks: Number(subtasks),
                            subtask_time: getTimeAsFloat(subtask_timeout)
                        }
                    })

                }

            })
        }

        if (nextProps.presets != this.props.presets) {
            this.parsePresets(nextProps.presets)
        }

    }

    componentWillUpdate(nextProps, nextState) {
        const {subtasks, subtask_timeout, bid} = this.state
        const {actions, task} = this.props

        if ((!!nextState.subtasks && !!nextState.subtask_timeout && !!nextState.bid) && (nextState.subtasks !== subtasks || nextState.subtask_timeout !== subtask_timeout || nextState.bid !== bid)) {
            actions.getEstimatedCost({
                type: task.type,
                options: {
                    price: Number(nextState.bid),
                    num_subtasks: Number(nextState.subtasks),
                    subtask_time: nextState.subtask_timeout
                }
            })
        }

        if (nextState.resolution[0] !== this.state.resolution[0] || nextState.resolution[1] !== this.state.resolution[1] || nextState.frames !== this.state.frames || nextState.sample_per_pixel !== this.state.sample_per_pixel) {
            this.setState({
                savePresetLock: this.isPresetFieldsFilled(nextState)
            })
        }
    }

    _convertPriceAsHR(price) {
        let priceLength = parseInt(price).toString().length
        if (priceLength < 5) {
            return <span className="estimated-price">{price.toFixed(2)}</span>
        }
        let firstDigit = parseInt(price) / (10 ** (priceLength - 1))
        let firstDigitLength = firstDigit.toString().length
        return <span className="estimated-price">{firstDigitLength > 3 ? "~" + firstDigit.toFixed(2) : firstDigit}<small>x</small>10<sup>{priceLength - 1}</sup></span>
    }

    _setTimeStamp() {
        const options = Object.freeze({
            'durationFormat': 'dd:hh:mm:ss',
            'max': 60 * 60 * 24 * 2,
            'value': 0, // initial value of input in seconds.
            'useAbbr': true, // configure the separator to not be ':'
            'abbr': { // pass in custom separator (with trailing space if desired)
                'dd': 'days ',
                'hh': 'h ',
                'mm': 'm ',
                'ss': 's'
            }
        })
        this.taskTimeoutInput = TimeSelection(this.refs.taskTimeout, options);
        this.subtaskTaskTimeoutInput = TimeSelection(this.refs.subtaskTimeout, options);
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
     * [checkInputValidity func. checks if given input valid]
     * @param  {Event}  e
     */
    checkInputValidity(e) {
        e.target.checkValidity();
        if (e.target.validity.valid)
            e.target.classList.remove("invalid");
        return e.target.validity.valid
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
     * [_handleTimeoutInputs func. updtes timeout values form inputs]
     * @param  {[type]} state [Name of the state]
     * @param  {[type]} e     
     */
    _handleTimeoutInputs(state, e) {

        const timeoutList = Object.freeze({
            'timeout': this.taskTimeoutInput,
            'subtask_timeout': this.subtaskTaskTimeoutInput
        })

        this.checkInputValidity(e)
        this.setState({
            [state]: Number(timeoutList[state].getValue()) / 3600
        })
    }

    /**
     * [_handleFormInputs func. updtes all the rest form inputs]
     * @param  {Any}    state   [Name of the state]
     * @param  {Event}  e
     */
    _handleFormInputs(state, e) {
        if(this.checkInputValidity(e))
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
            const {compositing, format, frames, output_path, resolution, sample_per_pixel} = values.value
            const {resolutionW, resolutionH, framesRef, formatRef, outputPath, compositingRef, haltspp} = this.refs
            resolutionW.value = resolution[0]
            resolutionH.value = resolution[1]
            formatRef.value = format
            outputPath.value = output_path
            let formatIndex = mockFormatList.map(item => item.name).indexOf(format)

            if (this.props.task.type === taskType.BLENDER) {

                framesRef.value = frames
                compositingRef.checked = compositing

            } else if (this.props.task.type === taskType.LUXRENDER) {

                haltspp.value = sample_per_pixel

            }

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
        const {resolution, frames, format, output_path, compositing, sample_per_pixel} = this.state
        this.setState({
            presetModal: true,
            modalData: {
                resolution,
                frames,
                format,
                output_path,
                sample_per_pixel,
                compositing,
                task_type: this.props.task.type
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
            managePresetModal: false
        })
    }

    /**
     * [_handleOutputPath func. opens file chooser dialog and updates output path of that task]
     */
    _handleOutputPath() {
        let onFolderHandler = data => {
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
            timeout: floatToString(timeout),
            subtasks,
            subtask_timeout: floatToString(subtask_timeout),
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
            hashHistory.push('/tasks');
        }, 1000);
    }

    _handleLocalRender() {
        const {actions, task} = this.props;
        const {resources, type} = task
        actions.runTestTask({
            resources,
            type,
            subtasks: 1 // <--- HARDCODED
        })
    }

    /**
    * [_handleManagePresetModal func. will trigger managePresetModal state to make manage preset modal visible]
    */
    _handleManagePresetModal() {
        this.setState({
            managePresetModal: true
        })
    }

    _handleTestStatus({status, error}) {
        switch (status) {
        case testStatusDict.STARTED:
            return {
                class: 'btn--loading',
                text: 'Rendering',
                locked: true
            }

        case testStatusDict.SUCCESS:
            return {
                class: 'btn--success',
                text: 'Success!',
                locked: false
            }

        case testStatusDict.ERROR:
            return {
                class: 'btn--error',
                text: 'Error',
                locked: true
            }

        default:
            return {
                class: '',
                text: 'Render Local Test',
                locked: true
            }
        }
    }

    _handleCopyToClipboard(data, evt) {
        if (data) {
            clipboard.writeText(data)
            this.setState({
                isDataCopied: true
            }, () => {
                this.copyTimeout = setTimeout(() => {
                    this.setState({
                        isDataCopied: false
                    })
                }, 3000)
            })
        }
    }

    _fillNodeInfo(data){
        const {isDataCopied} = this.state
        function statusDot(status){
            switch(status){
                case 'Starting':
                return 'icon-status-dot--progress'

                case 'Finished':
                return 'icon-status-dot--done'

                case 'Downloading':
                return 'icon-status-dot--download'

                case 'Failure':
                return 'icon-status-dot--warning'
            }
        }

        return data.map(({subtask_id, status, node_name, node_ip_address}, index) => <tr key={index.toString()}>
                <td>
                <ReactTooltip placement="bottomLeft" trigger={['hover']} overlay={<p>{isDataCopied ? 'Copied Succesfully!' : 'Click to copy'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <div className="clipboard-subtask-id" onClick={this._handleCopyToClipboard.bind(this, subtask_id)}>
                            <span>{subtask_id}</span>
                        </div>
                    </ReactTooltip>
                </td>
                <td>
                    <ReactTooltip placement="bottom" trigger={['hover']} overlay={<p>{status}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className={`icon-status-dot ${statusDot(status)}`}/>
                    </ReactTooltip>
                </td>
                <td>
                    <ReactTooltip placement="bottomRight" trigger={['hover']} overlay={<p>{isDataCopied ? 'Copied Succesfully!' : 'Click to copy IP Address'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span onClick={this._handleCopyToClipboard.bind(this, node_ip_address)}>{node_name || 'Anonymous node'}</span>
                    </ReactTooltip>
                </td>
            </tr>)
    }

    isPresetFieldsFilled(nextState) {
        const {resolution, frames, sample_per_pixel} = nextState

        if (this.props.task.type === taskType.BLENDER) {
            return !resolution[0] || !resolution[1] || !frames
        } else {
            return !resolution[0] || !resolution[1] || !sample_per_pixel
        }
    }

    _handleFormByType(type, isDetail) {
        const {modalData, isDetailPage, presetModal, resolution, frames, formatIndex, output_path, timeout, subtasks, subtask_timeout, bid, compositing, presetList, managePresetModal, savePresetLock} = this.state
        const {testStatus, estimated_cost} = this.props;
        let formTemplate = [
            {
                order: 0,
                detailContent: false,
                content: <div className="item-settings" key="0">
                            <span className="title">Preset</span>
                            <Dropdown list={presetList} handleChange={this._handlePresetOptionChange.bind(this, presetList)} disabled={isDetailPage} manageHandler={::this._handleManagePresetModal}  presetManager/> 
                        </div>
            },
            {
                order: 1,
                content: <div className="item-settings" key="1">
                                <span className="title">Dimensions</span>
                                <input ref="resolutionW" type="number" min="100" max="8000" aria-label="Dimension (width)" onChange={this._handleResolution.bind(this, 0)} required={!isDetailPage} disabled={isDetailPage}/>
                                <span className="icon-cross"/>
                                <input ref="resolutionH" type="number" min="100" max="8000" aria-label="Dimension (height)" onChange={this._handleResolution.bind(this, 1)} required={!isDetailPage} disabled={isDetailPage}/>
                            </div>
            },
            {
                order: 3,
                content: <div className="item-settings" key="3">
                                <span className="title">Format</span>
                                <Dropdown ref="formatRef" list={mockFormatList} selected={formatIndex} handleChange={this._handleFormatOptionChange.bind(this, mockFormatList)} disabled={isDetailPage}/> 
                         </div>
            },
            {
                order: 4,
                content: <div className="item-settings" key="4">
                                <span className="title">Output to</span>
                                <input ref="outputPath" type="text" placeholder="…Docs/Golem/Output" aria-label="Output path" disabled/>
                                <button type="button" className="btn--outline" onClick={::this._handleOutputPath} disabled={isDetailPage}>Change</button>
                          </div>
            },
            {
                order: 6,
                detailContent: false,
                content: <div className="item-settings item__preset-button" key="6">
                                <button type="button" className="btn--outline" onClick={::this._handleSavePresetModal} disabled={savePresetLock}>Save as preset</button>
                            </div>
            },
            {
                order: 7,
                content: <div className="item-settings" key="7">
                                <span className="title">Task Timeout</span>
                                <input ref="taskTimeout" type="text" aria-label="Task Timeout" onKeyDown={this._handleTimeoutInputs.bind(this, 'timeout')} required={!isDetailPage} disabled={isDetailPage}/>
                            </div>
            },
            {
                order: 8,
                content: <div className="item-settings" key="8">
                                <span className="title">Subtask Amount</span>
                                <input ref="subtaskCount" type="number" min="1" max="100" placeholder="8" aria-label="Subtask amount" onChange={this._handleFormInputs.bind(this, 'subtasks')} required={!isDetailPage} disabled={isDetailPage}/>
                            </div>
            },
            {
                order: 9,
                content: <div className="item-settings" key="9">
                                <span className="title">Subtask Timeout</span>
                                <input ref="subtaskTimeout" type="text" aria-label="Deadline" onKeyDown={this._handleTimeoutInputs.bind(this, 'subtask_timeout')} required={!isDetailPage} disabled={isDetailPage}/>
                            </div>
            }
        ]

        switch (type) {
        case taskType.BLENDER:
            formTemplate.push({
                order: 2,
                content: <div className="item-settings" key="2">
                            <span className="title">Frame Range</span>
                            <input ref="framesRef" type="text" aria-label="Frame Range" pattern="^[0-9]?(([0-9\s;,-]*)[0-9])$" onChange={this._handleFormInputs.bind(this, 'frames')} required={!isDetailPage} disabled={isDetailPage}/>
                         </div>
            })
            formTemplate.push({
                order: 5,
                content: <div className="item-settings" key="5">
                            <span className="title">Blender Compositing</span>
                            <div className="switch-box switch-box--green">
                                <span>{compositing ? 'On' : 'Off'}</span>
                                <label className="switch">
                                    <input ref="compositingRef" type="checkbox" aria-label="Blender Compositing Checkbox" tabIndex="0" onChange={this._handleCheckbox.bind(this)} disabled={isDetailPage}/>
                                    <div className="switch-slider round"></div>
                                </label>
                            </div>
                        </div>
            })
            break;
        case taskType.LUXRENDER:
            formTemplate.push({
                order: 5,
                content: <div className="item-settings" key="5">
                            <span className="title">Sample per pixel</span>
                            <input ref="haltspp" type="text" placeholder="1" min="1" max="2000" aria-label="Sample per pixel" onChange={this._handleFormInputs.bind(this, 'sample_per_pixel')} required={!isDetailPage} disabled={isDetailPage}/>
                         </div>
            })
            break;
        }

        let sortByOrder = (a, b) => (a.order - b.order)

        return formTemplate
            .sort(sortByOrder)
            .filter(item => item.detailContent === undefined || item.detailContent === isDetail)
            .map(item => item.content)
    }

    render() {
        const {modalData, isDetailPage, presetModal, bid, managePresetModal} = this.state
        const {testStatus, estimated_cost, subtasksList} = this.props;
        let testStyle = this._handleTestStatus(testStatus)
        return (
            <div>       
                <form onSubmit={::this._handleStartTaskButton} className="content__task-detail">
                    <section className={`section-preview__task-detail ${(testStatus.more && testStatus.more.after_test_data.warnings) ? 'warning' : ''}`}>
                        { isDetailPage && <div className="panel-preview__task-detail">
                            <Link to="/tasks" aria-label="Back button to task list">
                                <span className="icon-arrow-left-white"/>
                                <span>Back</span>
                            </Link>
                        </div>}
                        {(!isDetailPage && testStatus.more) && <span className="warning__render-test">{testStatus.more['after_test_data']['warnings']}</span>}
                        {!isDetailPage && <button type="button" className={`btn--outline ${testStyle.class}`}>{testStyle.text} {testStatus.status === testStatusDict.STARTED && <span className="jumping-dots">
                            <span className="dot-1">.</span>
                            <span className="dot-2">.</span>
                            <span className="dot-3">.</span>
                        </span>}</button>}
                    </section>

                    <section className="container__task-detail">
                        { this.isDeveloperMode &&
                        <div className="section-node-list__task-detail">
                            <h4 className="experiment">Dev mode</h4>
                            <table>
                                <thead>
                                    <tr>
                                      <th>Subtask</th>
                                      <th>State</th>
                                      <th>Node</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {::this._fillNodeInfo(subtasksList)}
                                </tbody>
                            </table>
                        </div>
                        }
                        <div className="section-settings__task-detail">
                                <h4>Settings</h4>
                                {this._handleFormByType(this.state.type || this.props.task.type, isDetailPage)}
                        </div>
                        <div className="section-price__task-detail">
                            <h4 className="title-price__task-detail">Price</h4>
                            <div className="item-price estimated-price__panel">
                                <span className="title">Estimated</span>
                                {this._convertPriceAsHR(estimated_cost)}
                                <span>GNT</span>
                            </div>
                            <div className="item-price">
                                <span className="title">Your bid</span>
                                <input ref="bidRef" type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="0.000001" aria-label="Your bid" onChange={this._handleFormInputs.bind(this, 'bid')} required={!isDetailPage} disabled={isDetailPage}/>
                                <span>GNT/h</span>
                            </div>
                            <span className="item-price tips__price">
                                You can accept the estimated price or you can bid higher if you would like to increase your chances of quicker processing.
                            </span>  
                        </div>
                    </section>

                    {!isDetailPage && <section className="section-action__task-detail">
                        <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                            <span >Cancel</span>
                        </Link>
                        <button type="submit" className="btn--primary" disabled={testStyle.locked}>Start Task</button>
                    </section>}
                </form>
                {presetModal && <PresetModal closeModal={::this._closeModal} saveCallback={::this._handlePresetSave} {...modalData}/>}
                {managePresetModal && <ManagePresetModal closeModal={::this._closeModal}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail)
