import { eventChannel, buffers } from 'redux-saga'
import { fork, take, call, put, cancel } from 'redux-saga/effects'
import { login, setMessage, logout, dict } from '../actions'
import Wampy from 'wampy'
import MsgpackSerializer from './../utils/MsgpackSerializer'
const {ipcRenderer} = window.require('electron')

import { config, _handleSUBPUB, _handleRPC } from './handler'

import { upload } from './upload'
import { currency } from './currency'
import { connectedPeers } from './connectedPeers'

const {LOGIN, SET_MESSAGE, SET_BLENDER, LOGOUT} = dict

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
                }
            });
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
            console.log(connection)

            function on_settings(args) {
                var settings = args[0];
                console.log(settings)
            }
            _handleRPC(on_settings, session, config.PRESET_RPC, {
                name: 'default'
            })
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

        _handleSUBPUB(on_counter, session, config.COUNTER_CH)

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

        _handleSUBPUB(on_blender, session, config.BLENDER_CH)

        function on_upload(args) {
            var pinfo = args[0];
            console.log('upload event received', pinfo);
        }

        _handleSUBPUB(on_upload, session, config.UPLOAD_CH)

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

/**
 * { handleIO generator handling multiple generators concurrently }
 *
 * @param      {Object}  connection  The connection of ws
 * @param      {Object}  session     The session of connection of ws
 * @return     {boolean}             { job isDone status }
 */
export function* handleIO(connection) {
    yield fork(read, connection);
    yield fork(upload, connection);
    yield fork(connectedPeers, connection, config.GET_CONNECTED_PEERS_RPC);
    yield fork(currency);
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
}