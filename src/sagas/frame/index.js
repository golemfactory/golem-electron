import { eventChannel, buffers } from 'redux-saga'
import { fork, takeEvery, takeLatest, take, call, put } from 'redux-saga/effects'
import { dict } from '../../actions'

import { config, _handleRPC } from './../handler'


const {SET_TASK_DETAILS, SET_SUBTASKS_BORDER, SET_PREVIEW_LIST, SET_SUBTASKS_LIST, FETCH_SUBTASKS_LIST, SET_SUBTASKS_VISIBILITY, SET_ALL_FRAMES, RESTART_FRAME, RESTART_SUBTASK} = dict

/**
 * [restartSubtask func. restarts related subtask]
 * @param  {Object} session [Websocket connection session]
 * @param  {Object} payload [Subtask Id]
 * @return {Object}         [Promise]
 */
export function restartSubtask(session, payload) {
    return new Promise((resolve, reject) => {
        function on_restart_subtask(args) {
            var restarted_subtask = args[0];
            //console.log(config.RESTART_SUBTASK_RPC, restarted_subtask)
            resolve(restarted_subtask)
        }
        _handleRPC(on_restart_subtask, session, config.RESTART_SUBTASK_RPC, [payload])
    })
}

export function* restartSubtaskBase(session, {payload}) {
    if (payload) {
        let action = yield call(restartSubtask, session, payload);
    //console.log("action", action);
    //yield put(action)
    }
}

/**
 * [restartFrame func. restarts related frame]
 * @param  {Object} session [Websocket connection session]
 * @param  {Object} payload [Subtask Id]
 * @return {Object}         [Promise]
 */
export function restartFrame(session, id, payload) {
    return new Promise((resolve, reject) => {
        function on_restart_frame(args) {
            var restarted_frame = args[0];
            //console.log(config.RESTART_FRAME_RPC, restarted_frame)
            resolve(restarted_frame)
        }
        _handleRPC(on_restart_frame, session, config.RESTART_FRAME_RPC, [id, payload])
    })
}

export function* restartFrameBase(session, id, {payload}) {
    if (payload) {
        let action = yield call(restartFrame, session, id, payload);
    //console.log("action", action);
    //yield put(action)
    }
}

/**
 * [getPreviews func. gets preview image list]
 * @param  {Object} session [Websocket connection session]
 * @param  {Number} id      [Task id]
 * @return {[type]}         [description]
 */
export function getPreviews(session, id) {
    return new Promise((resolve, reject) => {
        function on_previews(args) {
            var previews = args[0];
            console.log(config.GET_PREVIEW_LIST_RPC, previews)
            resolve({
                type: SET_PREVIEW_LIST,
                payload: previews
            })
        }
        _handleRPC(on_previews, session, config.GET_PREVIEW_LIST_RPC, [id])
    })
}

export function* getPreviewBase(session, id) {
    if (id) {
        let action = yield call(getPreviews, session, id)
        yield put(action)
    }
}


/**
 * [fetchFrameList func. fetchs frame list of the task]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Promise of action]
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
        yield put(action)
    }
}
/**
 * [fetchSubtasksBorder func. fetchs border of the subtasks related with given frame id]
 * @param   {Object}     session     [Websocket connection session]
 * @param   {Any}       payload     [id of task]
 * @param   {Number}    frame_id    [Id of related frame] Default = 0
 * @return {Object}                 [Action object]
 */
export function fetchSubtasksBorder(session, payload, frame_id = 0) {
    return new Promise((resolve, reject) => {
        function on_subtasks_border(args) {
            var subtasks_border = args[0];
            //console.log(config.GET_SUBTASKS_BORDER_RPC, subtasks_border, payload, frame_id)
            resolve({
                type: SET_SUBTASKS_BORDER,
                payload: subtasks_border
            })
        }

        //console.log("REQUEST MADE:", config.GET_SUBTASKS_BORDER_RPC, payload)
        _handleRPC(on_subtasks_border, session, config.GET_SUBTASKS_BORDER_RPC, [payload, frame_id])
    })
}

export function* subtasksBorder(session, id, {payload}) {
    if (id) {
        let action = yield call(fetchSubtasksBorder, session, id, payload)
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
            //console.log(config.GET_SUBTASKS_RPC, subtask_list)
            resolve({
                type: SET_SUBTASKS_LIST,
                payload: subtask_list
            })
        }

        _handleRPC(on_subtask_list, session, config.GET_SUBTASKS_RPC, [payload])
    })
}

export function* subtaskList(session, payload) {
    console.log("payload", payload);
    if (payload) {
        let action = yield call(fetchSubtaskList, session, payload)
        yield put(action)
    }
}

/**
 * [fetchFrameInfo func. fetchs information of the frames]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchFrameInfo(session, payload) {
    return new Promise((resolve, reject) => {
        function on_get_task_info(args) {
            var task_info = args[0];
            //console.log(config.GET_TASK_RPC, task_info)
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
    yield fork(getPreviewBase, session, id)
    yield takeEvery(SET_SUBTASKS_VISIBILITY, subtasksBorder, session, id)
    yield takeLatest(RESTART_FRAME, restartFrameBase, session, id)
    yield takeLatest(RESTART_SUBTASK, restartSubtaskBase, session)
}