import React from 'react';
import { Link } from 'react-router-dom'
import TimeSelection from 'timepoint-selection'
import isEqual from 'lodash.isequal';
import { BigNumber } from "bignumber.js";
const {remote} = window.electron;
const mainProcess = remote.require('./index')

import yup from 'yup'

import TestResult from './TestResult'
import NodeList from './NodeList'
import PresetModal from './modal/PresetModal'
import DepositTimeModal from './modal/DepositTimeModal'
import ManagePresetModal from './modal/ManagePresetModal'
import DefaultSettingsModal from './modal/DefaultSettingsModal'
import ResolutionChangeModal from './modal/ResolutionChangeModal'
import InsufficientAmountModal from './modal/InsufficientAmountModal'

import Dropdown from './../Dropdown'
import InfoLabel from './../InfoLabel'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const {dialog} = remote

import * as Actions from './../../actions'
import {once} from './../../utils/once'
import zipObject from './../../utils/zipObject'
import isObjectEmpty from './../../utils/isObjectEmpty'
import {testStatusDict} from './../../constants/statusDicts'
import calculateFrameAmount from './../../utils/calculateFrameAmount'
    
import whoaImg from './../../assets/img/whoa.png'

const ETH_DENOM = 10 ** 18;
const TIME_VALIDITY_NOTE = "Time should be minimum 1 minute."

