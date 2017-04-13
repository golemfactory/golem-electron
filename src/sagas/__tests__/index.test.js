import { testSaga } from 'redux-saga-test-plan'
import { createMockTask } from 'redux-saga/lib/utils'
import { take, flush, call } from 'redux-saga/effects'
import { WebSocket } from 'mock-socket'
import { login, setMessage, logout } from '../../actions'
import Resumable from 'resumablejs'

import rootSaga, { flow, handleIO, connect, read, upload, subscribe, setupResumable, uploadResumable } from '../'

describe('handleIO', () => {


    const connection = new WebSocket('ws://localhost:8080/ws')
    let session
    let task = createMockTask()
    console.log(connection)
    connection.onopen = (sess) => {
        session = sess
    }

    const action = {
        login: {
            type: 'LOGIN',
            payload: 'Muhammed'
        },
        logout: {
            type: 'LOGOUT'
        },
        message: {
            '@@redux-saga/SAGA_ACTION': true,
            message: 21384,
            type: "SET_MESSAGE",
        },
        upload: {
            type: 'UPLOAD',
            payload: {
                '0': new File([""], "filename.txt", {
                    type: "text/plain",
                    lastModified: Date.now()
                })
            }
        }
    }

    /**
     * MIGHT TODO
     *
     * I create custom mock for Redux-Saga Channel It seems working.
     * In case if there's any issue or if redux saga provide better solution for it
     * It may change with the official one
     * 
     * https://redux-saga.github.io/redux-saga/
     * http://redux-saga-test-plan.jeremyfairbank.com/unit-testing/
     *
     */
    function mockChannel() {

        return {
            close: () => function close() {
                if (!chan.__closed__) {
                    chan.close();
                    unsubscribe();
                }
            },
            flush: () => flush,
            take: () => take,
        }
    }


    it('should fork flow generator (rootSaga)', () => {
        let saga = testSaga(rootSaga)
        saga
            .next()
            .fork(flow)

            .finish()
            .isDone()
    })

    it('should flow with the actions (flow)', () => {
        let sagaFlow = testSaga(flow)
        sagaFlow
            .next()
            .take(action.login.type)

            .next(action.login)
            .call(connect)

            .next({
                connection
            })
            .fork(handleIO, connection)

            .next(task)
            .take(action.logout.type)

            .next()
            .cancel(task)

            .finish()
            .isDone()
    })

    it('should fork read generator (handleIO)', () => {
        let sagaHandleIO = testSaga(handleIO, connection)
        sagaHandleIO
            .next()
            .fork(read, connection)

            .next()
            .fork(upload, connection)

            .finish()
            .isDone()

    })

    it('should call subscribe function, emit and flow with the subcribtions (read)', () => {
        let sagaRead = testSaga(read, connection)
        sagaRead
            .next()
            .call(subscribe, connection)

            .next(mockChannel)
            .take(mockChannel)

            .next(action.message)
            .put(action.message)

            .finish()
            .isDone()
    })

    it('should upload function to the server (upload)', () => {
        let resumableObject = new Resumable({
            target: 'upload',
            uploadMethod: 'POST',
            testMethod: 'POST',
            chunkSize: 1 * 1024 * 1024,
            forceChunkSize: true, // https://github.com/23/resumable.js/issues/51
            simultaneousUploads: 4,
            testChunks: false,
            query: {
                on_progress: 'com.example.upload.on_progress',
                session: 1234,
                chunk_extra: JSON.stringify({
                    test: 'lala',
                    test2: 23
                }),
                finish_extra: JSON.stringify({
                    test: 'fifi',
                    test2: 52
                })
            }
        });
        let sagaUpload = testSaga(upload, connection)
        sagaUpload
            .next()
            .call(setupResumable, connection)

            .next(resumableObject)
            .take(action.upload.type)

            .next(action.upload.payload)
            .call(uploadResumable, resumableObject, undefined)

            .finish()
            .isDone()
    })

    it('should create resumable object', () => {
        connection.getSessionId = function() {
            return 3
        }
        let resumable = setupResumable(connection)
        expect(resumable !== null && typeof resumable === 'object').toBe(true)
    })

    it('should trigger fileAdded event', () => {
        let file = new File([""], "filename");
        let resumableObject = new Resumable({
            target: 'upload',
            uploadMethod: 'POST',
            testMethod: 'POST',
            chunkSize: 1 * 1024 * 1024,
            forceChunkSize: true, // https://github.com/23/resumable.js/issues/51
            simultaneousUploads: 4,
            testChunks: false,
            query: {
                on_progress: 'com.example.upload.on_progress',
                session: 1234,
                chunk_extra: JSON.stringify({
                    test: 'lala',
                    test2: 23
                }),
                finish_extra: JSON.stringify({
                    test: 'fifi',
                    test2: 52
                })
            }
        });
        uploadResumable(resumableObject, {
            null,
            file
        })
    })
})