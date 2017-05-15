import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_TASKLIST} = dict


/**
 * [subscribeTasks func. fetches tasks with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeTasks(session) {
    const interval = 10000
    return eventChannel(emit => {
        setInterval(function fetchTasks() {
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
        }
    })
}

/**
 * [*tasks generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* tasksFlow(session) {
    const channel = yield call(subscribeTasks, session)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}