const editMode = "settings"
const taskType = Object.freeze({
    BLENDER: 'Blender',
    LUXRENDER: 'LuxRender'
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

const mapStateToProps = state => ({
    currency: state.currency,
    estimated_cost: state.details.estimated_cost,
    isDeveloperMode: state.input.developerMode,
    isMainNet: state.info.isMainNet,
    location: state.fileLocation.location,
    presets: state.details.presets,
    requestorMaxPrice: state.price.requestorMaxPrice,
    subtasksList: state.single.subtasksList,
    task: state.create.task,
    taskInfo: state.details.detail,
    testStatus: state.details.test_status,
    gasInfo: state.details.gasInfo,
    concentSwitch: state.concent.concentSwitch
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
            isDetailPage: props.match.params.id !== "settings", //<-- HARDCODED
            isInPatient: false,
            isDepositimeApplied: false,
            //INPUTS
            compositing: false,
            concent: props.concentSwitch,
            resolution: [NaN,NaN],
            frames: '',
            format: '',
            formatIndex: 0,
            output_path: props.location,
            compute_on: 'cpu',
            sample_per_pixel: 0,
            timeout: '',
            subtasks_count: 1,
            maxSubtasks: 0,
            subtask_timeout: '',
            bid: props.requestorMaxPrice / ETH_DENOM,
            //CUSTOM
            testLock: false,
            presetList: [],
            savePresetLock: true,
            presetModal: false,
            depositTimeModal: false,
            managePresetModal: false,
            defaultSettingsModal: false,
            insufficientAmountModal: {
                result: false,
                message: null
            },
            resolutionChangeModal: false,
            resolutionChangeInfo: [],
            loadingTaskIndicator: false
        }
    }

    componentDidMount() {
        const {match, actions, task, presets, location, isDeveloperMode, requestorMaxPrice} = this.props

        actions.setEstimatedCost(0)
        if (match.params.id !== editMode) {
            actions.getTaskDetails(match.params.id)
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

        if(match.params.id === editMode)
            document.getElementById("taskFormSubmit").addEventListener("click", ()=>{
                Object.keys(this.interactedInputObject).map(keys => this.interactedInputObject[keys] = true)
            })

        actions.getTaskGasPrice()
    }

    componentWillUnmount() {
        this.props.actions.clearTaskPlain()
        this.liveSubList && clearInterval(this.liveSubList);
        this.interactedInputObject = {}

        if(this.props.testStatus){
            this.props.actions.abortTestTask()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.taskInfo).length > 0 && nextProps.match.params.id !== editMode) {
            if (!!this.taskTimeoutInput && !!this.subtaskTaskTimeoutInput) {
                this._setTimeStamp()
            }
            this.setState({
                type: nextProps.taskInfo.type
            }, () => {

                const {type, timeout, subtasks_count, subtask_timeout, compute_on, concent_enabled, options, bid} = nextProps.taskInfo
                const {resolutionW, resolutionH, formatRef, outputPath, compositingRef, concentRef, haltspp, taskTimeout, subtaskCount, subtaskTimeout, bidRef} = this.refs
                this.taskTimeoutInput.setValue((getTimeAsFloat(timeout) * 3600) || 0)
                subtaskCount.value = subtasks_count || 0
                this.subtaskTaskTimeoutInput.setValue((getTimeAsFloat(subtask_timeout) * 3600) || 0)
                bidRef.value = bid || 0
                if (options) {
                    resolutionW.value = options.resolution[0]
                    resolutionH.value = options.resolution[1]
                    outputPath.value = options.output_path
                    let formatIndex = mockFormatList.map(item => item.name).indexOf(options.format);
                    
                    /*Apply concent option only on testnet*/
                    if(!this.props.isMainNet) concentRef.checked = concent_enabled

                    this.setState({
                        formatIndex,
                        compute_on,
                        concent: !!concent_enabled
                    })

                    if ((nextProps.task.type || this.state.type) === taskType.BLENDER) {
                        // compositingRef.checked = options.compositing
                        // this.setState({
                        //     compositing: options.compositing
                        // })
                        this.refs.framesRef.value = options.frames ? options.frames : 1
                    } else if ((nextProps.task.type || this.state.type) === taskType.LUXRENDER) {
                        haltspp.value = options.haltspp
                    }
                }
            })
        }

        if (nextProps.presets !== this.props.presets) {
            this.parsePresets(nextProps.presets)
        }

        if(!isEqual(nextProps.testStatus, this.props.testStatus) && 
                !isObjectEmpty(nextProps.testStatus.more) && 
                !this.state.defaultSettingsModal)
        {
            this.setState({
                defaultSettingsModal: true
            })
        }

        if(nextProps.task.resources !== this.props.task.resources){
            setTimeout(() => ::this._handleLocalRender(), 2000);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const {subtasks_count, subtask_timeout, bid, isDetailPage, savePresetLock, resolution, maxSubtasks, frames, sample_per_pixel} = this.state
        const {actions, task} = this.props
        if ((!!nextState.subtasks_count && !!nextState.subtask_timeout && !!nextState.bid) && (nextState.subtasks_count !== subtasks_count || nextState.subtask_timeout !== subtask_timeout || nextState.bid !== bid)) {
            actions.getEstimatedCost({
                type: task.type,
                options: {
                    price: new BigNumber(nextState.bid).multipliedBy(ETH_DENOM).toString(), //wei
                    subtasks_count: Number(nextState.subtasks_count),
                    subtask_timeout: floatToString(nextState.subtask_timeout)
                }
            })
        }

        if(nextProps.isDeveloperMode && !this.liveSubList && isDetailPage){

            let interval = ()=> {
                actions.fetchSubtasksList(nextProps.match.params.id)
                return interval
            }
            this.liveSubList = setInterval(interval(), 2000)

        } else if(!nextProps.isDeveloperMode && this.liveSubList && isDetailPage) {

            clearInterval(this.liveSubList)
            this.liveSubList = false;
            
        }

        if(nextState.resolution !== resolution){
            this.isPresetFieldsFilled(nextState).then(this.changePresetLock);
            this._calcMaxSubtaskAmount.call(this, nextState);
        }

        if(nextState.maxSubtasks !== maxSubtasks || nextState.subtasks_count !== subtasks_count){
            const result = Math.min(nextState.maxSubtasks, nextState.subtasks_count);
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

            const frameAmount = calculateFrameAmount(frames);
            maxSubtasks = Math.floor(y / Math.max((y / 100) * 3, 8 + ((y / 100) * 2))) * frameAmount;
            
        } else {
            maxSubtasks = 100 
        }

        const subtaskValue = Math.min(maxSubtasks, this.state.subtasks_count)

        this.setState({
                maxSubtasks,
                subtasks_count: subtaskValue
            })

        this.refs.subtaskCount.value = subtaskValue
    }

    _convertPriceAsHR(price = 0, suffix, fixTo = 2, font_size) {
        let priceLength = parseInt(price).toString().length
        let fontSize = price.toFixed(fixTo).toString().length > 4 ? (font_size/1.7)+'pt' : font_size+'pt';

        if (priceLength < 5) {
            return <span 
                className={`estimated-price ${suffix}`} 
                style={{'fontSize': fontSize}}>
                    {price.toFixed(fixTo)}
                </span>
        }
        let firstDigit = parseInt(price) / (10 ** (priceLength - 1))
        let firstDigitLength = firstDigit.toString().length
        return <span 
                className={`estimated-price ${suffix}`}
                style={{'fontSize': fontSize}}>
                {firstDigitLength > 3 ? "~" + firstDigit.toFixed(2) : firstDigit}
                <small>x</small>
                10
                <sup>{priceLength - 1}</sup>
            </span>
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
     * [_handleCheckbox func. updates checkbox value]
     * @param  {Event}  e
     */
    _handleConcentCheckbox(e) {
        this.interactedInputObject[e.target.getAttribute("aria-label")] = true;
        this.setState({
            concent: e.target.checked
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
                    (state === "frames" || state === "sample_per_pixel") 
                    && !this.checkInputValidity(e)){
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

        const { format, frames, output_path, resolution, sample_per_pixel} = preset.value //compositing,
        const {resolutionW, resolutionH, framesRef, formatRef, outputPath, haltspp} = this.refs //compositingRef,
        
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

        // If  file format from preset list is not available on mockFormatList, use first element as default
        const pickFormatIndex = mockFormatList.map(item => item.name).indexOf(format);
        const formatIndex = pickFormatIndex > -1 ? pickFormatIndex : 0;

        if(pickFormatIndex > -1){
            formatRef.value = format
        } else {
            preset.value.format = formatRef.value = mockFormatList[0].name
        }

        outputPath.value = output_path

        if (this.props.task.type === taskType.BLENDER) {

            framesRef.value = frames
            //compositingRef.checked = compositing

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
        let result = list.filter((item, index) => item.name === formatName)[0];
        (result && result.name) && this.setState({
            format: result.name,
            formatIndex: index
        })
    }

    _handleComputeOnOptionChange(e){
        this.setState({
            compute_on: e.target.value,
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
        const format = file_format.replace(".", "").toUpperCase()

        // If taken file format from input file is not available on mockFormatList, use first element as default
        const pickFormatIndex = mockFormatList.map(item => item.name).indexOf(format);
        const formatIndex = pickFormatIndex > -1 ? pickFormatIndex : 0;

        resolutionW.value = resolution[0]
        resolutionH.value = resolution[1]
        formatRef.value = pickFormatIndex > -1 ? format : mockFormatList[0].name

        this.setState({
            resolution,
            format: formatRef.value,
            formatIndex,
            isDefaultResolutionApplied: true
        })

        this._closeModal('defaultSettingsModal')
    }

    /**
     * [_closeModal func. closes all modals]
     */
    _closeModal(_modal) {
        this.setState({
            [_modal]: false
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
    _handleStartTaskButton = () => {
        const {gasInfo} = this.props
        const {concent, depositTimeModal, isDepositimeApplied} = this.state

        if(!isDepositimeApplied
            &&concent
            && gasInfo 
            && gasInfo.current_gas_price.isGreaterThan(gasInfo.gas_price_limit)){
            this.setState({
                depositTimeModal: true
            })
            return false
        }

        this._nextStep = true
        this.setState({
            loadingTaskIndicator: true
        })
        this._createTaskAsync().then(result => {
            if(result && !result[1]){
                window.routerHistory.push('/tasks');
            } else {
                console.log("Task creation failed!")
                this.setState({
                    insufficientAmountModal: {
                        result: !!result[1],
                        message: result[1]
                    },
                    loadingTaskIndicator: false
                })
            }
        })
    }

    _handleLocalRender() {
        const {actions, task} = this.props;
        const {compute_on} = this.state;
        const {resources, type, name} = task
        actions.runTestTask({
            name,
            resources,
            compute_on,
            type,
            subtasks_count: 1 // <--- HARDCODED
        })
    }

    _createTaskAsync(){
        const {resolution, frames, format, output_path, compute_on, timeout, subtasks_count, subtask_timeout, bid, compositing} = this.state
        const {task, testStatus} = this.props

        return new Promise((resolve, reject) => {
            this.props.actions.createTask({
                ...task,
                compute_on,
                timeout: floatToString(timeout),
                subtasks_count: Number(subtasks_count),
                subtask_timeout: floatToString(subtask_timeout),
                bid,
                estimated_memory : (testStatus && testStatus.estimated_memory),
                options: {
                    resolution,
                    frames,
                    format,
                    compositing,
                    output_path,
                }
            }, resolve, reject)
        })
    }

    _createTaskOnHighGas = (isConcentOn) => {
        this.setState({
            concent: isConcentOn,
            isDepositimeApplied: true
        }, this._handleStartTaskButton)
    }

    /**
    * [_handleManagePresetModal func. will trigger managePresetModal state to make manage preset modal visible]
    */
    _handleManagePresetModal() {
        this.setState({
            managePresetModal: true
        })
    }

    _toggleLoadingHint(){
        this.setState({
            isInPatient: true
        })
    }

    _toggleTestLock(result){
        this.setState({
            testLock: result
        })
    }

    _getPanelClass(testStatus){
        return this._checkTestStatus(testStatus)
    }

    isPresetFieldsFilled(nextState) {
        if(this.props.match.params.id === editMode){
            const {resolution, frames, sample_per_pixel, compositing, format} = nextState;
            return presetSchema[this.props.task.type].isValid({resolution, frames, sample_per_pixel, compositing, format})
        }
        return new Promise(res => res(false))
    }

    _handleFormByType(type, isDetail) {
        const {modalData, isDetailPage, resolution, frames, formatIndex, output_path, timeout, subtasks_count, maxSubtasks, subtask_timeout, bid, compositing, presetList, savePresetLock, presetModal, managePresetModal} = this.state
        const {testStatus} = this.props;
        let formTemplate = [
            {
                order: 0,
                detailContent: false,
                content: <div className="item-settings" key="0">
                            <InfoLabel type="span" label="Preset" info={<p className="tooltip_task">Create and manage a number of presets to simplify the process of rendering with Golem.<br/>Create presets for commonly used sizes, frame ranges.</p>} cls="title" infoHidden={true}/>
                            <Dropdown list={presetList} handleChange={this._handlePresetOptionChange.bind(this, presetList)} disabled={isDetailPage} manageHandler={::this._handleManagePresetModal}  presetManager/> 
                        </div>
            },
            {
                order: 1,
                content: <div className="item-settings" key="1">
                                <InfoLabel type="span" label="Resolution" info={<p className="tooltip_task">Set width & height of your scene</p>} cls="title" infoHidden={true}/>
                                <input ref="resolutionW" type="number" min="100" max="8000" aria-label="Dimension (width)" onChange={this._handleResolution.bind(this, 0)} required={!isDetailPage} disabled={isDetailPage}/>
                                <span className="icon-cross"/>
                                <input ref="resolutionH" type="number" min="100" max="8000" aria-label="Dimension (height)" onChange={this._handleResolution.bind(this, 1)} required={!isDetailPage} disabled={isDetailPage}/>
                            </div>
            },
            {
                order: 3,
                content: <div className="item-settings" key="3">
                                <InfoLabel type="span" label="Format" info={<p className="tooltip_task">For Blender supported formats are .png, .tga, .exr, .jpeg and .bmp</p>} cls="title" infoHidden={true}/>
                                <Dropdown ref="formatRef" list={mockFormatList} selected={formatIndex} handleChange={this._handleFormatOptionChange.bind(this, mockFormatList)} disabled={isDetailPage}/> 
                         </div>
            },
            {
                order: 4,
                content: <div className="item-settings" key="4">
                                <InfoLabel type="span" label="Output to" info={<p className="tooltip_task">If you define output as: ~/project/output_file_####.png then frames ~/project/<br/>output_file_0001.png, etc. will be created.</p>} cls="title" infoHidden={true}/>
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
            }
        ]

        switch (type) {
        case taskType.BLENDER:
            formTemplate.push({
                order: 2,
                content: <div className="item-settings" key="2">
                            <InfoLabel type="span" label="Frame Range" info={<p className="tooltip_task">Define frames to render. You can separate frame numbers with ;, eg. 1;4;7 will define<br/>frame 1, 4 and 7. You can also define frames ranges with - <a href="https://golem.network/documentation/07-submitting-a-task/#render-settings">Learn more</a></p>} cls="title" infoHidden={true} interactive={true}/>
                            <input ref="framesRef" type="text" aria-label="Frame Range" placeholder={hints.frame[this.frameHintNum]} pattern="^[0-9]?(([0-9\s;,-]*)[0-9])$" onChange={this._handleFormInputs.bind(this, 'frames')} required={!isDetailPage} disabled={isDetailPage}/>
                         </div>
            })
            // formTemplate.push({
            //     order: 5,
            //     content: <div className="item-settings" key="5">
            //                 <span className="title">Blender Compositing</span>
            //                 <div className="switch-box switch-box--green">
            //                     <span>{compositing ? 'On' : 'Off'}</span>
            //                     <label className="switch">
            //                         <input ref="compositingRef" type="checkbox" aria-label="Blender Compositing Checkbox" tabIndex="0" onChange={this._handleCheckbox.bind(this)} disabled={isDetailPage}/>
            //                         <div className="switch-slider round"></div>
            //                     </label>
            //                 </div>
            //             </div>
            // })
            break;
        case taskType.LUXRENDER:
            formTemplate.push({
                order: 5,
                content: <div className="item-settings" key="5">
                            <InfoLabel type="span" label="Sample per pixel" info={<p className="tooltip_task">Set your file<br/> settings</p>} cls="title" infoHidden={true}/>
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

    _fetchRadioOptions = (type) => {
        let computeOnRadioOptions = {};

        if(this.state.isDetailPage) {
            computeOnRadioOptions['readOnly'] = true;
            computeOnRadioOptions['checked'] = this.state.compute_on === type;
        } else {
            computeOnRadioOptions['onChange'] = ::this._handleComputeOnOptionChange;
            computeOnRadioOptions['defaultChecked'] = this.state.compute_on === type;
        }

        return computeOnRadioOptions
    }

    render() {

        const {
            bid, 
            compute_on,
            concent,
            defaultSettingsModal, 
            insufficientAmountModal, 
            isDetailPage, 
            isInPatient,
            loadingTaskIndicator,
            managePresetModal, 
            maxSubtasks,
            modalData, 
            presetModal,
            depositTimeModal, 
            resolutionChangeInfo,
            resolutionChangeModal,
            testLock
        } = this.state

        const {
            actions,
            currency,
            estimated_cost, 
            isDeveloperMode,
            isMainNet,
            subtasksList, 
            task,
            testStatus
        } = this.props;
        console.log("estimated_cost", estimated_cost);
        return (
            <div>
                <form id="taskForm" onSubmit={::this._handleStartTaskButton} className="content__task-detail">
                    <TestResult 
                        testStatus={testStatus} 
                        isDetailPage={isDetailPage}
                        task={task}
                        actions={actions}
                        toggleTestLock={::this._toggleTestLock}
                        />
                    <section className="section-details__task-detail">
                        <div ref={node => this.overflowTaskDetail = node} className="container__task-detail">
                            { (isDetailPage && isDeveloperMode) && <NodeList subtasksList={subtasksList} overflowRef={this.overflowTaskDetail} actions={actions}/>}
                            <div className="section-settings__task-detail">
                                    <InfoLabel type="h4" label=" File Settings" info={<p className="tooltip_task">Set your file settings, and if you<br/>have any questions just hover over<br/>specific label to find some help</p>} distance={-20}/>
                                    {!isDetailPage && <div className="source-path">{task.relativePath}</div>}
                                    {this._handleFormByType(this.state.type || this.props.task.type, isDetailPage)}
                            </div>
                            <div className="section-task__task-detail">
                                <InfoLabel type="h4" label=" Task Settings" info={<p className="tooltip_task">Depending on your settings related to price and trust,<br/>it may take a while for your task to be accepted by the network.</p>} distance={-20}/>
                                <div className="item-settings">
                                    <InfoLabel 
                                        type="span" 
                                        label="Task Timeout" 
                                        info={<p className="tooltip_task">Setting a time limit here will let Golem know the maximum time you will wait <br/>for a task to
                                            be accepted by the network. <a href="https://golem.network/documentation/07-submitting-a-task/#task-and-subtask-timeouts">
                                            Learn more
                                            </a></p>} 
                                        cls="title" 
                                        infoHidden={true} 
                                        interactive={true}/>
                                    <input ref="taskTimeout" type="text" aria-label="Task Timeout" onKeyDown={this._handleTimeoutInputs.bind(this, 'timeout')} required={!isDetailPage} disabled={isDetailPage}/>
                                </div>
                                <div className="item-settings">
                                    <InfoLabel 
                                        type="span" 
                                        label="Subtask Amount" 
                                        info={<p className="tooltip_task">Tells the system how many subtasks to break a task into. If you are rendering
                                                <br/>a number of frames you should set subtasks to the same number. <a href="https://golem.network/documentation/07-submitting-a-task/#task-and-subtask-timeouts">
                                                Learn more
                                                </a>
                                                </p>} 
                                            cls="title" 
                                            infoHidden={true} 
                                            interactive={true}/>
                                    <input ref="subtaskCount" type="number" min="1" max={maxSubtasks} placeholder="Type a number" aria-label="Subtask amount" onChange={this._handleFormInputs.bind(this, 'subtasks_count')} required={!isDetailPage} disabled={isDetailPage || !maxSubtasks}/>
                                </div>
                                <div className="item-settings">
                                    <InfoLabel type="span" label="Subtask Timeout" info={<p className="tooltip_task">Set the maximum time you are prepared to wait for a subtask to complete.</p>} cls="title" infoHidden={true}/>
                                    <input ref="subtaskTimeout" type="text" aria-label="Subtask Timeout" onKeyDown={this._handleTimeoutInputs.bind(this, 'subtask_timeout')} required={!isDetailPage} disabled={isDetailPage}/>
                                </div>
                                <div className="item-settings">
                                <InfoLabel type="span" label="Render on" info={<p className="tooltip_task">Select if you want your task to be rendered on CPU or GPU of providers. GPU support is still in beta. Contact us if you find any issues with GPU rendering. <a href="https://golem.network/documentation/">Learn more</a></p>} cls="title" infoHidden={true}/>
                                <div className="render-on__radio-group">
                                    <div>
                                        <input type="radio" id="cpu" value="cpu" name="compute_on" {...this._fetchRadioOptions('cpu')}/>
                                        <label htmlFor="cpu">
                                            <span className="overlay"/>
                                            <span className="icon-cpu"/>CPU
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="gpu" value="gpu" name="compute_on" {...this._fetchRadioOptions('gpu')}/>
                                        <label htmlFor="gpu">
                                            <span className="overlay"/>
                                            <span className="icon-gpu"/>GPU
                                        </label>
                                    </div>
                                </div>
                            </div>
                            </div>
                            { !isMainNet
                                &&
                                <div className="section-concent__task-detail">
                                    <InfoLabel type="h4" label="Concent" info={<p className="tooltip_task">If you set the switch to off this task<br/>will compute without Concent<br/>but only for this task. It will not<br/>turn Concent off for all tasks.</p>} cls="title-concent__task-detail" distance={-20}/>
                                    <div className="item-concent">
                                        <InfoLabel 
                                            type="span" 
                                            label="Set"
                                            cls="title" 
                                            infoHidden={true}/>
                                        <div className="switch-box switch-box--green">
                                             <span className="switch-label switch-label--left">Off</span>
                                             <label className="switch">
                                                 <input ref="concentRef" type="checkbox" aria-label="Task Based Concent Checkbox" tabIndex="0" defaultChecked={concent} onChange={this._handleConcentCheckbox.bind(this)} disabled={isDetailPage}/>
                                                 <div className="switch-slider round"></div>
                                             </label>
                                             <span className="switch-label switch-label--right">On</span>
                                         </div>
                                    </div>
                                </div>
                            }
                            <div className="section-price__task-detail">
                                <InfoLabel type="h4" label="Price" info={<p className="tooltip_task">Set the amount<br/>of GNT that you<br/>are prepared to<br/>pay for this task.</p>} cls="title-price__task-detail" distance={-20}/>
                                <div className="item-price">
                                    <InfoLabel 
                                        type="span" 
                                        label="Your bid" 
                                        info={<p className="tooltip_task">Set the amount of GNT that you are prepared to pay for this task. This is a free market,
                                            <br/>and you should set the price as you will but we think that keeping close to 0.2$ is ok.</p>} 
                                        cls="title" 
                                        infoHidden={true}/>
                                    <div className="input__price-set">
                                        <input ref="bidRef" type="number" min="0.01" max={Number.MAX_SAFE_INTEGER} step="0.01" aria-label="Your bid" onChange={this._handleFormInputs.bind(this, 'bid')} required={!isDetailPage} disabled={isDetailPage}/>
                                        <span>{isMainNet ? "" : "t"} GNT/h</span>
                                    </div>
                                    <div className="estimated_usd">
                                        <span>est. {isMainNet ? "" : "t"}$ {this._convertPriceAsHR(bid * currency["GNT"], "USD", 2, 12)}</span>
                                    </div>
                                </div>
                                <div className="estimated-price__panel">
                                    <div className="item-price">
                                        <InfoLabel 
                                            type="span" 
                                            label="Total" 
                                            info={<p className="tooltip_task">The estimated price that you’ll have to pay to render the task is based on Your bid,
                                                <br/>subtask amount and timeout settings. Fiat value may change during computation
                                                <br/>as well as gas price 
                                                <a href="https://golem.network/documentation/08-pricing-best-practices/#the-formula-for-calculating-the-estimated-cost-of-a-task">
                                                Learn more
                                                </a>
                                                </p>} 
                                            cls="title" 
                                            infoHidden={true} 
                                            interactive={true}/>
                                        <div className="estimated_cost">
                                            {this._convertPriceAsHR(estimated_cost.GNT, "GNT", 3, 36)}
                                            <span>{isMainNet ? "" : "t"} GNT</span>
                                        </div>
                                        <div className="estimated_usd">
                                            <span>est. {isMainNet ? "" : "t"}$ {this._convertPriceAsHR((estimated_cost.GNT || 0) * currency["GNT"], "USD", 4, 12)}</span>
                                        </div>
                                    </div>
                                    <div className="item-price">
                                        <InfoLabel 
                                            type="span" 
                                            label="Tx Fee Lock" 
                                            info={<p className="tooltip_task">Estimated ETH amount to be locked for this task to cover transaction costs. 
                                                <br/>It may vary from what you will actually pay for this transaction 
                                                <br/>as usually the final cost is much lower.</p>} 
                                                cls="title" 
                                                infoHidden={true}/>
                                        <div className="estimated_cost">
                                            {this._convertPriceAsHR(estimated_cost.ETH, "ETH", 5, 18)}
                                            <span>{isMainNet ? "" : "t"} ETH</span>
                                        </div>
                                        <div className="estimated_usd">
                                            <span>est. {isMainNet ? "" : "t"}$ {this._convertPriceAsHR((estimated_cost.ETH || 0) * currency["ETH"], "USD", 4, 12)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="estimated-deposit__panel">
                                    <div className="item-price">
                                        <InfoLabel 
                                            type="span" 
                                            label="Deposit payment" 
                                            info={<p className="tooltip_task">The deposit amount is higher than the cost of task to ensure that you 
                                                <br/>have enough funds to participate in the network. The real cost 
                                                <br/>of a task is unchanging. Providers using Concent Service will 
                                                <br/>check if requestors have no less than twice the amount 
                                                <br/>of funds in their Deposit for covering a task payment.
                                                </p>} 
                                            cls="title" 
                                            infoHidden={true} 
                                            interactive={true}/>
                                        <div className="estimated_cost">
                                            {this._convertPriceAsHR(estimated_cost.deposit.GNT_suggested, "GNT", 3, 14)}
                                            <span>{isMainNet ? "" : "t"} GNT</span>
                                        </div>
                                        <div className="estimated_usd">
                                            <span>est. {isMainNet ? "" : "t"}$ {this._convertPriceAsHR((estimated_cost.deposit.GNT_suggested || 0) * currency["GNT"], "USD", 4, 14)}</span>
                                        </div>
                                    </div>
                                    <div className="item-price">
                                        <InfoLabel 
                                            type="span" 
                                            label="Deposit Tx fee" 
                                            info={<p className="tooltip_task">You need small amount of ETH (used for gas) avaliable on your account 
                                                <br/>to submit a deposit to the Concent Service
                                                </p>} 
                                            cls="title" 
                                            infoHidden={true} 
                                            interactive={true}/>
                                        <div className="estimated_cost">
                                            {this._convertPriceAsHR(estimated_cost.deposit.ETH, "ETH", 5, 14)}
                                            <span>{isMainNet ? "" : "t"} ETH</span>
                                        </div>
                                        <div className="estimated_usd">
                                            <span>est. {isMainNet ? "" : "t"}$ {this._convertPriceAsHR((estimated_cost.deposit.ETH || 0) * currency["GNT"], "USD", 5, 14)}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="item-price tips__price">
                                    You can accept the estimated price or you can bid higher if you would like to increase your chances of quicker processing.
                                </span>  
                            </div>
                        </div>
                    </section>
                    {!isDetailPage && <section className="section-action__task-detail">
                        <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                            <span >Cancel</span>
                        </Link>
                        <button id="taskFormSubmit" type="submit" className="btn--primary" disabled={testLock || loadingTaskIndicator}>Start Task</button>
                    </section>}
                </form>
                {presetModal && <PresetModal closeModal={::this._closeModal} saveCallback={::this._handlePresetSave} {...modalData}/>}
                {managePresetModal && <ManagePresetModal closeModal={::this._closeModal}/>}
                {depositTimeModal && <DepositTimeModal closeModal={::this._closeModal} createTaskOnHighGas={::this._createTaskOnHighGas}/> }
                {defaultSettingsModal && <DefaultSettingsModal closeModal={::this._closeModal} applyPreset={::this._applyDefaultPreset}/>}
                {resolutionChangeModal && <ResolutionChangeModal closeModal={::this._closeModal} applyPreset={::this._applyPresetOption} info={resolutionChangeInfo}/>}
                {(insufficientAmountModal && insufficientAmountModal.result) && <InsufficientAmountModal message={insufficientAmountModal.message} closeModal={::this._closeModal}/>}
            </div>
        );
    }
}

// {<div>
//     <input type="radio" id="sgx" value="sgx" name="compute_on"/>
//     <label htmlFor="sgx">
//         <span className="overlay"/>
//         <span className="icon-sgx"/>SGX
//     </label>
// </div>}

// LOADING SCREEN IN ADVANCE
// { (testStatus 
//     && !isDetailPage
//     && !(testStatus.status === testStatusDict.SUCCESS 
//         || testStatus.status === testStatusDict.ERROR)) 
// &&  <div className="test_status__loading" style={{background: `rgba(255, 255, 255, ${isInPatient ? .9 : .7})`}} onClick={::this._toggleLoadingHint}>
//         { isInPatient 
//             && <div className="loading--patient">
//             <img src={whoaImg} alt="Please be patient"/>
//             <span>
//             Hey don't be so impatient!<br/>
//             Local render test may require some time to finish. <br/>
//             </span>
//         </div>}
//     </div>}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail)
