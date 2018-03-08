import React from 'react';
import { Link, hashHistory } from 'react-router'
import TimeSelection from 'timepoint-selection'
const {clipboard, remote} = window.electron;
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'
import yup from 'yup'

import PresetModal from './modal/PresetModal'
import ManagePresetModal from './modal/ManagePresetModal'
import DefaultSettingsModal from './modal/DefaultSettingsModal'
import ResolutionChangeModal from './modal/ResolutionChangeModal'

import Dropdown from './../Dropdown'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const {dialog} = remote

import * as Actions from './../../actions'
import {once} from './../../utils/once'
import zipObject from './../../utils/zipObject'

const ETH_DENOM = 10 ** 18;
const TIME_VALIDITY_NOTE = "Time should be minimum 1 minute."

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

const presetSchema = {
    Blender: yup.object().shape({
            resolution: yup.array().of(yup.number().min(100).max(8000)).required(),
            frames: yup.string().required(),
            format: yup.string(),
            output_path: yup.string(),
            compositing: yup.bool()
        }),
    LuxRender: yup.object().shape({
            resolution: yup.array().of(yup.number().min(100).max(8000)).required(),
            output_path: yup.string(),
            format: yup.string(),
            sample_per_pixel: yup.number().min(1).required(),
        })
}

const hints = {
    frame: [
        "Hint: To use consecutive frames, e.g. \"1-6\".",
        "Hint: To pick random frames, e.g. \"2;6;7\".",
        "Hint: To use common diff. e.g. \"1-7,2\"."
    ]
}

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

function calcFrameAmount(_frame){
    const notationArry = _frame.match(/(\d+)(-)?(\d+)?(;\d)?/g)
    const calculateNotation = item => {

        if (!isNaN(item))
            return 1
        
        if (item.includes(";")) {
            [item, diff] = item.split(";");
        }
      
        const splitItem = item.split("-")
        return Math.floor((Math.max(...splitItem) - Math.min(...splitItem)) / diff) + 1
    }

    let diff = 1;

    return notationArry
        .map(calculateNotation)
        .reduce((total, amount) => total += amount)
}

function isObjectEmpty(obj) {
    if(obj !== null && typeof obj === 'object'){
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }
    return true
}

