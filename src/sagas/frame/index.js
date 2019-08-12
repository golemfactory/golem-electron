import {
    fork,
    takeEvery,
    takeLatest,
    take,
    call,
    put
} from 'redux-saga/effects';
import { dict } from '../../actions';
import { taskStatus } from '../../constants/statusDicts';

import { config, _handleRPC, eventWrapper, eventEmitter } from './../handler';

const {
    SET_TASK_DETAILS,
    SET_SUBTASKS_BORDER,
    SET_PREVIEW_LIST,
    SET_SUBTASKS_LIST,
    FETCH_SUBTASKS_LIST,
    SET_SUBTASKS_VISIBILITY,
    SET_ALL_FRAMES,
    RESTART_FRAME,
    RESTART_SUBTASK,
    BLOCK_NODE
} = dict;

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
 * [restartSubtask func. restarts related subtask]
 * @param  {Object} session [Websocket connection session]
 * @param  {Object} payload [Subtask Id]
 * @return {Object}         [Promise]
 */
export function restartSubtask(session, { id, taskId, isTimedOut }) {
    return new Promise((resolve, reject) => {
        function on_restart_subtask(args) {
            var restarted_subtask = args[0];
            resolve(restarted_subtask);
        }
        if (isTimedOut) {
            _handleRPC(
                on_restart_subtask,
                session,
                config.RESTART_SUBTASKS_RPC,
                [taskId, [id]]
            );
        } else {
            _handleRPC(
                on_restart_subtask,
                session,
                config.RESTART_SUBTASK_RPC,
                [id]
            );
        }
    });
}

export function* restartSubtaskBase(session, { payload }) {
    if (payload) {
        let action = yield call(restartSubtask, session, payload);
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
            resolve(restarted_frame);
        }
        _handleRPC(on_restart_frame, session, config.RESTART_FRAME_RPC, [
            id,
            payload
        ]);
    });
}

export function* restartFrameBase(session, id, { payload }) {
    if (payload) {
        let action = yield call(restartFrame, session, id, payload);
        //console.log("action", action);
        //yield put(action)
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
            resolve({
                type: SET_SUBTASKS_BORDER,
                payload: subtasks_border
            });
        }

        _handleRPC(
            on_subtasks_border,
            session,
            config.GET_SUBTASKS_BORDER_RPC,
            [payload, frame_id]
        );
    });
}

export function* subtasksBorder(session, id, { payload }) {
    if (id) {
        let action = yield call(fetchSubtasksBorder, session, id, payload);
        yield put(action);
    }
}

/**
 * [getPreviews func. gets preview image list]
 * @param  {Object} session [Websocket connection session]
 * @param  {Number} id      [Task id]
 * @return {[type]}         [description]
 */
export function getPreviews(session, id) {
    return eventWrapper(
        session,
        config.GET_PREVIEW_LIST_RPC,
        id,
        SET_PREVIEW_LIST,
        5000
    );
}

/**
 * [fetchFrameList func. fetchs frame list of the task]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Promise of action]
 */
export function fetchFrameList(session, payload) {
    return eventWrapper(
        session,
        config.GET_SUBTASKS_FRAMES_RPC,
        payload,
        SET_ALL_FRAMES,
        5000
    );
}

/**
 * [subscribeHistory func. fetchs payment history of user, with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchSubtaskList(session, payload) {
    return eventWrapper(
        session,
        config.GET_SUBTASKS_RPC,
        payload,
        SET_SUBTASKS_LIST,
        5000
    );
}

function cancelFetchFrame(channel, { payload }) {
    if (
        payload.status === taskStatus.FINISHED ||
        payload.status === taskStatus.TIMEOUT
    ) {
        channel.close();
    }
}

/**
 * [fetchFrameInfo func. fetchs information of the frames]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function fetchFrameInfo(session, payload) {
    return eventWrapper(
        session,
        config.GET_TASK_RPC,
        payload,
        SET_TASK_DETAILS
    );
}

/**
 * [*frame generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* frameBase(session, id) {
    yield fork(eventEmitter, fetchFrameInfo, session, id, cancelFetchFrame);
    yield fork(eventEmitter, fetchSubtaskList, session, id);
    yield fork(eventEmitter, fetchFrameList, session, id);
    yield fork(eventEmitter, getPreviews, session, id);
    yield takeEvery(SET_SUBTASKS_VISIBILITY, subtasksBorder, session, id);
    yield takeLatest(RESTART_FRAME, restartFrameBase, session, id);
    yield takeLatest(RESTART_SUBTASK, restartSubtaskBase, session);
    yield takeLatest(BLOCK_NODE, blockNodeBase, session);
}
