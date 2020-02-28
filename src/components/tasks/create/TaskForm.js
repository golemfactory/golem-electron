import React from 'react';
import { Link } from 'react-router-dom';
import TimeSelection from 'timepoint-selection';
import isEqual from 'lodash/isEqual';
import { BigNumber } from 'bignumber.js';
import yup from 'yup';

const { remote } = window.electron;
const { dialog } = remote;

import TestResult from './TestResult';
import NodeList from '../NodeList';
import PresetModal from '../modal/PresetModal';
import DepositTimeModal from '../modal/DepositTimeModal';
import TaskSummaryModal from '../modal/TaskSummaryModal';
import ManagePresetModal from '../modal/ManagePresetModal';
import DefaultSettingsModal from '../modal/DefaultSettingsModal';
import ResolutionChangeModal from '../modal/ResolutionChangeModal';
import InsufficientAmountModal from '../modal/InsufficientAmountModal';

import Dropdown from '../../Dropdown';
import InfoLabel from '../../InfoLabel';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../../actions';
import { once } from '../../../utils/once';
import deepDiff from '../../../utils/deepDiff';
import zipObject from '../../../utils/zipObject';
import isObjectEmpty from '../../../utils/isObjectEmpty';
import { ETH_DENOM } from '../../../constants/variables';
import { floatToHR } from '../../../utils/time';
import calculateFrameAmount from '../../../utils/calculateFrameAmount';

const TIME_VALIDITY_NOTE = 'Time should be minimum 1 minute.';
const WAIT_INTERVAL = 500;
const taskType = Object.freeze({
  BLENDER: 'Blender',
  BLENDER_NVGPU: 'Blender_NVGPU'
});

const mockFormatList = [
  {
    name: 'PNG'
  },
  {
    name: 'EXR'
  }
];

const presetSchema = {
  Blender: yup.object().shape({
    resolution: yup
      .array()
      .of(
        yup
          .number()
          .min(100)
          .max(8000)
      )
      .required(),
    frames: yup.string().required(),
    format: yup.string(),
    output_path: yup.string(),
    compositing: yup.bool()
  })
};

const nameSchema = yup
  .string()
  .min(4)
  .max(24)
  .matches(/^[a-zA-Z0-9_\-\.]+( [a-zA-Z0-9_\-\.]+)*$/)
  .required();

const hints = {
  frame: [
    'Hint: To use consecutive frames, e.g. "1-6".',
    'Hint: To pick random frames, e.g. "2;6;7".',
    'Hint: To use common diff. e.g. "1-7,2".'
  ]
};

