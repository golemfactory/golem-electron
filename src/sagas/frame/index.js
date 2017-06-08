import { eventChannel, buffers } from 'redux-saga'
import { fork, take, call, put } from 'redux-saga/effects'
import { dict } from '../../actions'

import { config, _handleRPC } from './../handler'


const {SET_TASK_DETAILS} = dict


/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchSubtaskList(session, payload) {
    return new Promise((resolve, reject) => {
        function on_subtask_list(args) {
            var subtask_list = args[0];
            console.log(config.GET_SUBTASKS_RPC, subtask_list)
        //resolve(subtask_list)
        }

        _handleRPC(on_subtask_list, session, config.GET_SUBTASKS_RPC, [payload])
    })
}

export function* subtaskList(session, id) {
    const channel = yield call(fetchSubtaskList, session, id)

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
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchFrameInfo(session, payload) {
    return new Promise((resolve, reject) => {
        function on_get_task_info(args) {
            var task_info = args[0];
            console.log(config.GET_TASK_RPC, task_info)
            resolve({
                type: SET_TASK_DETAILS,
                payload: task_info
            })
        }

        _handleRPC(on_get_task_info, session, config.GET_TASK_RPC, [payload])
    })
}

export function* frameInfo(session, payload) {
    if (payload) {
        let action = yield call(fetchFrameInfo, session, payload)
        yield put(action)
    }
}

/**
 * [*frame generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* frameBase(session, id) {
    yield fork(frameInfo, session, id)
    yield fork(subtaskList, session, id)
}