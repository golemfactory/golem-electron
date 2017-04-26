import { eventChannel, buffers } from 'redux-saga'
import { fork, take, call, put, cancel } from 'redux-saga/effects'
import { login, setMessage, logout } from '../actions'
import Wampy from 'wampy'
import MsgpackSerializer from './../utils/MsgpackSerializer'
import Resumable from 'resumablejs'
import axios from 'axios'
const {ipcRenderer} = window.require('electron')

import { dict } from './../actions'

const {LOGIN, SET_MESSAGE, SET_BLENDER, SET_CURRENCY, UPLOAD, LOGOUT} = dict
let config = Object.freeze({
    WS_URL: 'ws://127.0.0.1:8080/ws',
    CURRENCY_URL: 'http://api.coinmarketcap.com/v1/ticker/',
    REALM: 'realm1',
    COUNTER_CH: 'com.golem.oncounter',
    BLENDER_CH: 'com.golem.blender',
    PREVIEW_CH: 'com.golem.preview',
    UPLOAD_CH: 'com.golem.upload.on_progress',
    TOKENS: {
        ETH: 'ethereum',
        GNT: 'golem-network-tokens'
    }
})

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
                //transportEncoding: 'msgpack',
                //msgpackCoder: new MsgpackSerializer(),
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
 * { subscribeCurrency function }
 * 
 * @return          {Object}            { Emits of the Interval  }
 */
export function subscribeCurrency() {
    const {CURRENCY_URL, TOKENS} = config
    const dailyInterval = 24 * 60 * 60 * 1000
    return eventChannel(emit => {
        setInterval(function fetchCurrency() {
            axios.get(`${CURRENCY_URL}/${TOKENS.ETH}`)
                .then((data) => {
                    console.log("FROM SAGA_CURRENCY", data)
                    emit({
                        type: SET_CURRENCY,
                        payload: {
                            currency: data.data[0].symbol,
                            rate: data.data[0].price_usd
                        }
                    })
                })
            axios.get(`${CURRENCY_URL}/${TOKENS.GNT}`)
                .then((data) => {
                    console.log("FROM SAGA_CURRENCY", data)
                    emit({
                        type: SET_CURRENCY,
                        payload: {
                            currency: data.data[0].symbol,
                            rate: data.data[0].price_usd
                        }
                    })
                })
            return fetchCurrency
        }(), dailyInterval)


        return () => {
            console.log('negative')
        }
    })
}

/**
 * { Subscribe currency function. It's observing changes from the Currency API via Redux-Saga/EventChannel and http request }
 * 
 * @return  nothing
 *
 * @see https://coinmarketcap.com/api/
 */
export function* currency() {
    const channel = yield call(subscribeCurrency)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
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
        //
        function on_counter(args) {
            var counter = args[0];
            ipcRenderer.send('amount-updated', counter)
            emit({
                type: SET_MESSAGE,
                message: counter
            })
        }
        session.subscribe(config.COUNTER_CH, {
            onEvent: on_counter,
            onSuccess: function() {
                console.log('subscribed to counter topic');
            },
            onError: function(err) {
                console.warn('failed to subscribe to topic', err);
            }
        })

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

        session.subscribe(config.BLENDER_CH, {
            onEvent: on_blender,
            onSuccess: function() {
                console.log('subscribed to blender topic');
            },
            onError: function(err) {
                console.warn('failed to subscribe to topic', err);
            }
        })

        function on_upload(args) {
            var pinfo = args[0];
            console.log('upload event received', pinfo);
        }
        session.subscribe(config.UPLOAD_CH, {
            onEvent: on_upload,
            onSuccess: function() {
                console.log('subscribed to upload progress topic');
            },
            onError: function(err) {
                console.warn('failed to subscribe to topic', err);
            }
        })

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

/**
 * { setupResumable function, creating resumable object to upload files.}
 * @param  {[Object]} session [Websocket connection]
 * @return {[Object]}         [Resumable Object]
 */
export function setupResumable(session) {
    /**
     * [r Resumable is a file upload library]
     * @type {Resumable}
     * @doc http://www.resumablejs.com/
     */
    return new Resumable({
        target: 'upload',
        uploadMethod: 'POST',
        testMethod: 'POST',
        chunkSize: 1 * 1024 * 1024,
        forceChunkSize: true, // https://github.com/23/resumable.js/issues/51
        simultaneousUploads: 4,
        testChunks: false,
        query: {
            on_progress: 'com.example.upload.on_progress',
            session: session.getSessionId(),
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
}

/**
 * { uploadResumable function, adding all file objects to the queue for upload }
 * 
 * @param  {[Object]}       r               [Resumable object]
 * @param  {[FileList]}     payload         [Filelist]
 * @return nothing
 */
export function uploadResumable(r, {path="", file}) {
    if (!r.support) {
        console.log("Fatal: ResumableJS not supported!");
    } else {

        console.log(path, file)
        r.addFile(file)

        /*if (document.getElementById('dragbox'))
            r.assignDrop(document.getElementById('dragbox'));*/

        r.on('fileAdded', function(file) {
            file.fileName = path + file.fileName
            console.log('fileAdded', file.fileName);
            r.upload();
        });

        r.on('fileSuccess', function(file, message) {
            console.log('fileSuccess', file, message);
            console.log(r.files);

            // enable repeated upload since other user can delete the file on the server
            // and this user might want to reupload the file
            r.removeFile(file)
        });

        r.on('fileError', function(file, message) {
            console.log('fileError', file, message);
            r.removeFile(file)
        });
    }
}

/**
 * { Upload Generator, waiting for uploads from the redux and sending them to the backend }
 *
 * @param      {Object}  connection  The connection of ws
 * @param      {Object}  session     The session of connection of ws
 * @return     {boolean}            { job isDone status }
 */
export function* upload(session) {
    while (true) {
        const resumableObject = yield call(setupResumable, session);
        const {payload} = yield take(UPLOAD);
        console.log(payload)
        yield call(uploadResumable, resumableObject, payload)
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
    //  socket.emit('logout');
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