const mapStateToProps = state => ({
  currency: state.currency,
  estimated_cost: state.details.estimated_cost,
  isMainNet: state.info.isMainNet,
  location: state.fileLocation.location,
  presets: state.details.presets,
  requestorMaxPrice: state.price.requestorMaxPrice,
  task: state.create.task,
  taskInfo: state.details.detail,
  testStatus: state.details.test_status,
  gasInfo: state.details.gasInfo,
  concentSwitch: state.concent.concentSwitch,
  minPerf: state.performance.multiplier
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export class TaskDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDefaultResolutionApplied: false,
      modalData: null,
      isDepositTimeApplied: false,
      //INPUTS
      compositing: false,
      concent: props.concentSwitch,
      resolution: [NaN, NaN],
      frames: '',
      format: '',
      formatIndex: 0,
      output_path: props.location,
      compute_on: 'cpu',
      samples: 0,
      timeout: '',
      subtasks_count: 1,
      subtask_warning: null,
      maxSubtasks: 0,
      subtask_timeout: '',
      bid: props.requestorMaxPrice / ETH_DENOM,
      //CUSTOM
      editTaskName: false,
      taskName: props.task?.name,
      testLock: false,
      presetList: [],
      savePresetLock: true,
      presetModal: false,
      taskSummaryModal: {
        status: false,
        data: {}
      },
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
    };
  }

  componentDidMount() {
    const {
      match,
      actions,
      task,
      presets,
      location,
      requestorMaxPrice
    } = this.props;

    actions.setEstimatedCost(0);
    actions.getTaskPresets(task.type);
    this.refs.bidRef.value = requestorMaxPrice / ETH_DENOM;

    if (!!this.refs.taskTimeout && !!this.refs.subtaskTimeout) {
      this._setTimeStamp();
    }

    this.refs.outputPath.value = location;
    this._handleLocalRender();

    this.frameHintNum = Math.floor(Math.random() * hints.frame.length);

    var elements = document.getElementsByTagName('input');
    var ariaKeys = Array.from(elements).map(elm =>
      elm.getAttribute('aria-label')
    );
    this.interactedInputObject = zipObject(
      ariaKeys,
      new Array(ariaKeys.length).fill(false)
    );

    document.getElementById('taskFormSubmit').addEventListener('click', () => {
      Object.keys(this.interactedInputObject).map(
        keys => (this.interactedInputObject[keys] = true)
      );
    });

    actions.getTaskGasPrice();
  }

  componentWillUnmount() {
    this.liveSubList && clearInterval(this.liveSubList);
    this.interactionTimer && clearTimeout(this.interactionTimer);
    this.reTriggerTestTimeout && clearTimeout(this.reTriggerTestTimeout);
    this.interactedInputObject = {};

    if (this.props.testStatus) {
      this.props.actions.abortTestTask();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.presets !== this.props.presets) {
      this.parsePresets(nextProps.presets);
    }

    if (
      !isEqual(nextProps.testStatus, this.props.testStatus) &&
      !isObjectEmpty(nextProps.testStatus.more) &&
      !this.state.defaultSettingsModal
    ) {
      this.setState({
        defaultSettingsModal: true
      });
    }

    if (
      !isEqual(nextProps.task.resources, this.props.task.resources) &&
      nextProps.task.resources !== undefined &&
      this.props.task.resources !== undefined
    ) {
      this.reTriggerTestTimeout = setTimeout(
        () => this._handleLocalRender(),
        2000
      );
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      subtasks_count,
      subtask_timeout,
      bid,
      savePresetLock,
      resolution,
      maxSubtasks,
      frames,
      samples
    } = this.state;
    const { actions, task } = this.props;
    if (
      !!nextState.subtasks_count &&
      !!nextState.subtask_timeout &&
      !!nextState.bid &&
      (nextState.subtasks_count !== subtasks_count ||
        nextState.subtask_timeout !== subtask_timeout ||
        nextState.bid !== bid)
    ) {
      actions.getEstimatedCost({
        type: task.type,
        options: {
          price: new BigNumber(nextState.bid)
            .multipliedBy(ETH_DENOM)
            .toString(), //wei
          subtasks_count: Number(nextState.subtasks_count),
          subtask_timeout: floatToHR(nextState.subtask_timeout)
        }
      });
    }

    if (nextState.resolution !== resolution) {
      this.isPresetFieldsFilled(nextState).then(this.changePresetLock);
      this._calcMaxSubtaskAmount.call(this, nextState);
    }

    if (nextState.frames !== frames || nextState.samples !== samples) {
      this.isPresetFieldsFilled(nextState).then(this.changePresetLock);
      this._calcMaxSubtaskAmount.call(this, nextState);
    }

    var elements = document.getElementsByTagName('input');
    Array.from(elements).forEach(element => {
      element.checkValidity();
      if (element.validity.valid) element.classList.remove('invalid');
      return element.validity.valid;
    });

    once(this._activateValidation());
  }

  _activateValidation() {
    if (document.addEventListener) {
      document.addEventListener(
        'invalid',
        e => {
          if (this.interactedInputObject[e.target.getAttribute('aria-label')])
            e.target.classList.add('invalid');
        },
        true
      );
    }
  }

  /**
   * [calcMaxSubtaskAmount function calculates maximum possible subtask amount for the given  task parameters]
   * @param  {Number}     y       [y axis of the resolution]
   * @param  {String}     frame   [frame pattern of the task]
   * @return {Number}             [maximum subtask amount]
   */
  _calcMaxSubtaskAmount(nextState) {
    const { resolution, frames } = nextState;
    const y = resolution[1];
    let maxSubtasks;

    if (!y) return;

    if (this.props.task.type.includes(taskType.BLENDER)) {
      if (!frames) return;

      const frameAmount = calculateFrameAmount(frames);
      maxSubtasks = Math.max(
        Math.floor(y / Math.max((y / 100) * 3, 8 + (y / 100) * 2)) *
          frameAmount,
        1
      );
    } else {
      maxSubtasks = 100;
    }

    const subtaskValue = Math.min(maxSubtasks, this.state.subtasks_count);

    this.setState({
      maxSubtasks,
      subtasks_count: subtaskValue,
      subtask_warning: `Max. subtask limit updated as ${maxSubtasks} based on resolution and frame amount`
    });

    this.refs.subtaskCount.value = subtaskValue;
  }

  _convertPriceAsHR(price = 0, suffix, fixTo = 2, font_size) {
    let priceLength = parseInt(price).toString().length;
    let fontSize =
      price.toFixed(fixTo).toString().length > 4
        ? font_size / 1.7 + 'pt'
        : font_size + 'pt';

    if (priceLength < 5) {
      return (
        <span
          className={`estimated-price ${suffix}`}
          style={{ fontSize: fontSize }}>
          {price.toFixed(fixTo)}
        </span>
      );
    }
    let firstDigit = parseInt(price) / 10 ** (priceLength - 1);
    let firstDigitLength = firstDigit.toString().length;
    return (
      <span
        className={`estimated-price ${suffix}`}
        style={{ fontSize: fontSize }}>
        {firstDigitLength > 3 ? '~' + firstDigit.toFixed(2) : firstDigit}
        <small>x</small>
        10
        <sup>{priceLength - 1}</sup>
      </span>
    );
  }

  _setTimeStamp() {
    const options = Object.freeze({
      durationFormat: 'dd:hh:mm:ss',
      max: 60 * 60 * 24 * 2,
      value: 0, // initial value of input in seconds.
      useAbbr: true, // configure the separator to not be ':'
      abbr: {
        // pass in custom separator (with trailing space if desired)
        dd: 'days ',
        hh: 'h ',
        mm: 'm ',
        ss: 's'
      }
    });
    this.taskTimeoutInput = TimeSelection(this.refs.taskTimeout, options);
    this.refs.taskTimeout.setCustomValidity(TIME_VALIDITY_NOTE);
    this.subtaskTaskTimeoutInput = TimeSelection(
      this.refs.subtaskTimeout,
      options
    );
    this.refs.subtaskTimeout.setCustomValidity(TIME_VALIDITY_NOTE);
    this.refs.subtaskTimeout.disabled = true;
  }

  /**
   * [parsePresets parses preset object from redux store to the array as state]
   * @param  {Object}     presets     [Task preset object]
   */
  parsePresets(presets) {
    let presetList = [];
    Object.keys(presets).forEach(item => {
      presetList.push({
        name: item,
        value: presets[item]
      });
    });
    this.setState({
      presetList
    });
  }

  /**
   * [changePresetLock func. enables\disables save preset button]
   * @param  {boolean} result [form validity result]
   */
  changePresetLock = result => {
    this.setState({
      savePresetLock: !result
    });
  };

  /**
   * [checkInputValidity func. checks if given input valid]
   * @param  {Event}  e
   */
  checkInputValidity(e) {
    e.target.checkValidity();
    if (e.target.validity.valid) e.target.classList.remove('invalid');
    return e.target.validity.valid;
  }

  /**
   * [_handleResolution func. updates resolution state with given input]
   * @param  {Number}     index   [Index of resolution list]
   * @param  {Event}      e
   */
  _handleResolution(index, e) {
    this.interactionTimer && clearTimeout(this.interactionTimer);
    this.interactedInputObject[e.target.getAttribute('aria-label')] = true;
    let res = this.state.resolution;
    let newRes = [...res]; //keep state immutable
    newRes[index] = parseInt(e.target.value);

    this.interactionTimer = setTimeout(() => {
      this.setState({
        resolution: newRes
      });
    }, WAIT_INTERVAL);
  }

  /**
   * [_handleCheckbox func. updates checkbox value]
   * @param  {String}   state     name of checkbox state
   * @param  {Event}    e
   */
  _handleCheckbox(state, e) {
    this.interactedInputObject[e.target.getAttribute('aria-label')] = true;
    this.setState({
      [state]: e.target.checked
    });
  }

  /**
   * [_handleTimeoutInputs func. updtes timeout values form inputs]
   * @param  {[type]} state [Name of the state]
   * @param  {[type]} e
   */
  _handleTimeoutInputs(state, e) {
    this.interactedInputObject[e.target.getAttribute('aria-label')] = true;
    const timeoutList = Object.freeze({
      timeout: this.taskTimeoutInput,
      subtask_timeout: this.subtaskTaskTimeoutInput
    });

    /*Input will be invalid if given time is lesser than 1 min*/
    const inputTime = e.target.classList;
    if (timeoutList[state].getValue() < 60) {
      inputTime.add('invalid');
      e.target.setCustomValidity(TIME_VALIDITY_NOTE);
    } else {
      inputTime.remove('invalid');
      e.target.setCustomValidity('');
    }

    if (state === 'timeout') {
      const taskTimeoutValue = this.taskTimeoutInput.getValue();
      const subtaskTimeoutValue = this.subtaskTaskTimeoutInput.getValue();

      if (subtaskTimeoutValue > taskTimeoutValue) {
        this.subtaskTaskTimeoutInput.setValue(taskTimeoutValue);
      }

      this.subtaskTaskTimeoutInput.max = taskTimeoutValue + 1; // including value itself
      this.refs.subtaskTimeout.disabled = !(taskTimeoutValue > 0);
    }

    this.setState({
      [state]: timeoutList[state].getValue() / 3600
    });
  }

  /**
   * [_handleFormInputs func. updtes all the rest form inputs]
   * @param  {Any}    state   [Name of the state]
   * @param  {Event}  e
   */
  _handleFormInputs(state, e) {
    this.interactedInputObject[e.target.getAttribute('aria-label')] = true;
    if (this.checkInputValidity(e)) {
      this.setState({
        [state]: e.target.value
      });
    } else if (
      !this.state.savePresetLock &&
      (state === 'frames' || state === 'sample_per_pixel') &&
      !this.checkInputValidity(e)
    ) {
      this.setState({
        [state]: null,
        savePresetLock: true
      });
    }
  }

  /**
   * [_handlePresetOptionChange func. updates task preset dropdown changes]
   * @param  {Array}      list    [List of the task presets]
   * @param  {String}     name    [Name of selected preset]
   */
  _handlePresetOptionChange(list, name) {
    function _isArrayEqual(arr1, arr2) {
      return arr1.toString() === arr2.toString(); //String representation hack
    }

    const result = list.filter((item, index) => item.name == name)[0];
    const preset = { ...result, value: { ...result.value } }; // immutable

    if (!preset) return;

    const { resolution } = preset.value;
    const { resolutionW, resolutionH } = this.refs;
    if (
      this.state.isDefaultResolutionApplied &&
      !_isArrayEqual([resolutionW.value, resolutionH.value], resolution)
    )
      this._askForNewResolutionChange(preset);
    else this._applyPresetOption(preset, true, false);
  }

  _askForNewResolutionChange(preset) {
    this.setState({
      resolutionChangeModal: true,
      resolutionChangeInfo: preset
    });
  }

  _applyPresetOption = (
    preset,
    isResolutionIncluded = true,
    applyStates = true
  ) => {
    const { format, frames, output_path, resolution, samples } = preset.value; //compositing,
    const {
      resolutionW,
      resolutionH,
      framesRef,
      formatRef,
      outputPath,
      haltspp
    } = this.refs; //compositingRef,

    if (isResolutionIncluded) {
      resolutionW.value = resolution[0];
      resolutionH.value = resolution[1];

      haltspp.value = samples;

      if (applyStates)
        this.setState({
          isDefaultResolutionApplied: false,
          resolutionChangeInfo: []
        });
    } else {
      delete preset.value.resolution;
      delete preset.value.samples;
    }

    // If  file format from preset list is not available on mockFormatList, use first element as default
    const pickFormatIndex = mockFormatList
      .map(item => item.name)
      .indexOf(format);
    const formatIndex = pickFormatIndex > -1 ? pickFormatIndex : 0;

    if (pickFormatIndex > -1) {
      formatRef.value = format;
    } else {
      preset.value.format = formatRef.value = mockFormatList[0].name;
    }

    outputPath.value = output_path;

    if (this.props.task.type.includes(taskType.BLENDER)) {
      framesRef.value = frames;
      //compositingRef.checked = compositing
    }

    this.setState({ ...preset.value, formatIndex });
  };

  /**
   * [_handleFormatOptionChange func.  updates format dropdown changes]
   * @param  {Array}      list    [List of formats]
   * @param  {String}     name    [Name of selected format]
   */
  _handleFormatOptionChange(list, formatName, index) {
    let result = list.filter((item, index) => item.name === formatName)[0];
    result &&
      result.name &&
      this.setState({
        format: result.name,
        formatIndex: index
      });
  }

  _handleComputeOnOptionChange = e => {
    this.setState({
      compute_on: e.target.value
    });
  };

  /**
   * [_handleSavePresetModal func. sends custom preset data to modal and makes modal visible]
   */
  _handleSavePresetModal = () => {
    const {
      resolution,
      frames,
      format,
      output_path,
      compositing,
      samples
    } = this.state;
    this.setState({
      presetModal: true,
      modalData: {
        resolution,
        frames,
        format,
        output_path,
        samples,
        compositing,
        task_type: this.props.task.type
      }
    });
  };

  /**
   * [_handlePresetSave func.]
   * @param  {String} preset_name [Name of the custom preset]
   * @param  {Object} data        [Custom preset object]
   */
  _handlePresetSave = (preset_name, data) => {
    this.props.actions.saveTaskPreset({
      preset_name,
      task_type: this.props.task.type,
      data
    });
  };

  _applyDefaultPreset = () => {
    const {
      resolution,
      file_format,
      samples
    } = this.props.testStatus.more.after_test_data;

    const { resolutionW, resolutionH, formatRef, haltspp } = this.refs;
    const format = file_format.replace('.', '').toUpperCase();

    // If taken file format from input file is not available on mockFormatList, use first element as default
    const pickFormatIndex = mockFormatList
      .map(item => item.name)
      .indexOf(format);
    const formatIndex = pickFormatIndex > -1 ? pickFormatIndex : 0;

    resolutionW.value = resolution[0];
    resolutionH.value = resolution[1];
    formatRef.value = pickFormatIndex > -1 ? format : mockFormatList[0].name;
    haltspp.value = samples;

    this.setState({
      resolution,
      format: formatRef.value,
      formatIndex,
      isDefaultResolutionApplied: true,
      samples
    });

    this._closeModal('defaultSettingsModal');
  };

  /**
   * _save Task Name func. will replace current task name with newest one
   *
   * @description The name trimmed, and checked with task name schema, which will
   * let user put min 4, max 24 char task name
   *
   * @param  {Event} event [DOM Event]
   * @return n/a
   */
  _saveTaskName = event => {
    if (event.key && event.key !== 'Enter') return;
    if (event.key === 'Enter') event.preventDefault();

    const nameInput = document.getElementById('taskNameInput');
    const newName = nameInput.value.trim();

    nameSchema.isValid(newName).then(result => {
      if (result) {
        this.setState({
          taskName: newName
        });
        this._editTaskName();
      } else {
        nameInput.reportValidity();
        nameInput.classList.add('invalid');
      }
    });
  };

  /**
   * _editTaskName to trigger edit input visibility
   * @return n/a
   */
  _editTaskName = () =>
    this.setState(prev => ({ editTaskName: !prev.editTaskName }));

  /**
   * [_closeModal func. closes all modals]
   */
  _closeModal = _modal => this.setState({ [_modal]: false });

  /**
   * [_handleOutputPath func. opens file chooser dialog and updates output path of that task]
   */
  _handleOutputPath = () => {
    let onFolderHandler = data => {
      if (data) {
        this.setState(
          {
            output_path: data[0]
          },
          () => {
            this.refs.outputPath.value = data[0];
          }
        );
      }
    };

    dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      onFolderHandler
    );
  };

  _handleConfirmationModal = () => {
    const { actions, task, estimated_cost } = this.props;
    const {
      bid,
      compositing,
      compute_on,
      concent,
      frames,
      format,
      output_path,
      resolution,
      samples,
      subtasks_count,
      subtask_timeout,
      taskName,
      timeout
    } = this.state;
    this._handleDryRun().then(result => {
      const [suggested, _] = result;
      let obsoletePrice = null;
      const diff = deepDiff(
        {
          subtasks_count: Number(subtasks_count)
        },
        suggested,
        false
      );
      //keep old price and update subtask count state
      if (!isObjectEmpty(diff)) {
        obsoletePrice = estimated_cost.GNT;
        this.setState({
          subtasks_count: suggested.subtasks_count
        });
        this.refs.subtaskCount.value = suggested.subtasks_count;
      }
      actions.getEstimatedCost({
        type: task.type,
        options: {
          price: new BigNumber(bid).multipliedBy(ETH_DENOM).toString(), //wei
          subtasks_count: Number(suggested.subtasks_count),
          subtask_timeout: floatToHR(subtask_timeout)
        }
      });
      this.setState({
        taskSummaryModal: {
          status: true,
          data: {
            diff,
            obsoletePrice
          }
        }
      });
    });
  };

  _handleDryRun() {
    const {
      bid,
      compositing,
      compute_on,
      concent,
      frames,
      format,
      output_path,
      resolution,
      samples,
      subtasks_count,
      subtask_timeout,
      taskName,
      timeout
    } = this.state;
    const { task, testStatus } = this.props;
    return new Promise((resolve, reject) => {
      this.props.actions.dryRunTask(
        {
          ...task,
          name: taskName,
          bid,
          compute_on,
          concent_enabled: concent,
          estimated_memory: testStatus && testStatus.estimated_memory,
          subtasks_count: Number(subtasks_count),
          subtask_timeout: floatToHR(subtask_timeout),
          timeout: floatToHR(timeout),
          options: {
            frames,
            format,
            compositing,
            output_path,
            resolution,
            ...(samples > 0 && { samples: Number(samples) })
          }
        },
        resolve,
        reject
      );
    });
  }

  /**
   * [_handleStartTaskButton func. creates task with given task information, then it redirects users to the tasks screen]
   */
  _handleStartTaskButton = () => {
    const { gasInfo } = this.props;
    const { concent, depositTimeModal, isDepositimeApplied } = this.state;

    if (
      !isDepositimeApplied &&
      concent &&
      gasInfo &&
      gasInfo.current_gas_price.isGreaterThan(gasInfo.gas_price_limit)
    ) {
      this.setState({
        depositTimeModal: true
      });
      return false;
    }

    this._nextStep = true;
    this.setState({
      loadingTaskIndicator: true
    });
    this._createTaskAsync().then(result => {
      if (result && !result[1]) {
        window.routerHistory.push('/tasks');
      } else {
        console.log('Task creation failed!');
        this.setState({
          insufficientAmountModal: {
            result: !!result[1],
            message: result[1]
          },
          loadingTaskIndicator: false
        });
      }
    });
  };

  _handleLocalRender = () => {
    const { actions, task } = this.props;
    const { compute_on } = this.state;
    const { resources, type, name } = task;
    actions.runTestTask({
      name,
      resources,
      compute_on,
      type,
      subtasks_count: 1 // <--- HARDCODED
    });
  };

  _createTaskAsync() {
    const {
      bid,
      compositing,
      compute_on,
      concent,
      frames,
      format,
      output_path,
      resolution,
      samples,
      subtasks_count,
      subtask_timeout,
      taskName,
      timeout
    } = this.state;
    const { task, testStatus } = this.props;

    return new Promise((resolve, reject) => {
      this.props.actions.createTask(
        {
          ...task,
          name: taskName,
          bid,
          compute_on,
          concent_enabled: concent,
          estimated_memory: testStatus && testStatus.estimated_memory,
          subtasks_count: Number(subtasks_count),
          subtask_timeout: floatToHR(subtask_timeout),
          timeout: floatToHR(timeout),
          options: {
            frames,
            format,
            compositing,
            output_path,
            resolution,
            ...(samples > 0 && { samples: Number(samples) })
          }
        },
        resolve,
        reject
      );
    });
  }

  _createTaskOnHighGas = isConcentOn => {
    this.setState(
      {
        concent: isConcentOn,
        isDepositTimeApplied: true
      },
      this._handleStartTaskButton
    );
  };

  _createTaskConditionally = isConcentOn => {
    this.setState(
      {
        concent: isConcentOn
      },
      this._handleStartTaskButton
    );
  };

  /**
   * [_handleManagePresetModal func. will trigger managePresetModal state to make manage preset modal visible]
   */
  _handleManagePresetModal = () => {
    this.setState({
      managePresetModal: true
    });
  };

  _toggleTestLock = result => {
    this.setState({
      testLock: result
    });
  };

  _getPanelClass(testStatus) {
    return this._checkTestStatus(testStatus);
  }

  isPresetFieldsFilled(nextState) {
    const { resolution, frames, samples, compositing, format } = nextState;
    return presetSchema[this.props.task.type].isValid({
      resolution,
      frames,
      samples,
      compositing,
      format
    });
  }

  _handleFormByType(type) {
    const {
      modalData,
      resolution,
      frames,
      formatIndex,
      output_path,
      timeout,
      subtasks_count,
      maxSubtasks,
      subtask_timeout,
      bid,
      compositing,
      presetList,
      savePresetLock,
      presetModal,
      managePresetModal
    } = this.state;
    const { testStatus } = this.props;
    let formTemplate = [
      {
        order: 0,
        content: (
          <div className="item-settings" key="0">
            <InfoLabel
              type="span"
              label="Preset"
              info={
                <p className="tooltip_task">
                  Create and manage a number of presets to simplify the process
                  of rendering with Golem.
                  <br />
                  Create presets for commonly used sizes, frame ranges.
                </p>
              }
              cls="title"
              infoHidden={true}
            />
            <Dropdown
              list={presetList}
              handleChange={this._handlePresetOptionChange.bind(
                this,
                presetList
              )}
              manageHandler={this._handleManagePresetModal}
              presetManager
            />
          </div>
        )
      },
      {
        order: 1,
        content: (
          <div className="item-settings" key="1">
            <InfoLabel
              type="span"
              label="Resolution"
              info={
                <p className="tooltip_task">
                  Set width & height of your scene.
                </p>
              }
              cls="title"
              infoHidden={true}
            />
            <input
              ref="resolutionW"
              type="number"
              min="100"
              max="8000"
              aria-label="Dimension (width)"
              onChange={this._handleResolution.bind(this, 0)}
              required
            />
            <span className="icon-cross" />
            <input
              ref="resolutionH"
              type="number"
              min="100"
              max="8000"
              aria-label="Dimension (height)"
              onChange={this._handleResolution.bind(this, 1)}
              required
            />
          </div>
        )
      },
      {
        order: 3,
        content: (
          <div className="item-settings" key="3">
            <InfoLabel
              type="span"
              label="Format"
              info={
                <p className="tooltip_task">
                  For Blender supported formats are .png, .tga, .exr, .jpeg and
                  .bmp.
                </p>
              }
              cls="title"
              infoHidden={true}
            />
            <Dropdown
              ref="formatRef"
              list={mockFormatList}
              selected={formatIndex}
              handleChange={this._handleFormatOptionChange.bind(
                this,
                mockFormatList
              )}
            />
          </div>
        )
      },
      {
        order: 4,
        content: (
          <div className="item-settings" key="4">
            <InfoLabel
              type="span"
              label="Output to"
              info={
                <p className="tooltip_task">
                  If you define output as: ~/project/output_file_####.png
                  <br />
                  then frames ~/project/output_file_0001.png, etc. will be
                  created.
                </p>
              }
              cls="title"
              infoHidden={true}
            />
            <input
              ref="outputPath"
              type="text"
              placeholder="…Docs/Golem/Output"
              aria-label="Output path"
              disabled
            />
            <button
              type="button"
              className="btn--outline"
              onClick={this._handleOutputPath}>
              Change
            </button>
          </div>
        )
      },
      {
        order: 6,
        content: (
          <div className="item-settings item__preset-button" key="6">
            <button
              type="button"
              className="btn--outline"
              onClick={this._handleSavePresetModal}
              disabled={savePresetLock}>
              Save as preset
            </button>
          </div>
        )
      }
    ];

    switch (type) {
      case taskType.BLENDER:
      case taskType.BLENDER_NVGPU:
        formTemplate.push({
          order: 2,
          content: (
            <div className="item-settings" key="2">
              <InfoLabel
                type="span"
                label="Frame Range"
                info={
                  <p className="tooltip_task">
                    Define frames to render. You can separate frame numbers
                    <br />
                    with ; e.g. 1;4;7 will define frame 1, 4 and 7. You can also
                    define frames ranges with "-" character.{' '}
                    <a href="https://docs.golem.network/#/Products/Brass-Beta/Being-a-Requestor?id=render-settings">
                      Learn more
                    </a>
                  </p>
                }
                cls="title"
                infoHidden={true}
                interactive={true}
              />
              <input
                ref="framesRef"
                type="text"
                aria-label="Frame Range"
                placeholder={hints.frame[this.frameHintNum]}
                pattern="^[0-9]?(([0-9\s;,-]*)[0-9])$"
                onChange={this._handleFormInputs.bind(this, 'frames')}
                required
              />
            </div>
          )
        });
        formTemplate.push({
          order: 5,
          content: (
            <div className="item-settings" key="5">
              <InfoLabel
                type="span"
                label="Sample per pixel"
                info={
                  <p className="tooltip_task">
                    Set your file
                    <br /> settings.
                  </p>
                }
                cls="title"
                infoHidden={true}
              />
              <input
                ref="haltspp"
                type="number"
                placeholder="Type a number"
                min="1"
                max="2000"
                aria-label="Sample per pixel"
                onChange={this._handleFormInputs.bind(this, 'samples')}
              />
            </div>
          )
        });
        break;
    }

    let sortByOrder = (a, b) => a.order - b.order;

    return formTemplate.sort(sortByOrder).map(item => item.content);
  }

  _fetchRadioOptions = type => {
    let computeOnRadioOptions = {};

    computeOnRadioOptions['onChange'] = this._handleComputeOnOptionChange;
    computeOnRadioOptions['defaultChecked'] = this.state.compute_on === type;

    return computeOnRadioOptions;
  };

  render() {
    const {
      bid,
      compute_on,
      concent,
      defaultSettingsModal,
      editTaskName,
      insufficientAmountModal,
      loadingTaskIndicator,
      managePresetModal,
      maxSubtasks,
      modalData,
      presetModal,
      taskSummaryModal,
      depositTimeModal,
      resolutionChangeInfo,
      resolutionChangeModal,
      subtask_warning,
      taskName,
      testLock
    } = this.state;

    const {
      actions,
      currency,
      concentSwitch, //from settings
      estimated_cost,
      isMainNet,
      minPerf,
      task,
      testStatus
    } = this.props;
    return (
      <div>
        <form
          id="taskForm"
          onSubmit={this._handleConfirmationModal}
          className="content__task-detail">
          <TestResult
            testStatus={testStatus}
            task={task}
            actions={actions}
            toggleTestLock={this._toggleTestLock}
          />
          <section className="section-details__task-detail">
            <div className="container__task-detail">
              <div className="section-settings__task-detail">
                <InfoLabel
                  type="h4"
                  label=" File Settings"
                  info={
                    <p className="tooltip_task">
                      Set your file settings, and if you
                      <br />
                      have any questions just hover over
                      <br />
                      specific label to find some help.
                    </p>
                  }
                />
                <div className="file-information">
                  <div className="source-path">
                    <b>Name: </b>
                    {!editTaskName ? (
                      <span>
                        <span className="file-item">{taskName}</span>
                        <span
                          className="action__edit-name"
                          onClick={this._editTaskName}>
                          <span className="icon-pencil" />
                          Edit
                        </span>
                      </span>
                    ) : (
                      <span>
                        <input
                          type="text"
                          id="taskNameInput"
                          aria-label="Task Name"
                          pattern="^[a-zA-Z0-9_\-\.]+( [a-zA-Z0-9_\-\.]+)*$"
                          minLength={4}
                          maxLength={24}
                          onKeyPress={this._saveTaskName}
                          defaultValue={taskName}
                          autoFocus
                          required
                        />
                        <span
                          className="action__save-name"
                          onClick={this._saveTaskName}>
                          <span className="icon-confirmation" />
                          Save
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="source-path">
                    <b>Path: </b>
                    <span className="file-item">{task.relativePath}</span>
                  </div>
                </div>
                {this._handleFormByType(
                  this.state.type || this.props.task.type
                )}
              </div>
              <div className="section-task__task-detail">
                <InfoLabel
                  type="h4"
                  label=" Task Settings"
                  info={
                    <p className="tooltip_task">
                      Depending on your settings related to price and trust,
                      <br />
                      it may take a while for your task to be accepted by the
                      network.
                    </p>
                  }
                />
                <div className="item-settings">
                  <InfoLabel
                    type="span"
                    label="Task Timeout"
                    info={
                      <p className="tooltip_task">
                        Setting a time limit here will let Golem know the
                        maximum time
                        <br />
                        you will wait for a task to be accepted by the network.{' '}
                        <a href="https://docs.golem.network/#/Products/Brass-Beta/Being-a-Requestor?id=task-and-subtask-timeouts">
                          Learn more
                        </a>
                      </p>
                    }
                    cls="title"
                    infoHidden={true}
                    interactive={true}
                  />
                  <input
                    ref="taskTimeout"
                    type="text"
                    aria-label="Task Timeout"
                    onKeyDown={this._handleTimeoutInputs.bind(this, 'timeout')}
                    required
                  />
                </div>
                <div className="item-settings">
                  <InfoLabel
                    type="span"
                    label="Subtask Amount"
                    info={
                      <p className="tooltip_task">
                        Tells the system how many subtasks to break a task into.
                        <br />
                        If you are rendering a number of frames you should set
                        subtasks to the same number.{' '}
                        <a href="https://docs.golem.network/#/Products/Brass-Beta/Being-a-Requestor?id=task-and-subtask-timeouts">
                          Learn more
                        </a>
                      </p>
                    }
                    cls="title"
                    infoHidden={true}
                    interactive={true}
                  />
                  <input
                    ref="subtaskCount"
                    type="number"
                    min="1"
                    placeholder="Type a number"
                    aria-label="Subtask amount"
                    onChange={this._handleFormInputs.bind(
                      this,
                      'subtasks_count'
                    )}
                    required
                  />
                </div>
                <div className="item-settings">
                  <InfoLabel
                    type="span"
                    label="Subtask Timeout"
                    info={
                      <p className="tooltip_task">
                        Set the maximum time you are prepared to wait for a
                        subtask to complete.
                      </p>
                    }
                    cls="title"
                    infoHidden={true}
                  />
                  <input
                    ref="subtaskTimeout"
                    type="text"
                    aria-label="Subtask Timeout"
                    onKeyDown={this._handleTimeoutInputs.bind(
                      this,
                      'subtask_timeout'
                    )}
                    required
                  />
                </div>
                <div className="item-settings">
                  <InfoLabel
                    type="span"
                    label="Render on"
                    info={
                      <p className="tooltip_task">
                        Select if you want your task to be rendered on CPU or
                        GPU of providers. GPU support is still in beta. Contact
                        us if you find any issues with GPU rendering.{' '}
                        <a href="https://golem.network/documentation/">
                          Learn more
                        </a>
                      </p>
                    }
                    cls="title"
                    infoHidden={true}
                  />
                  <div className="render-on__radio-group">
                    <div>
                      <input
                        type="radio"
                        id="cpu"
                        value="cpu"
                        name="compute_on"
                        {...this._fetchRadioOptions('cpu')}
                      />
                      <label htmlFor="cpu">
                        <span className="overlay" />
                        <span className="icon-cpu" />
                        CPU
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="gpu"
                        value="gpu"
                        name="compute_on"
                        {...this._fetchRadioOptions('gpu')}
                      />
                      <label htmlFor="gpu">
                        <span className="overlay" />
                        <span className="icon-gpu" />
                        GPU
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {concentSwitch && (
                <div className="section-concent__task-detail">
                  <InfoLabel
                    type="h4"
                    label="Concent"
                    info={
                      <p className="tooltip_task">
                        If you set the switch to off this task
                        <br />
                        will compute without Concent
                        <br />
                        but only for this task. It will not
                        <br />
                        turn Concent off for all tasks.
                      </p>
                    }
                    cls="title-concent__task-detail"
                  />
                  <div className="item-concent">
                    <InfoLabel
                      type="span"
                      label="Set"
                      cls="title"
                      infoHidden={true}
                    />
                    <div className="switch-box switch-box--green">
                      <span className="switch-label switch-label--left">
                        Off
                      </span>
                      <label className="switch">
                        <input
                          ref="concentRef"
                          type="checkbox"
                          aria-label="Task Based Concent Checkbox"
                          tabIndex="0"
                          checked={concent}
                          onChange={this._handleCheckbox.bind(this, 'concent')}
                        />
                        <div className="switch-slider round" />
                      </label>
                      <span className="switch-label switch-label--right">
                        On
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="section-price__task-detail">
                <InfoLabel
                  type="h4"
                  label="Price"
                  info={
                    <p className="tooltip_task">
                      Set the amount
                      <br />
                      of GNT that you
                      <br />
                      are prepared to
                      <br />
                      pay for this task.
                    </p>
                  }
                  cls="title-price__task-detail"
                />
                <div className="item-price">
                  <InfoLabel
                    type="span"
                    label="Your bid"
                    info={
                      <p className="tooltip_task">
                        Set the amount of GNT that you are prepared to pay for
                        this task.
                        <br />
                        This is a free market, and you should set the price as
                        you will but we think that keeping close to 0.2$ is OK.
                      </p>
                    }
                    cls="title"
                    infoHidden={true}
                  />
                  <div className="input__price-set">
                    <input
                      ref="bidRef"
                      type="number"
                      min="0.01"
                      max={Number.MAX_SAFE_INTEGER}
                      step="0.01"
                      aria-label="Your bid"
                      onChange={this._handleFormInputs.bind(this, 'bid')}
                      required
                    />
                    <span>{isMainNet ? ' ' : ' t'}GNT/h</span>
                  </div>
                  <div className="estimated_usd">
                    <span>
                      est. {isMainNet ? '' : 't'}$
                      {this._convertPriceAsHR(
                        bid * currency['GNT'],
                        'USD',
                        2,
                        12
                      )}
                    </span>
                  </div>
                </div>
                <div className="estimated-price__panel">
                  <div className="item-price">
                    <InfoLabel
                      type="span"
                      label="Task fee"
                      info={
                        <p className="tooltip_task">
                          The estimated price that you’ll have to pay to render
                          the task is based on
                          <br />
                          Your bid, subtask amount and timeout settings. Fiat
                          value may change during computation as well as gas
                          price.
                          <a href="https://docs.golem.network/#/Products/Brass-Beta/Being-a-Requestor?id=pricing-best-practices">
                            Learn more
                          </a>
                        </p>
                      }
                      cls="title"
                      infoHidden={true}
                      interactive={true}
                    />
                    <div className="estimated_cost">
                      {this._convertPriceAsHR(estimated_cost.GNT, 'GNT', 3, 36)}
                      <span>{isMainNet ? ' ' : ' t'}GNT</span>
                    </div>
                    <div className="estimated_usd">
                      <span>
                        est. {isMainNet ? '' : 't'}$
                        {this._convertPriceAsHR(
                          (estimated_cost.GNT || 0) * currency['GNT'],
                          'USD',
                          4,
                          12
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="item-price">
                    <InfoLabel
                      type="span"
                      label="Tx fee lock"
                      info={
                        <p className="tooltip_task">
                          Estimated ETH amount to be locked for this task to
                          cover
                          <br />
                          transaction costs. It may vary from what you will
                          actually pay for
                          <br />
                          this transaction as usually the final cost is much
                          lower.
                        </p>
                      }
                      cls="title"
                      infoHidden={true}
                    />
                    <div className="estimated_cost">
                      {this._convertPriceAsHR(estimated_cost.ETH, 'ETH', 5, 18)}
                      <span>{isMainNet ? ' ' : ' t'}ETH</span>
                    </div>
                    <div className="estimated_usd">
                      <span>
                        est. {isMainNet ? '' : 't'}$
                        {this._convertPriceAsHR(
                          (estimated_cost.ETH || 0) * currency['ETH'],
                          'USD',
                          4,
                          12
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {concent && (
                  <div className="estimated-deposit__panel">
                    <div className="item-price">
                      <InfoLabel
                        type="span"
                        label="Deposit payment"
                        info={
                          <p className="tooltip_task">
                            The deposit amount is higher than the cost of task
                            to ensure that you
                            <br />
                            have enough funds to participate in the network. The
                            real cost
                            <br />
                            of a task is unchanging. Providers using Concent
                            Service will
                            <br />
                            check if requestors have no less than twice the
                            amount
                            <br />
                            of funds in their Deposit for covering a task
                            payment.
                          </p>
                        }
                        cls="title"
                        infoHidden={true}
                        interactive={true}
                      />
                      <div className="estimated_cost">
                        {this._convertPriceAsHR(
                          estimated_cost.deposit.GNT_suggested,
                          'GNT',
                          3,
                          14
                        )}
                        <span>{isMainNet ? ' ' : ' t'}GNT</span>
                      </div>
                      <div className="estimated_usd">
                        <span>
                          est. {isMainNet ? '' : 't'}$
                          {this._convertPriceAsHR(
                            (estimated_cost.deposit.GNT_suggested || 0) *
                              currency['GNT'],
                            'USD',
                            4,
                            14
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="item-price">
                      <InfoLabel
                        type="span"
                        label="Deposit Tx fee"
                        info={
                          <p className="tooltip_task">
                            You need small amount of ETH (used for gas)
                            avaliable on your account
                            <br />
                            to submit a deposit to the Concent Service
                          </p>
                        }
                        cls="title"
                        infoHidden={true}
                        interactive={true}
                      />
                      <div className="estimated_cost">
                        {this._convertPriceAsHR(
                          estimated_cost.deposit.ETH,
                          'ETH',
                          5,
                          14
                        )}
                        <span>{isMainNet ? ' ' : ' t'}ETH</span>
                      </div>
                      <div className="estimated_usd">
                        <span>
                          est. {isMainNet ? '' : 't'}$
                          {this._convertPriceAsHR(
                            (estimated_cost.deposit.ETH || 0) * currency['GNT'],
                            'USD',
                            5,
                            14
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <span className="item-price tips__price">
                  You can accept the estimated price or you can bid higher if
                  you would like to increase your chances of quicker processing.
                </span>
              </div>
            </div>
          </section>
          <section className="section-action__task-detail">
            <Link to="/tasks" aria-label="Cancel" tabIndex="0">
              <span>Cancel</span>
            </Link>
            <button
              id="taskFormSubmit"
              type="submit"
              className="btn--primary"
              disabled={testLock || loadingTaskIndicator}>
              Start Task
            </button>
          </section>
        </form>
        {presetModal && (
          <PresetModal
            closeModal={this._closeModal}
            saveCallback={this._handlePresetSave}
            {...modalData}
          />
        )}
        {managePresetModal && (
          <ManagePresetModal closeModal={this._closeModal} />
        )}
        {depositTimeModal && (
          <DepositTimeModal
            closeModal={this._closeModal}
            createTaskOnHighGas={this._createTaskOnHighGas}
          />
        )}
        {defaultSettingsModal && (
          <DefaultSettingsModal
            closeModal={this._closeModal}
            applyPreset={this._applyDefaultPreset}
          />
        )}
        {taskSummaryModal.status && (
          <TaskSummaryModal
            closeModal={this._closeModal}
            _handleStartTaskButton={this._handleStartTaskButton}
            loadingTaskIndicator={loadingTaskIndicator}
            estimated_cost={estimated_cost}
            data={taskSummaryModal.data}
            minPerf={minPerf}
            isMainNet={isMainNet}
            {...this.state}
          />
        )}
        {resolutionChangeModal && (
          <ResolutionChangeModal
            closeModal={this._closeModal}
            applyPreset={this._applyPresetOption}
            info={resolutionChangeInfo}
          />
        )}
        {insufficientAmountModal && insufficientAmountModal.result && (
          <InsufficientAmountModal
            message={insufficientAmountModal.message}
            closeModal={this._closeModal}
            isMainNet={isMainNet}
            createTaskConditionally={this._createTaskConditionally}
          />
        )}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskDetail);
