import { testSaga } from 'redux-saga-test-plan'
import { createMockTask } from 'redux-saga/lib/utils'
import { take, flush, call } from 'redux-saga/effects'
import { WebSocket } from 'mock-socket'
import { login, setMessage, logout } from '../../../actions'

import {
    frameBase, 
    frameInfo, 
    fetchFrameInfo,
    subtaskList, 
    fetchSubtaskList,
    frameList, 
    fetchFrameList,
    getPreviewBase, 
    getPreviews,
    subtasksBorder,
    fetchSubtasksBorder,
    restartFrameBase,
    restartFrame,
    restartSubtaskBase,
    restartSubtask
} from '../../frame'

describe('handleIO', () => {


    const connection = new WebSocket('ws://localhost:8080/ws')
    let session
    let task = createMockTask();
    //
    connection.onopen = (sess) => {
        session = sess
    }

    it('should fork base generator (frameBase)', () => {
        let saga = testSaga(frameBase)
        saga
            .next()
            .fork(frameInfo, session, undefined)

            .next()
            .fork(subtaskList, session, undefined)

            .next()
            .fork(frameList, session, undefined)

            .next()
            .fork(getPreviewBase, session, undefined)

            .next()
            .takeEveryEffect('SET_SUBTASKS_VISIBILITY', subtasksBorder, session, undefined)

            .next()
            .takeLatestEffect('RESTART_FRAME', restartFrameBase, session, undefined)

            .next()
            .takeLatestEffect('RESTART_SUBTASK', restartSubtaskBase, session)

            .finish()
            .isDone()
    })

    it('should fork frameInfo generator', () => {
        let saga = testSaga(frameInfo, session, 3)
        saga
            .next()
            .call(fetchFrameInfo, session, 3)

            .finish()
            .isDone()
    })

    it('should fork subtaskList generator', () => {
        let saga = testSaga(subtaskList, session, 3)
        saga
            .next()
            .call(fetchSubtaskList, session, 3)

            .finish()
            .isDone()
    })

    it('should fork subtaskList generator', () => {
        let saga = testSaga(frameList, session, 3)
        saga
            .next()
            .call(fetchFrameList, session, 3)

            .finish()
            .isDone()
    })

    it('should fork subtaskList generator', () => {
        let saga = testSaga(getPreviewBase, session, 3)
        saga
            .next()
            .call(getPreviews, session, 3)

            .finish()
            .isDone()
    })


    it('should fork subtaskList generator', () => {
        let saga = testSaga(subtasksBorder, session, 3, {payload: undefined})
        saga
            .next()
            .call(fetchSubtasksBorder, session, 3, undefined)

            .finish()
            .isDone()
    })

    it('should fork subtaskList generator', () => {
        let saga = testSaga(restartFrameBase, session, 3, {payload: 3})
        saga
            .next()
            .call(restartFrame, session, 3, 3)

            .finish()
            .isDone()
    })



    it('should fork subtaskList generator', () => {
        let saga = testSaga(restartSubtaskBase, session, {payload: 3})
        saga
            .next()
            .call(restartSubtask, session, 3)

            .finish()
            .isDone()
    })
})
