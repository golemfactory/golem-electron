import { eventChannel, buffers } from 'redux-saga'
import { fork, take, call, put } from 'redux-saga/effects'
import { dict } from '../../actions'

import { config, _handleRPC } from './../handler'


const {SET_HISTORY} = dict


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
        function on_create_preset(args) {
            var created_preset = args[0];
            console.log(config.PRESET_CREATE_RPC, created_preset)
            resolve(created_preset)
        }

    //_handleRPC(on_create_preset, session, config.PRESET_CREATE_RPC, [payload])
    })
}

export function* frameInfo(session) {
    const channel = yield call(fetchFrameInfo, session)

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
 * [*frame generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* frameBase(session, id) {
    yield fork(frameInfo, session)
    yield fork(subtaskList, session, id)
}