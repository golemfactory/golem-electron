import { eventChannel, buffers } from 'redux-saga';
import {
    takeLatest,
    take,
    call,
    put,
    fork,
    takeEvery
} from 'redux-saga/effects';
import { dict } from '../actions';
import checkNested from './../utils/checkNested';
import { taskStatus } from './../constants/statusDicts';

import { config, _handleRPC, _handleSUBPUB, _handleUNSUBPUB } from './handler';

const {
    BLOCK_NODE,
    SET_TASKLIST,
    DELETE_TASK,
    CREATE_TASK,
    RESTART_TASK,
    RUN_TEST_TASK,
    ABORT_TEST_TASK,
    SET_TASK_TEST_STATUS,
    GET_ESTIMATED_COST,
    SET_ESTIMATED_COST,
    GET_TASK_DETAILS,
    SET_TASK_DETAILS,
    GET_TASK_PRESETS,
    SET_TASK_PRESETS,
    SAVE_TASK_PRESET,
    DELETE_TASK_PRESET,
    SET_SUBTASKS_LIST,
    FETCH_SUBTASKS_LIST,
    FETCH_HEALTHY_NODE_NUMBER,
    SET_HEALTHY_NODE_NUMBER,
    GET_TASK_GAS_PRICE,
    SET_TASK_GAS_PRICE,
    GET_FRAGMENTS,
    SET_FRAGMENTS
} = dict;

let channelTestInterval;

export function getFragments(session, payload) {
    return new Promise((resolve, reject) => {
        function on_task_info(args) {
            var task_info = args[0];
            //console.log(config.GET_TASK_RPC, task_info)
            resolve({
                type: SET_FRAGMENTS,
                payload: task_info
            });
        }
        //console.log("GETTASKINFO", payload)

        _handleRPC(on_task_info, session, config.GET_FRAGMENTS_RPC, [payload]);
    });
}

export function* fragmentBase(session, { type, payload }) {
    if (payload) {
        let action = yield call(getFragments, session, payload);
        yield put(action);
    }
}

/**
 * [getGasPrice func. fetchs current gas price on network and the safe max limit]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function getGasPrice(session) {
    return new Promise((resolve, reject) => {
        function on_success(args) {
            const on_info = args[0];
            if (on_info) {
                resolve({
                    type: SET_TASK_GAS_PRICE,
                    payload: on_info
                });
            }
        }

        _handleRPC(on_success, session, config.GET_GAS_PRICE_RPC);
    });
}

export function* gasPriceBase(session) {
    let action = yield call(getGasPrice, session);
    yield put(action);
}

/**
 * [subscribeHistory func. fetchs subtasklist of the given task, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchNodeNumber(session, { payload }) {
    return new Promise((resolve, reject) => {
        function on_subtask_list(args) {
            const subtask_list = args[0];
            if (subtask_list) {
                const healtySubtasks = subtask_list.filter(
                    item =>
                        !(
                            item.status === taskStatus.FAILURE ||
                            item.status === taskStatus.TIMEOUT
                        )
                );

                resolve({
                    type: SET_HEALTHY_NODE_NUMBER,
                    payload: {
                        [payload]:
                            Array.isArray(healtySubtasks) &&
                            healtySubtasks.length
                    }
                });
            }
        }

        _handleRPC(on_subtask_list, session, config.GET_SUBTASKS_RPC, [
            payload
        ]);
    });
}

export function* nodeNumberBase(session, payload) {
    if (payload) {
        let action = yield call(fetchNodeNumber, session, payload);
        yield put(action);
    }
}

/**
 * [blockNode func. blocks given node id]
 * @param  {Object} payload [Node Id]
 */
export function blockNode(session, { payload, _resolve, _reject }) {
    _handleRPC(_resolve, session, config.BLOCK_NODE_RPC, [payload], _reject);
}

export function* blockNodeBase(session, payload) {
    if (payload) {
        yield call(blockNode, session, payload);
    }
}

