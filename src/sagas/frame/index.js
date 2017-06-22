import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, take, call, put } from 'redux-saga/effects'
import { dict } from '../../actions'

import { config, _handleRPC } from './../handler'


const {SET_TASK_DETAILS, SET_SUBTASKS_BORDER, SET_SUBTASKS_VISIBILITY, SET_ALL_FRAMES} = dict

/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchFrameList(session, payload) {
    return new Promise((resolve, reject) => {
        function on_get_frame_list(args) {
            var frame_list = args[0];
            console.log(config.GET_SUBTASKS_FRAMES_RPC, frame_list)
            resolve({
                type: SET_ALL_FRAMES,
                payload: frame_list
            })
        }

        _handleRPC(on_get_frame_list, session, config.GET_SUBTASKS_FRAMES_RPC, [payload])
    })
}

export function* frameList(session, payload) {
    if (payload) {
        let action = yield call(fetchFrameList, session, payload)
    //yield put(action)
    }
}
/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchSubtasksBorder(session, payload) {
    return new Promise((resolve, reject) => {
        function on_subtasks_border(args) {
            var subtasks_border = args[0];
            console.log(config.GET_SUBTASKS_BORDER_RPC, subtasks_border)
            resolve({
                type: SET_SUBTASKS_BORDER,
                payload: subtasks_border
            })
        }

        _handleRPC(on_subtasks_border, session, config.GET_SUBTASKS_BORDER_RPC, [payload])
    })
}

export function* subtasksBorder(session, payload) {
    if (payload) {
        let action = yield call(fetchSubtasksBorder, session, payload)
        yield put(action)
    }
}

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

export function* subtaskList(session, payload) {
    if (payload) {
        let action = yield call(fetchSubtaskList, session, payload)
        yield put(action)
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
    yield fork(frameList, session, id)
    yield takeEvery(SET_SUBTASKS_VISIBILITY, subtasksBorder, session, id)
}