const mapStateToProps = state => ({
    task: state.create.task,
    taskInfo: state.details.detail,
    presets: state.details.presets,
    testStatus: state.details.test_status,
    estimated_cost: state.details.estimated_cost,
    location: state.fileLocation.location,
    subtasksList: state.single.subtasksList,
    isDeveloperMode: state.input.developerMode,
    requestorMaxPrice: state.price.requestorMaxPrice
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class TaskDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDefaultResolutionApplied: false,
            modalData: null,
            isDetailPage: props.params.id !== "settings", //<-- HARDCODED
            //INPUTS
            compositing: false,
            resolution: [NaN,NaN],
            frames: '',
            format: '',
            formatIndex: 0,
            output_path: props.location,
            sample_per_pixel: 0,
            timeout: '',
            subtasks: 1,
            maxSubtasks: 0,
            subtask_timeout: '',
            bid: props.requestorMaxPrice / ETH_DENOM,
            presetList: [],
            savePresetLock: true,
            isDataCopied: false,
            presetModal: false,
            managePresetModal: false,
            defaultSettingsModal: false,
            resolutionChangeModal: false,
            resolutionChangeInfo: []
        }

    }

    componentDidMount() {
        const {params, actions, task, presets, location, isDeveloperMode, requestorMaxPrice} = this.props

        actions.setEstimatedCost(0)
        if (params.id !== editMode) {
            actions.getTaskDetails(params.id)
        } else {
            actions.getTaskPresets(task.type)
            this.refs.bidRef.value = requestorMaxPrice / ETH_DENOM
        }

        if (!!this.refs.taskTimeout && !!this.refs.subtaskTimeout) {
            this._setTimeStamp()
        }

        if (!this.state.isDetailPage) {
            this.refs.outputPath.value = location
            this._handleLocalRender()
        }

        this.frameHintNum = Math.floor(Math.random()* hints.frame.length)

        var elements = document.getElementsByTagName("input")
        var ariaKeys = Array.from(elements).map(elm => elm.getAttribute("aria-label"));
        this.interactedInputObject = zipObject(ariaKeys, new Array(ariaKeys.length).fill(false));

        if(params.id === editMode)
            document.getElementById("taskFormSubmit").addEventListener("click", ()=>{
                Object.keys(this.interactedInputObject).map(keys => this.interactedInputObject[keys] = true)
            })
    }

    componentWillUnmount() {
        this.props.actions.clearTaskPlain()
        this.liveSubList && clearInterval(this.liveSubList);
        this.copyTimeout && clearTimeout(this.copyTimeout);
        this.interactedInputObject = {}
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.taskInfo).length > 0 && nextProps.params.id !== editMode) {
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

        if (nextProps.presets !== this.props.presets) {
            this.parsePresets(nextProps.presets)
        }

        if(nextProps.testStatus !== this.props.testStatus && 
                !isObjectEmpty(nextProps.testStatus.more) && 
                !this.state.defaultSettingsModal)
        {
            this.setState({
                defaultSettingsModal: true
            })
        }

    }

    componentWillUpdate(nextProps, nextState) {
        const {subtasks, subtask_timeout, bid, isDetailPage, savePresetLock, resolution, maxSubtasks, frames, sample_per_pixel} = this.state
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

        if(nextProps.isDeveloperMode && !this.liveSubList && isDetailPage){

            let interval = ()=> {
                actions.fetchSubtasksList(nextProps.params.id)
                return interval
            }
            this.liveSubList = setInterval(interval(), 1000)

        } else if(!nextProps.isDeveloperMode && this.liveSubList && isDetailPage) {

            clearInterval(this.liveSubList)
            this.liveSubList = false;
            
        }

        if(nextState.resolution !== resolution){
            this.isPresetFieldsFilled(nextState).then(this.changePresetLock);
            this._calcMaxSubtaskAmount.call(this, nextState);
        }

        if(nextState.maxSubtasks !== maxSubtasks || nextState.subtasks !== subtasks){
            const result = Math.min(nextState.maxSubtasks, nextState.subtasks);
            this.refs.subtaskCount.value = result ? result : 1 // subtask cannot be 0
        }

        if(nextState.frames !== frames || nextState.sample_per_pixel !== sample_per_pixel){
            this.isPresetFieldsFilled(nextState).then(this.changePresetLock);
            this._calcMaxSubtaskAmount.call(this, nextState);
        }

        var elements = document.getElementsByTagName("input")
        Array.from(elements).forEach(element => {
            element.checkValidity();
            if (element.validity.valid)
                element.classList.remove("invalid");
            return element.validity.valid
        })

        once(this._activateValidation())
    }

    _activateValidation(){
        if (document.addEventListener) {
            document.addEventListener('invalid', e => {
                if(this.interactedInputObject[e.target.getAttribute("aria-label")])
                    e.target.classList.add("invalid")
            }, true);
        }
    }

    /**
     * [calcMaxSubtaskAmount function calculates maximum possible subtask amount for the given  task parameters]
     * @param  {Number}     y       [y axis of the resolution]
     * @param  {String}     frame   [frame pattern of the task]
     * @return {Number}             [maximum subtask amount]
     */
    _calcMaxSubtaskAmount(nextState){
        const {resolution, frames} = nextState
        const y = resolution[1];
        let maxSubtasks;

        if(!y)
                return; 

        if (this.props.task.type === taskType.BLENDER) {
            if(!frames)
                return; 

            const frameAmount = calcFrameAmount(frames);
            maxSubtasks = Math.floor(y / Math.max((y / 100) * 3, 8 + ((y / 100) * 2))) * frameAmount;
            
        } else {
            maxSubtasks = 100 
        }

        const subtaskValue = Math.min(maxSubtasks, this.state.subtasks)

        this.setState({
                maxSubtasks,
                subtasks: subtaskValue
            })

        this.refs.subtaskCount.value = subtaskValue
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
        this.refs.taskTimeout.setCustomValidity(TIME_VALIDITY_NOTE);
        this.subtaskTaskTimeoutInput = TimeSelection(this.refs.subtaskTimeout, options);
        this.refs.subtaskTimeout.setCustomValidity(TIME_VALIDITY_NOTE);
        this.refs.subtaskTimeout.disabled = true;
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
     * [changePresetLock func. enables\disables save preset button]
     * @param  {boolean} result [form validity result]
     */
    changePresetLock = (result) => {
        this.setState({
            savePresetLock: !result
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
        this.interactedInputObject[e.target.getAttribute("aria-label")] = true;
        let res = this.state.resolution
        let newRes = [...res]; //keep state immutable
        newRes[index] = parseInt(e.target.value);
        this.setState({
            resolution: newRes
        })
    }

    /**
     * [_handleCheckbox func. updates checkbox value]
     * @param  {Event}  e
     */
    _handleCheckbox(e) {
        this.interactedInputObject[e.target.getAttribute("aria-label")] = true;
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
        this.interactedInputObject[e.target.getAttribute("aria-label")] = true;
        const timeoutList = Object.freeze({
            'timeout': this.taskTimeoutInput,
            'subtask_timeout': this.subtaskTaskTimeoutInput
        })

        /*Input will be invalid if given time is lesser than 1 min*/
        const inputTime = e.target.classList
        if(timeoutList[state].getValue() < 60){
            inputTime.add("invalid");
            e.target.setCustomValidity(TIME_VALIDITY_NOTE);
        } else {
            inputTime.remove("invalid");
            e.target.setCustomValidity("");
        }

        if(state === 'timeout'){
            const taskTimeoutValue = this.taskTimeoutInput.getValue()
            const subtaskTimeoutValue = this.subtaskTaskTimeoutInput.getValue()

            if(subtaskTimeoutValue > taskTimeoutValue){
                this.subtaskTaskTimeoutInput.setValue(taskTimeoutValue)
            }

            this.subtaskTaskTimeoutInput.max = taskTimeoutValue + 1 // including value itself
            this.refs.subtaskTimeout.disabled = !(taskTimeoutValue > 0);
        }
        
        this.setState({
            [state]: timeoutList[state].getValue() / 3600
        })
    }

    /**
     * [_handleFormInputs func. updtes all the rest form inputs]
     * @param  {Any}    state   [Name of the state]
     * @param  {Event}  e
     */
    _handleFormInputs(state, e) {
        this.interactedInputObject[e.target.getAttribute("aria-label")] = true;
        if(this.checkInputValidity(e)){
            this.setState({
                [state]: e.target.value
            })
        } else if(!this.state.savePresetLock && 
                    (state === "frames" || state === "sample_per_pixel") && 
                    !this.checkInputValidity(e)){
            this.setState({
                [state]: null,
                savePresetLock: true
            })
        }
        
    }

    /**
     * [_handlePresetOptionChange func. updates task preset dropdown changes]
     * @param  {Array}      list    [List of the task presets]
     * @param  {String}     name    [Name of selected preset]
     */
    _handlePresetOptionChange(list, name) {

        const result = list.filter((item, index) => item.name == name)[0]
        const preset = {...result, value: {...result.value}} // immutable

        if (!preset)
            return;

        const {resolution} = preset.value
        const {resolutionW, resolutionH} = this.refs
        if(this.state.isDefaultResolutionApplied && !this._isArrayEqual([resolutionW.value, resolutionH.value], resolution))
            this._askForNewResolutionChange(preset)
        else
            this._applyPresetOption(preset, true, false)
    }

    _askForNewResolutionChange(preset){
        this.setState({
            resolutionChangeModal: true,
            resolutionChangeInfo: preset
        })
    }

    _isArrayEqual(arr1, arr2){
        return arr1.toString() === arr2.toString() //String representation hack
    }

    _applyPresetOption(preset, isResolutionIncluded = true, applyStates = true){

        const {compositing, format, frames, output_path, resolution, sample_per_pixel} = preset.value
        const {resolutionW, resolutionH, framesRef, formatRef, outputPath, compositingRef, haltspp} = this.refs
        
        if(isResolutionIncluded){
            resolutionW.value = resolution[0];
            resolutionH.value = resolution[1];

            if(applyStates)
                this.setState({
                    isDefaultResolutionApplied: false,
                    resolutionChangeInfo: []
                })

        } else {
            delete preset.value.resolution
        }

        formatRef.value = format
        outputPath.value = output_path
        let formatIndex = mockFormatList.map(item => item.name).indexOf(format)

        if (this.props.task.type === taskType.BLENDER) {

            framesRef.value = frames
            compositingRef.checked = compositing

        } else if (this.props.task.type === taskType.LUXRENDER) {

            haltspp.value = sample_per_pixel

        }
        this.setState({...preset.value, formatIndex})
    }

    /**
     * [_handleFormatOptionChange func.  updates format dropdown changes]
     * @param  {Array}      list    [List of formats]
     * @param  {String}     name    [Name of selected format]
     */
    _handleFormatOptionChange(list, formatName, index) {
        let {name} = list.filter((item, index) => item.name === formatName)[0];
        name && this.setState({
            format: name,
            formatIndex: index
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

    _applyDefaultPreset(){
        const {resolution, file_format} = this.props.testStatus.more.after_test_data
        const {resolutionW, resolutionH, formatRef} = this.refs
        let format = file_format.replace(".", "").toUpperCase()
        let formatIndex = mockFormatList.map(item => item.name).indexOf(format)

        resolutionW.value = resolution[0]
        resolutionH.value = resolution[1]
        formatRef.value = format

        this.setState({
            resolution,
            format,
            formatIndex,
            isDefaultResolutionApplied: true
        })

        this._closeModal()
    }

    /**
     * [_closeModal func. closes all modals]
     */
    _closeModal() {
        this.setState({
            presetModal: false,
            managePresetModal: false,
            defaultSettingsModal: false,
            resolutionChangeModal: false
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
    _handleStartTaskButton = once(() => {

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
    })

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

    _handleTestStatus({status, error, more}) {
        switch (status) {
        case testStatusDict.STARTED:
            return {
                class: 'btn--loading',
                text: 'Checking',
                locked: true
            }

        case testStatusDict.SUCCESS:
            return {
                class: 'btn--success',
                text: 'Test passed!',
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

    _checkTestStatus(_testStatus){
        const {more, error} = _testStatus
        let status;
        if(!isObjectEmpty(more)){
            if(more.after_test_data.hasOwnProperty("warnings")){
                status = "warning"
            }
        }

        if(!isObjectEmpty(error)){
            if(error.length > 0 && typeof error[0] === 'string'){
                status = "error"
            }
        }

        return status
    }

    _getPanelClass(testStatus){
        return this._checkTestStatus(testStatus)
    }

    _getPanelInfo(testStatus){
        const {more, error} = testStatus
        const status = this._checkTestStatus(testStatus)
        let warningInfo; 

        switch(status){
            case "warning":
                warningInfo = more['after_test_data']['warnings']
                break;
            case "error":
                warningInfo = testStatus.error[0]
                break;
        }
        
        return <span className="warning__render-test">{warningInfo}</span>
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
                <ReactTooltip overlayClassName="black" placement="bottomLeft" trigger={['hover']} overlay={<p>{isDataCopied ? 'Copied Succesfully!' : 'Click to copy'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <div className="clipboard-subtask-id" onClick={this._handleCopyToClipboard.bind(this, subtask_id)}>
                            <span>{subtask_id}</span>
                        </div>
                    </ReactTooltip>
                </td>
                <td>
                    <ReactTooltip overlayClassName="black" placement="bottom" trigger={['hover']} overlay={<p>{status}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className={`icon-status-dot ${statusDot(status)}`}/>
                    </ReactTooltip>
                </td>
                <td>
                    <ReactTooltip overlayClassName="black" placement="bottomRight" trigger={['hover']} overlay={<p>{isDataCopied ? 'Copied Succesfully!' : 'Click to copy IP Address'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span onClick={this._handleCopyToClipboard.bind(this, node_ip_address)}>{node_name || 'Anonymous node'}</span>
                    </ReactTooltip>
                </td>
            </tr>)
    }

    isPresetFieldsFilled(nextState) {
        if(this.props.params.id === editMode){
            const {resolution, frames, sample_per_pixel, compositing, format} = nextState;
            return presetSchema[this.props.task.type].isValid({resolution, frames, sample_per_pixel, compositing, format})
        }
        return new Promise(res => res(false))
    }

    _handleFormByType(type, isDetail) {
        const {modalData, isDetailPage, resolution, frames, formatIndex, output_path, timeout, subtasks, maxSubtasks, subtask_timeout, bid, compositing, presetList, savePresetLock, presetModal, managePresetModal} = this.state
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
                                <span className="title">Resolution</span>
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
                                <input ref="subtaskCount" type="number" min="1" max={maxSubtasks} placeholder="Type a number" aria-label="Subtask amount" onChange={this._handleFormInputs.bind(this, 'subtasks')} required={!isDetailPage} disabled={isDetailPage || !maxSubtasks}/>
                            </div>
            },
            {
                order: 9,
                content: <div className="item-settings" key="9">
                                <span className="title">Subtask Timeout</span>
                                <input ref="subtaskTimeout" type="text" aria-label="Subtask Timeout" onKeyDown={this._handleTimeoutInputs.bind(this, 'subtask_timeout')} required={!isDetailPage} disabled={isDetailPage}/>
                            </div>
            }
        ]

        switch (type) {
        case taskType.BLENDER:
            formTemplate.push({
                order: 2,
                content: <div className="item-settings" key="2">
                            <span className="title">Frame Range</span>
                            <input ref="framesRef" type="text" aria-label="Frame Range" placeholder={hints.frame[this.frameHintNum]} pattern="^[0-9]?(([0-9\s;,-]*)[0-9])$" onChange={this._handleFormInputs.bind(this, 'frames')} required={!isDetailPage} disabled={isDetailPage}/>
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
                            <input ref="haltspp" type="number" placeholder="Type a number" min="1" max="2000" aria-label="Sample per pixel" onChange={this._handleFormInputs.bind(this, 'sample_per_pixel')} required={!isDetailPage} disabled={isDetailPage}/>
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
        const {modalData, isDetailPage, presetModal, bid, managePresetModal, defaultSettingsModal, resolutionChangeModal, resolutionChangeInfo} = this.state
        const {testStatus, estimated_cost, subtasksList, isDeveloperMode} = this.props;
        let testStyle = this._handleTestStatus(testStatus)
        return (
            <div>       
                <form id="taskForm" onSubmit={::this._handleStartTaskButton} className="content__task-detail">
                    <section className={`section-preview__task-detail ${this._getPanelClass(testStatus)}`}>
                        { isDetailPage && <div className="panel-preview__task-detail">
                            <Link to="/tasks" aria-label="Back button to task list">
                                <span className="icon-arrow-left-white"/>
                                <span>Back</span>
                            </Link>
                        </div>}
                        {!isDetailPage && this._getPanelInfo(testStatus)}
                        {!isDetailPage && <button type="button" className={`btn--outline ${testStyle.class}`}>{testStyle.text} {testStatus.status === testStatusDict.STARTED && <span className="jumping-dots">
                            <span className="dot-1">.</span>
                            <span className="dot-2">.</span>
                            <span className="dot-3">.</span>
                        </span>}</button>}
                    </section>

                    <section className="container__task-detail">
                        { (isDetailPage && isDeveloperMode) &&
                        <div className="section-node-list__task-detail">
                            <h4 className="experiment">Dev mode</h4>
                        { subtasksList.length > 0 ?
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
                            :
                            <div className="no-node__task">
                                <span>There's no active node.</span>
                            </div>
                        }
                        </div>
                        }
                        <div className="section-settings__task-detail">
                                <h4>Settings</h4>
                                {this._handleFormByType(this.state.type || this.props.task.type, isDetailPage)}
                        </div>
                        <div className="section-price__task-detail">
                            <h4 className="title-price__task-detail">Price</h4>
                            <div className="item-price">
                                <span className="title">Your bid</span>
                                <input ref="bidRef" type="number" min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" aria-label="Your bid" onChange={this._handleFormInputs.bind(this, 'bid')} required={!isDetailPage} disabled={isDetailPage}/>
                                <span>tGNT/h</span>
                            </div>
                            <div className="item-price estimated-price__panel">
                                <span className="title">Estimated</span>
                                {this._convertPriceAsHR(estimated_cost)}
                                <span>tGNT</span>
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
                        <button id="taskFormSubmit" type="submit" className="btn--primary" disabled={testStyle.locked}>Start Task</button>
                    </section>}
                </form>
                {presetModal && <PresetModal closeModal={::this._closeModal} saveCallback={::this._handlePresetSave} {...modalData}/>}
                {managePresetModal && <ManagePresetModal closeModal={::this._closeModal}/>}
                {defaultSettingsModal && <DefaultSettingsModal closeModal={::this._closeModal} applyPreset={::this._applyDefaultPreset}/>}
                {resolutionChangeModal && <ResolutionChangeModal closeModal={::this._closeModal} applyPreset={::this._applyPresetOption} info={resolutionChangeInfo}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail)
