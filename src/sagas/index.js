import { eventChannel, buffers } from "redux-saga";
import { fork, takeLatest, take, call, put, cancel } from "redux-saga/effects";
import { login, setMessage, logout, dict } from "../actions";

import Wampy from "wampy";
import MsgpackSerializer from "./../utils/MsgpackSerializer";
import { config, _handleSUBPUB, _handleRPC, _handleUNSUBPUB } from "./handler";

import { versionFlow } from "./version";
import { golemStatusFlow } from "./golem";
import { termsFlow } from './terms';
import { chainInfoFlow } from "./chainInfo";
import { frameBase } from "./frame";
import { engineFlow } from "./engine";
import { encryptionFlow } from "./password";
import { currencyFlow } from "./currency";
import { connectedPeersFlow } from "./connectedPeers";
import { balanceFlow } from "./balance";
import { historyFlow } from "./history";
import { advancedFlow } from "./advanced";
import { performanceFlow } from "./performance";
import { statsFlow } from "./stats";
import { trustFlow } from "./trust";
import { tasksFlow } from "./tasks";
import { settingsFlow, settingsInteractionFlow } from "./userSettings";
import { networkInfoFlow } from "./networkInfo";

const { ipcRenderer } = window.electron;
const {
    SET_CONNECTION_PROBLEM,
    SET_GOLEM_STATUS,
    SET_CONNECTED_PEERS,
    LOGIN,
    LOGIN_FRAME,
    CONTINUE_WITH_PROBLEM,
    SET_MESSAGE,
    SET_BLENDER,
    LOGOUT_FRAME,
    LOGOUT
} = dict;

const { remote } = window.electron;
const { app } = remote;

let skipError = false,
    initialTimeout = null,
    reconnection = false;
/**
 * { Websocket Connect function }
 *
 * @return     {Promise}      { It returns connection and new session of the connection as promise }
 */
export function connect() {
    return eventChannel(emit => {
        /**
         * [{Object} Wampy]
         * @inheritDoc https://github.com/KSDaemon/wampy.js
         *
         * @param  {[String]}       config.WS_URL       ['Websocket URL']
         * @param  {[Object]}       Options
         * @return {[Object]}       connection          ['Connection with session']
         */
        function connect() {
            let connection = new Wampy(config.WS_URL, {
                realm: config.REALM,
                autoReconnect: true,
                transportEncoding: "msgpack",
                msgpackCoder: new MsgpackSerializer(),
                maxRetries: 100000,
                onConnect: () => {
                    console.log("WS: connected");
                    emit({
                        connection,
                        error: null
                    });
                    reconnection = true;
                },
                onReconnectSuccess: () => {
                    console.log("WS: Reconnected");

                    emit({
                        connection,
                        error: null
                    });
                    reconnection = true;
                },
                onClose: () => {
                    console.log("WS: connection closed");
                },
                onError: (err, details) => {
                    connection.disconnect()
                    console.info("WS: connection error:", err, details);

                    if (reconnection) {
                        emit({
                            connection: null,
                            error: err
                        });
                    }

                    app.golem.startProcess();

                    if (initialTimeout || reconnection) return;

                    initialTimeout = setTimeout(() => {
                        connection._wsReconnect();
                    }, connection._options.reconnectInterval);
                }
            });
        }

        console.log("WS: connecting");
        connect();

        return () => {
            console.log("negative");
        };
    });
}

export function disablePortFlow() {
    skipError = true;
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

            if (
                connection.startsWith("Connected") ||
                connection.startsWith("Not connected")
            ) {
                emit(true);
            } else if (connection.startsWith("Port")) {
                emit(skipError);
            }
        }

        _handleSUBPUB(on_connection, session, config.CONNECTION_CH);

        session.options({
            onClose: function() {
                console.info("Connection lost!");
            }
        });

        return () => {
            console.log("negative");
            _handleUNSUBPUB(on_connection, session, config.CONNECTION_CH);
        };
    });
}

/*function* write(socket) {
  while (true) {
    const { payload } = yield take(`${sendMessage}`);
    socket.emit('message', payload);
  }
}*/

export function* apiFlow(connection) {
    yield fork(settingsFlow, connection);
    yield fork(advancedFlow, connection);
    yield fork(statsFlow, connection);
    yield fork(versionFlow, connection);
        
    yield fork(performanceFlow, connection);
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

    let channel;
    let taskApi;
    let started = false;

    try {

        //yield fork(read, connection);
        yield fork(chainInfoFlow, connection);
        yield fork(golemStatusFlow, connection);
        yield fork(engineFlow, connection);
        yield fork(termsFlow, connection);
        yield fork(encryptionFlow, connection);
        yield fork(settingsInteractionFlow, connection);
        yield takeLatest(CONTINUE_WITH_PROBLEM, disablePortFlow);

        channel = yield call(subscribe, connection);

        while (true) {
            let status = yield take(channel);
            if (status && !started) {
                taskApi = yield fork(apiFlow, connection);
                yield put({
                    type: SET_CONNECTION_PROBLEM,
                    payload: false
                });
                started = true;
            } else if (!status && taskApi && started) {
                console.log("SHUT_DOWN");
                if(taskApi)
                    yield cancel(taskApi);
                started = false;
            }

            if (!status) {
                yield put({
                    type: SET_CONNECTION_PROBLEM,
                    payload: {
                        status: true,
                        issue: "PORT"
                    }
                });
            }
        }

    } finally {

        if (taskApi){
            yield cancel(taskApi);
            taskApi = null;
        }

        if (channel){
            channel.close();
            channel = null;
        }
        
        started = false;
    }
}

export function* frameFlow() {
    let { payload } = yield take(LOGIN_FRAME);
    const connectionCH = yield call(connect);
    while (true) {
        let { connection } = yield take(connectionCH);
        const task = yield fork(frameBase, connection, payload);
        let action = yield take(LOGOUT_FRAME);
        yield cancel(task);
    }
}

export function* connectionFlow() {
    const connectionCH = yield call(connect);
    let task;

    try {
        while (true) {
            let { connection, error } = yield take(connectionCH);
            if (error) {
                yield put({
                    type: SET_CONNECTION_PROBLEM,
                    payload: {
                        status: true,
                        issue: "WEBSOCKET"
                    }
                });
                skipError = false;
                if(task){
                    yield cancel(task)
                    task = null;
                }

            } else {
                yield put({
                    type: SET_CONNECTION_PROBLEM,
                    payload: false
                });
                task = yield fork(handleIO, connection);
            }
        }
    } finally {
        console.info("yield cancelled!");
        yield cancel(task);
    }
    return task;
}

/**
 * { flow generator managing the major flow of the application }
 *
 * @return     {boolean}            { job isDone status }
 */
export function* flow() {
    while (true) {
        yield take(LOGIN);
        yield put({
            type: SET_GOLEM_STATUS,
            payload: {
                message: "Starting Golem"
            }
        });
        const { task } = yield call(connectionFlow);
        let action = yield take(LOGOUT);
        yield cancel(task);
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
