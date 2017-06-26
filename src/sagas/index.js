import { eventChannel, buffers } from 'redux-saga'
import { fork, take, call, put, cancel } from 'redux-saga/effects'
import { login, setMessage, logout, dict } from '../actions'
import Wampy from 'wampy'
import MsgpackSerializer from './../utils/MsgpackSerializer'
const {ipcRenderer} = window.require('electron')

import { config, _handleSUBPUB, _handleRPC } from './handler'


import { frameBase } from './frame'

import { engineFlow } from './engine'
import { uploadFlow } from './upload'
import { currencyFlow } from './currency'
import { connectedPeersFlow } from './connectedPeers'
import { balanceFlow } from './balance'
import { historyFlow } from './history'
import { advancedFlow } from './advanced'
import { performanceFlow } from './performance'
import { trustFlow } from './trust'
import { tasksFlow } from './tasks'
import { settingsFlow } from './userSettings'
import { networkInfoFlow } from './networkInfo'

const {SET_CONNECTION_PROBLEM, LOGIN, LOGIN_FRAME, SET_MESSAGE, SET_BLENDER, LOGOUT_FRAME, LOGOUT} = dict

/**
 * { Websocket Connect function }
 *
 * @return     {Promise}      { It returns connection and new session of the connection as promise }
 */
export function connect() {
    console.log('connect function starting!')
    return new Promise(resolve => {
        /**
         * [{Object} Wampy]
         * @inheritDoc https://github.com/KSDaemon/wampy.js
         * 
         * @param  {[String]}       config.WS_URL       ['Websocket URL']
         * @param  {[Object]}       Options   
         * @return {[Object]}       connection          ['Connection with session']
         */
        function connect() {
            let connection = new Wampy(config.WS_URL,
                {
                    realm: config.REALM,
                    autoReconnect: true,
                    transportEncoding: 'msgpack',
                    msgpackCoder: new MsgpackSerializer(),
                    onConnect: () => {
                        console.log('Connected to Router!');
                        resolve({
                            connection
                        })
                    },
                    onError: () => {
                        console.info('Error while connected!');
                        setTimeout(() => {
                            connect();
                        }, 5000) //can be less
                    }
                });
        }

        connect()
    })
}

/**
 * { Subscribe function. It's observing changes from the server side via Redux-Saga/EventChannel and websocket }
 *
 * @param      {Object}     session        The connection and session of ws
 * @return     {Object}                     { Emits of the channels  }
 */
export function subscribe(session) {
    return eventChannel(emit => {

        // SUBSCRIBE to a topic and receive events

        function on_connection(args) {
            var connection = args[0];

            if (connection === "Connected") {
                emit(true)
            } else {
                emit(true)
            }
        }

        _handleSUBPUB(on_connection, session, config.CONNECTION_CH)

        function on_counter(args) {
            var counter = args[0];
            ipcRenderer.send('amount-updated', counter)
            emit({
                type: SET_MESSAGE,
                message: counter
            })
        }

        //_handleSUBPUB(on_counter, session, config.COUNTER_CH)

        function on_blender(args) {
            let blender = args[0];

            function on_preview(args) {
                console.log(args)
            }

            blender.forEach((item, index) => {
                if (item.preview)
                    session.call(config.PREVIEW_CH, [index], {
                        onSuccess: on_preview,
                        onError: function(err, details) {
                            console.log('Fetch preview failed!', err);
                        }
                    })
            })
            emit({
                type: SET_BLENDER,
                blender: blender
            })
        }

        //_handleSUBPUB(on_blender, session, config.BLENDER_CH)

        session.options({
            onClose: function() {
                console.info("Connection lost!");
            }
        })

        return () => {
            console.log('negative')
        }
    })
}

/**
 * { Read Generator, waiting for emits from the emitchannel and writing it to the redux store }
 *
 * @param      {Object}  session  The connection and session of ws
 * @return     {boolean}             { job isDone status }
 */
export function* read(session) {
    const channel = yield call(subscribe, session)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}

/*function* write(socket) {
  while (true) {
    const { payload } = yield take(`${sendMessage}`);
    socket.emit('message', payload);
  }
}*/
export function* apiFlow(connection) {
    yield fork(uploadFlow, connection);
    yield fork(networkInfoFlow, connection);
    yield fork(connectedPeersFlow, connection);
    yield fork(balanceFlow, connection);
    yield fork(historyFlow, connection);
    yield fork(tasksFlow, connection);
    yield fork(trustFlow, connection);
    yield fork(currencyFlow);
}
/**
 * { handleIO generator handling multiple generators concurrently }
 *
 * @param      {Object}  connection  The connection of ws
 * @param      {Object}  session     The session of connection of ws
 * @return     {boolean}             { job isDone status }
 */
export function* handleIO(connection) {
    //yield fork(read, connection);
    yield fork(engineFlow, connection);
    yield fork(settingsFlow, connection);
    yield fork(advancedFlow, connection);
    yield fork(performanceFlow, connection);
    const channel = yield call(subscribe, connection)
    let taskApi;
    let started = false

    while (true) {
        let status = yield take(channel)
        if (status && !started) {
            taskApi = yield fork(apiFlow, connection)
            yield put({
                type: SET_CONNECTION_PROBLEM,
                payload: false
            })
            started = true
        } else if (!status && taskApi && started) {
            console.log('SHUT_DOWN')
            yield cancel(taskApi)
            started = false
        }

        if (!status) {
            yield put({
                type: SET_CONNECTION_PROBLEM,
                payload: true
            })
        }
    }
}

export function* frameFlow() {
    while (true) {
        let {payload} = yield take(LOGIN_FRAME)
        const {connection} = yield call(connect)
        const task = yield fork(frameBase, connection, payload)
        let action = yield take(LOGOUT_FRAME)
        yield cancel(task)
    }
}

/**
 * { flow generator managing the major flow of the application }
 *
 * @return     {boolean}            { job isDone status }
 */
export function* flow() {
    while (true) {
        let {payload} = yield take(LOGIN)
        const {connection} = yield call(connect)
        const task = yield fork(handleIO, connection)
        let action = yield take(LOGOUT)
        yield cancel(task)
    }
}

/**
 * { rootSaga generator forking all the major flow generators concurrently }
 *
 * @return     {boolean}            { job isDone status }
 */
export default function* rootSaga() {
    yield fork(flow);
    yield fork(frameFlow);
}