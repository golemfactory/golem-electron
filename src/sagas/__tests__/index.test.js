import { testSaga } from 'redux-saga-test-plan'
import { createMockTask } from 'redux-saga/lib/utils'
import { take, flush, call } from 'redux-saga/effects'
import { WebSocket } from 'mock-socket'
import { login, setMessage, logout } from '../../actions'

import rootSaga, { flow, handleIO, connect, read, upload, subscribe } from '../'

describe('handleIO', () => {


    const connection = new WebSocket('ws://localhost:8080/ws')
    let session
    let task = createMockTask();
    //console.log(connection)
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

})