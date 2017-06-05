import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, fork, takeEvery } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC, _handleSUBPUB, _handleUNSUBPUB } from './handler'


const {SET_TASKLIST, DELETE_TASK, CREATE_TASK, GET_TASK_DETAILS, SET_TASK_DETAILS, GET_TASK_PRESETS, SET_TASK_PRESETS, SAVE_TASK_PRESET, DELETE_TASK_PRESET} = dict

export function deleteTaskPreset(session, payload) {
    function on_delete_task_preset(args) {
        let deleted_task_preset = args[0];
        console.log(config.DELETE_TASK_PRESET_RPC, deleted_task_preset)
    }
    _handleRPC(on_delete_task_preset, session, config.DELETE_TASK_PRESET_RPC, [payload])
}

export function* deleteTaskPresetFlow(session, {payload}) {
    if (payload) {
        yield call(deleteTaskPreset, session, payload)
    }
}


export function saveTaskPreset(session, payload) {
    function on_create_task_preset(args) {
        let create_task_preset = args[0];
        console.log(config.SAVE_TASK_PRESET_RPC, create_task_preset)
    }
    _handleRPC(on_create_task_preset, session, config.SAVE_TASK_PRESET_RPC, [payload.preset_name, payload.task_type, payload.data])
}

export function* saveTaskPresetFlow(session, {payload}) {
    if (payload) {
        yield call(saveTaskPreset, session, payload)
    }
}

export function getTaskPresets(session, payload) {
    return new Promise((resolve, reject) => {
        function on_get_task_presets(args) {
            var task_presets = args[0];
            console.log(config.TASK_PRESETS_RPC, task_presets)
            resolve({
                type: SET_TASK_PRESETS,
                payload: task_presets
            })
        }
        console.log("PAYLOAD", payload)
        _handleRPC(on_get_task_presets, session, config.TASK_PRESETS_RPC, [payload])
    })
}

export function* getTaskPresetsFlow(session, {payload}) {
    if (payload) {
        let action = yield call(getTaskPresets, session, payload)
        console.log(action)
        yield put(action)
    }
}


export function* taskPresetBase(session) {
    yield takeEvery(GET_TASK_PRESETS, getTaskPresetsFlow, session)
    yield takeEvery(SAVE_TASK_PRESET, saveTaskPresetFlow, session)
    yield takeEvery(DELETE_TASK_PRESET, deleteTaskPresetFlow, session)
}

export function getTaskDetails(session, payload) {
    return new Promise((resolve, reject) => {
        function on_task_info(args) {
            var task_info = args[0];
            console.log(config.GET_TASK_RPC, task_info)
            resolve({
                type: SET_TASK_DETAILS,
                payload: task_info
            })
        }
        console.log("GETTASKINFO", payload)

        _handleRPC(on_task_info, session, config.GET_TASK_RPC, [payload])
    })
}

export function* taskDetailsBase(session, {type, payload}) {
    if (payload) {
        let action = yield call(getTaskDetails, session, payload)
        console.log(action)
        yield put(action)
    }
}

export function callCreateTask(session, payload) {

    function on_create_task(args) {
        var create_task = args[0];
        console.log(config.CREATE_TASK_RPC, create_task)
    }

    _handleRPC(on_create_task, session, config.CREATE_TASK_RPC, [payload])
}

export function* createTaskBase(session, {type, payload}) {
    if (payload.options) {
        console.info('TASK_CREATING')
        yield call(callCreateTask, session, payload)
    } else {
        console.info('TASK_NOT_CREATING')
    }
}


export function callDeleteTask(session, payload) {

    function on_delete_task(args) {
        var delete_task = args[0];
        console.log(config.DELETE_TASK_RPC, delete_task)
    }

    _handleRPC(on_delete_task, session, config.DELETE_TASK_RPC, [payload])
}

export function* deleteTaskBase(session, {type, payload}) {
    yield call(callDeleteTask, session, payload)
}

/**
 * [subscribeTasks func. fetches tasks with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeTasks(session) {
    return eventChannel(emit => {
        function on_tasks(args) {
            var taskList = args[0];
            emit({
                type: SET_TASKLIST,
                payload: taskList
            })
        }

        _handleSUBPUB(on_tasks, session, config.GET_TASKS_CH)


        return () => {
            console.log('negative')
            _handleUNSUBPUB(on_tasks, session, config.GET_TASKS_CH)
        }
    })
}

export function* fireBase(session) {
    const channel = yield call(subscribeTasks, session)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
        channel.close()
    }
}

/**
 * [*tasks generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* tasksFlow(session) {
    yield fork(fireBase, session);
    yield fork(taskPresetBase, session);
    yield takeEvery(DELETE_TASK, deleteTaskBase, session)
    yield takeEvery(CREATE_TASK, createTaskBase, session)
    yield takeEvery(GET_TASK_DETAILS, taskDetailsBase, session)
}