/**
 * [subscribeHistory func. fetchs subtasklist of the given task, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchSubtaskList(session, { payload }) {
    return new Promise((resolve, reject) => {
        function on_subtask_list(args) {
            var subtask_list = args[0];
            //console.log(config.GET_SUBTASKS_RPC, subtask_list)
            resolve({
                type: SET_SUBTASKS_LIST,
                payload: subtask_list,
                id: payload
            });
        }

        _handleRPC(on_subtask_list, session, config.GET_SUBTASKS_RPC, [
            payload
        ]);
    });
}

export function* subtaskList(session, payload) {
    if (payload) {
        let action = yield call(fetchSubtaskList, session, payload);
        yield put(action);
    }
}

export function getEstimatedCost(
    session,
    { type, options, id = null, subtask_ids = null, partial = false }
) {
    //console.info('Estimated cost requested!')
    return new Promise((resolve, reject) => {
        function on_estimated_cost(args) {
            var estimated_cost = args[0];
            resolve({
                type: SET_ESTIMATED_COST,
                payload: estimated_cost
            });
        }

        Array.isArray(subtask_ids)
            ? _handleRPC(
                  on_estimated_cost,
                  session,
                  config.GET_SUBTASK_ESTIMATED_COSTS_RPC,
                  [id, subtask_ids]
              )
            : _handleRPC(
                  on_estimated_cost,
                  session,
                  config.GET_ESTIMATED_COST_RPC,
                  [type, options, id, partial]
              );
    });
}

export function* estimatedCostBase(session, { payload }) {
    if (payload) {
        let action = yield call(getEstimatedCost, session, payload);
        yield put(action);
    }
}

export function abortTestTask(session) {
    function on_test_task(args) {
        var test_task = args[0];
        channelTestInterval && clearInterval(channelTestInterval);
    }

    _handleRPC(on_test_task, session, config.ABORT_TEST_TASK_RPC);
}

export function* abortTestTaskBase(session) {
    yield call(abortTestTask, session);
}

export function runTestTask(session, payload) {
    return new Promise((resolve, reject) => {
        function on_test_task(args) {
            let test_task = args[0];
            resolve(test_task);
        }

        _handleRPC(on_test_task, session, config.RUN_TEST_TASK_RPC, [payload]);
    });
}

export function* testTaskBase(session, { payload }) {
    if (payload) {
        const result = yield call(runTestTask, session, payload);
        if (result) {
            let testCH = yield fork(testTaskFlow, session);
        }
    }
}

export function deleteTaskPreset(session, { task_type, name }) {
    function on_delete_task_preset(args) {
        let deleted_task_preset = args[0];
        //console.log(config.DELETE_TASK_PRESET_RPC, deleted_task_preset)
    }
    _handleRPC(on_delete_task_preset, session, config.DELETE_TASK_PRESET_RPC, [
        task_type,
        name
    ]);
}

export function* deleteTaskPresetFlow(session, { payload }) {
    if (payload) {
        yield call(deleteTaskPreset, session, payload);
        let action = yield call(getTaskPresets, session, payload.task_type);
        //console.log(action)
        yield put(action);
    }
}

export function saveTaskPreset(session, payload) {
    function on_create_task_preset(args) {
        let create_task_preset = args[0];
        //console.log(config.SAVE_TASK_PRESET_RPC, create_task_preset)
    }
    _handleRPC(on_create_task_preset, session, config.SAVE_TASK_PRESET_RPC, [
        payload.preset_name,
        payload.task_type,
        payload.data
    ]);
}

export function* saveTaskPresetFlow(session, { payload }) {
    if (payload) {
        yield call(saveTaskPreset, session, payload);
        let action = yield call(getTaskPresets, session, payload.task_type);
        //console.log(action)
        yield put(action);
    }
}

export function getTaskPresets(session, payload) {
    return new Promise((resolve, reject) => {
        function on_get_task_presets(args) {
            var task_presets = args[0];
            //console.log(config.TASK_PRESETS_RPC, task_presets)
            resolve({
                type: SET_TASK_PRESETS,
                payload: task_presets
            });
        }
        //console.log("PAYLOAD", payload)
        _handleRPC(on_get_task_presets, session, config.TASK_PRESETS_RPC, [
            payload
        ]);
    });
}

export function* getTaskPresetsFlow(session, { payload }) {
    if (payload) {
        let action = yield call(getTaskPresets, session, payload);
        //console.log(action)
        yield put(action);
    }
}

export function* taskPresetBase(session) {
    yield takeEvery(GET_TASK_PRESETS, getTaskPresetsFlow, session);
    yield takeEvery(SAVE_TASK_PRESET, saveTaskPresetFlow, session);
    yield takeEvery(DELETE_TASK_PRESET, deleteTaskPresetFlow, session);
}

export function getTaskDetails(session, payload) {
    return new Promise((resolve, reject) => {
        function on_task_info(args) {
            var task_info = args[0];
            //console.log(config.GET_TASK_RPC, task_info)
            resolve({
                type: SET_TASK_DETAILS,
                payload: task_info
            });
        }
        //console.log("GETTASKINFO", payload)

        _handleRPC(on_task_info, session, config.GET_TASK_RPC, [payload]);
    });
}

export function* taskDetailsBase(session, { type, payload }) {
    if (payload) {
        let action = yield call(getTaskDetails, session, payload);
        //console.log(action)
        yield put(action);
    }
}

/**
 * [subscribeTasks func. fetches tasks with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */

// export function subscribeTestofTask(session) {
//     return eventChannel(emit => {
//         function on_tasks(args, more) {
//             let status = args[0];
//             let error = args[1];

//             emit({
//                 type: SET_TASK_TEST_STATUS,
//                 payload: {
//                     status,
//                     error,
//                     more
//                 }
//             })
//         }

//         _handleSUBPUB(on_tasks, session, config.TASK_TEST_STATUS_CH)

//         return () => {
//             console.log('negative')
//             _handleUNSUBPUB(on_tasks, session, config.TASK_TEST_STATUS_CH)
//         }
//     })
// }

