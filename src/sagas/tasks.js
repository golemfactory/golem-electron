import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {SET_CONNECTED_PEERS} = dict


/**
 * [subscribeTasks func. fetches tasks with interval]
 * @param  {Object} session     [Websocket connection session]
 * @param  {String} rpc_address [RPC address]
 * @return {Object}             [Action object]
 */
export function subscribeTasks(session, rpc_address) {
    const interval = 10000
    return eventChannel(emit => {
        setInterval(function fetchTasks() {
            function on_tasks(args) {
                var taskList = args[0];
                console.log(rpc_address, taskList)
            // emit({
            //     type: SET_CONNECTED_PEERS,
            //     payload: connected_peers.length
            // })
            }

            _handleRPC(on_tasks, session, rpc_address)
            return fetchTasks
        }(), interval)


        return () => {
            console.log('negative')
        }
    })
}

/**
 * [*tasks generator]
 * @param  {Object} session     [Websocket connection session]
 * @param  {String} address     [RPC address]
 * @yield   {Object}            [Action object]
 */
export function* tasksFlow(session, address) {
    const channel = yield call(subscribeTasks, session, address)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}