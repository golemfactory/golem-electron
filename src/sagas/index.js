import { eventChannel, buffers } from "redux-saga";
import { fork, takeLatest, take, call, put, cancel } from "redux-saga/effects";
import { login, setMessage, logout, dict } from "../actions";

import { Wampy } from "wampy";
import wampyCra from "wampy-cra";
import { w3cwebsocket } from "websocket";

import { MsgpackSerializer } from "wampy/dist/serializers/MsgpackSerializer";
import { config, _handleSUBPUB, _handleRPC, _handleUNSUBPUB } from "./handler";

import { accountFlow } from "./account";
import { advancedFlow } from "./advanced";
import { balanceFlow } from "./balance";
import { chainInfoFlow } from "./chainInfo";
import { concentFlow } from "./concent";
import { connectedPeersFlow } from "./connectedPeers";
import { currencyFlow } from "./currency";
import { encryptionFlow } from "./password";
import { engineFlow } from "./engine";
import { frameBase } from "./frame";
import { golemStatusFlow } from "./golem";
import { historyFlow } from "./history";
import { networkInfoFlow } from "./networkInfo";
import { performanceFlow } from "./performance";
import { quitFlow } from "./quit";
import { settingsFlow, settingsInteractionFlow } from "./userSettings";
import { statsFlow } from "./stats";
import { aclFlow } from "./acl";
import { trustFlow } from "./trust";
import { tasksFlow } from "./tasks";
import { termsFlow } from "./terms";
import { versionFlow } from "./version";
import { virtualizationFlow } from "./virtualization";

const {
    SET_CONNECTION_PROBLEM,
    SET_COMPONENT_WARNING,
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
        function connect(secret) {
            let connection = new Wampy(config.WS_URL, {
                ws: w3cwebsocket,
                realm: config.REALM,
                autoReconnect: true,
                serializer: new MsgpackSerializer(),
                maxRetries: 100000,
                authid: config.AUTHID,
                authmethods: ["wampcra"],
                onChallenge: (method, info) =>
                    wampyCra.sign(secret, info.challenge),
                onConnect: () => {
                    console.log("WS: connected");
                    emit({
                        connection,
                        error: null
                    });
                    app.golem.connected = true;
                    reconnection = true;
                },
                onReconnectSuccess: () => {
                    console.log("WS: Reconnected");

                    emit({
                        connection,
                        error: null
                    });
                    app.golem.connected = true;
                    reconnection = true;
                },
                onClose: () => {
                    app.golem.connected = false;
                    console.log("WS: connection closed");
                },
                onError: ({ error, details }) => {
                    connection.disconnect();
                    console.info("WS: connection error:", error, details);

                    if (reconnection) {
                        emit({
                            connection: null,
                            error: error
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

        /**
         * [reAskSecretKey function  will ask about secret key until it gets the proper answer from golem]
         */
        function reAskSecretKey() {
            let sleeper = null;
            app.golem
                .getSecretKey(config.AUTHID)
                .then(secret => {
                    if (sleeper) clearTimeout(sleeper);
                    connect(secret);
                })
                .catch(rejection => {
                    app.golem.startProcess();
                    sleeper = setTimeout(reAskSecretKey, 500);
                });
        }

        reAskSecretKey();

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
            const { listening, port_statuses } = connection;

            if (port_statuses) {
                const checkIfPortsAreHealty = Object.values(
                    port_statuses
                ).every(i => i == "open");
                if (listening && checkIfPortsAreHealty) {
                    emit(true);
                } else if (listening && !checkIfPortsAreHealty) {
                    if (!skipError) {
                        const skipErrorInterval = setInterval(() => {
                            if (skipError) {
                                emit(skipError);
                                clearInterval(skipErrorInterval);
                            }
                        }, 500);
                    }
                    emit(skipError);
                } else {
                    emit(false);
                    throw new Error(
                        "Golem is not able to listen proper ports!"
                    );
                }
            }
        }
        //Get initial status information
        _handleRPC(on_connection, session, config.GET_STATUS_RPC);
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

/**
 * [testRPC function will test given procedure if it's registered on Golem
 * within 5 seconds timeout, if not it will fail and will cancel all other
 * forked connections.]
 * @param  {[Object]}   session [The connection and session of ws]
 * @return {[Object]}           [Promise]
 */
export function testRPC(session) {
    let paymentTimeout = null;
    let timeoutCount = 0;

    return new Promise((response, reject) => {
        function on_info(args) {
            if (paymentTimeout) clearTimeout(paymentTimeout);
            response(true);
        }

        function on_error(args) {
            if (timeoutCount < 120) {
                // 2 min
                runTimeout();
                timeoutCount++;
            } else {
                reject(args);
            }
        }

        function runWithTimeout() {
            _handleRPC(
                on_info,
                session,
                config.PAYMENT_ADDRESS_RPC,
                [],
                on_error
            );
        }

        function runTimeout() {
            paymentTimeout = setTimeout(runWithTimeout, 1000);
        }

        runWithTimeout();
    });
}

export function* apiFlow(connection) {
    yield fork(accountFlow, connection);
    yield fork(settingsFlow, connection);
    yield fork(advancedFlow, connection);
    yield fork(statsFlow, connection);
    yield fork(aclFlow, connection);
    yield fork(versionFlow, connection);

    yield fork(performanceFlow, connection);
    yield fork(networkInfoFlow, connection);

    yield fork(concentFlow, connection);
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

    try {
        //yield fork(read, connection);
        yield fork(virtualizationFlow, connection);
        yield fork(quitFlow, connection);
        yield fork(chainInfoFlow, connection);
        yield fork(golemStatusFlow, connection);
        yield fork(engineFlow, connection);
        yield fork(termsFlow, connection);
        yield fork(encryptionFlow, connection);
        yield fork(settingsInteractionFlow, connection);
        yield call(testRPC, connection); //will block flow and wait for registered rpc procedures

        channel = yield call(subscribe, connection);

        while (true) {
            let status = yield take(channel);
            if (status && !taskApi) {
                taskApi = yield fork(apiFlow, connection);
            } 
            // else if (!status && taskApi) {
            //     console.info("SHUT_DOWN");
            //     if (taskApi) yield cancel(taskApi);
            //     taskApi = null;
            // }
            if (!status) {
                yield put({
                    type: SET_COMPONENT_WARNING,
                    payload: {
                        status: true,
                        issue: "PORT"
                    }
                });
                disablePortFlow();
            }
        }
    } finally {
        if (taskApi) {
            yield cancel(taskApi);
            taskApi = null;
        }

        if (channel) {
            channel.close();
            channel = null;
        }
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
                if (task) {
                    yield cancel(task);
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
        yield put({
            type: SET_CONNECTION_PROBLEM,
            payload: {
                status: true,
                issue: "WEBSOCKET"
            }
        });
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
            payload: [{ client: ["start", "pre", null] }]
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