export function subscribeTestStatus(session) {
    const interval = 1000;

    return eventChannel(emit => {
        const fetchTestStatus = () => {
            function on_tasks(args) {
                let result = args[0];
                console.log('result', result);
                if (result) {
                    emit({
                        type: SET_TASK_TEST_STATUS,
                        payload: result
                    });

                    if (
                        result &&
                        result.status !== 'Started' &&
                        !checkNested(
                            result,
                            'more',
                            'after_test_data',
                            'warnings'
                        )
                    ) {
                        clearInterval(channelTestInterval); //Wait until eventual result and kill the interval
                    }
                }
            }

            _handleRPC(on_tasks, session, config.CHECK_TEST_STATUS_RPC);
        };

        const fetchOnStartup = () => {
            fetchTestStatus();

            return fetchOnStartup;
        };

        channelTestInterval = setInterval(fetchOnStartup(), interval);

        return () => {
            console.log('negative');
            clearInterval(channelTestInterval);
        };
    });
}

export function* testTaskFlow(session) {
    const channel = yield call(subscribeTestStatus, session);

    try {
        while (true) {
            let action = yield take(channel);
            //console.log("action", action);
            yield put(action);
        }
    } finally {
        console.info('yield cancelled!');
        channel.close();
    }
}

export function callRestartTask(
    session,
    { id, isPartial, isConcentOn },
    _resolve,
    _reject
) {

    function on_restart_task(args) {
        var restart_task = args[0];
        _resolve(restart_task);
    }
    if (isPartial)
        _handleRPC(
            on_restart_task,
            session,
            config.RESTART_SUBTASKS_RPC,
            [id, [], true, !isConcentOn]
        );
    else
        _handleRPC(on_restart_task, session, config.RESTART_TASK_RPC, [
            id, true, !isConcentOn
        ]);
}

export function* restartTaskBase(
    session,
    { payload, _resolve, _reject }
) {
    if (payload) {
        yield call(
            callRestartTask,
            session,
            payload,
            _resolve,
            _reject
        );
    }
}

export function callCreateTask(session, payload, _resolve, _reject) {
    function on_create_task(args) {
        var create_task = args[0];
        _resolve(create_task);
        console.info(config.CREATE_TASK_RPC, create_task);
    }

    _handleRPC(on_create_task, session, config.CREATE_TASK_RPC, [payload]);
}

export function* createTaskBase(session, { type, payload, _resolve, _reject }) {
    if (payload.options) {
        //console.info('TASK_CREATING')
        yield call(callCreateTask, session, payload, _resolve, _reject);
    }
}

export function callDeleteTask(session, payload) {
    function on_delete_task(args) {
        var delete_task = args[0];
        //console.log(config.DELETE_TASK_RPC, delete_task)
    }

    _handleRPC(on_delete_task, session, config.DELETE_TASK_RPC, [payload]);
}

export function* deleteTaskBase(session, { type, payload }) {
    yield call(callDeleteTask, session, payload);
}

/**
 * [subscribeTasks func. fetches tasks with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
// export function subscribeTasks(session) {
//     return eventChannel(emit => {
//         function on_tasks(args) {
//             var taskList = args[0];
//             emit({
//                 type: SET_TASKLIST,
//                 payload: taskList
//             })
//         }

//         _handleSUBPUB(on_tasks, session, config.GET_TASKS_CH)

//         return () => {
//             console.log('negative')
//             _handleUNSUBPUB(on_tasks, session, config.GET_TASKS_CH)
//         }
//     })
// }

export function subscribeTaskList(session) {
    const interval = 2000;

    return eventChannel(emit => {
        const fetchTaskList = () => {
            function on_tasks(args) {
                var taskList = args[0];
                emit({
                    type: SET_TASKLIST,
                    payload: taskList.reverse()
                });
            }

            _handleRPC(on_tasks, session, config.GET_TASKS_RPC);
        };

        const fetchOnStartup = () => {
            fetchTaskList();

            return fetchOnStartup;
        };

        const channelInterval = setInterval(fetchOnStartup(), interval);

        return () => {
            console.log('negative');
            clearInterval(channelInterval);
        };
    });
}

export function* fireBase(session) {
    const channel = yield call(subscribeTaskList, session);

    try {
        while (true) {
            let action = yield take(channel);
            yield put(action);
        }
    } finally {
        console.info('yield cancelled!');
        channel.close();
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
    yield takeEvery(DELETE_TASK, deleteTaskBase, session);
    yield takeLatest(CREATE_TASK, createTaskBase, session);
    yield takeLatest(RESTART_TASK, restartTaskBase, session);
    yield takeEvery(GET_TASK_DETAILS, taskDetailsBase, session);
    yield takeLatest(RUN_TEST_TASK, testTaskBase, session);
    yield takeLatest(ABORT_TEST_TASK, abortTestTaskBase, session);
    yield takeLatest(GET_ESTIMATED_COST, estimatedCostBase, session);
    yield takeEvery(FETCH_SUBTASKS_LIST, subtaskList, session);
    yield takeEvery(FETCH_HEALTHY_NODE_NUMBER, nodeNumberBase, session);
    yield takeEvery(GET_FRAGMENTS, fragmentBase, session);
    yield takeLatest(BLOCK_NODE, blockNodeBase, session);
    yield takeEvery(GET_TASK_GAS_PRICE, gasPriceBase, session);
}
