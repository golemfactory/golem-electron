import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, fork, takeEvery } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC, _handleSUBPUB, _handleUNSUBPUB } from './handler'


const {SET_TASKLIST, DELETE_TASK, CREATE_TASK} = dict

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
    yield takeEvery(DELETE_TASK, deleteTaskBase, session)
    yield takeEvery(CREATE_TASK, createTaskBase, session)
}