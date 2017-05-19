import { eventChannel, buffers } from 'redux-saga'
import { take, call, put, fork, takeEvery } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_TASKLIST, DELETE_TASK} = dict

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
    const interval = 10000
    return eventChannel(emit => {
        const iv = setInterval(function fetchTasks() {
            function on_tasks(args) {
                var taskList = args[0];
                console.log(config.GET_TASKS_RPC, taskList)
                emit({
                    type: SET_TASKLIST,
                    payload: taskList
                })
            }

            _handleRPC(on_tasks, session, config.GET_TASKS_RPC)
            return fetchTasks
        }(), interval)


        return () => {
            console.log('negative')
            clearInterval(iv)
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
}