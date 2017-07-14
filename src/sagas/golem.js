import { eventChannel, buffers } from 'redux-saga';
import { take, call, put, cancel } from 'redux-saga/effects';
import { dict } from '../actions'

import { config, _handleSUBPUB, _handleUNSUBPUB, _handleRPC } from './handler'

const {SET_GOLEM_STATUS} = dict


const statuses = {
    client: {
        'start': {
            post: 'Ready'
        },
        'quit': {
            pre: 'Not Ready'
        }
    }
}

const messages = {
    docker: {
        'images.pull': {
            pre: 'Pulling Docker images',
            post: 'Docker images downloaded',
            exception: 'Error pulling Docker images'
        },
        'images.build': {
            pre: 'Building Docker images',
            post: 'Docker images built',
            exception: 'Error building Docker images'
        }
    },
    hypervisor: {
        'vm.create': {
            pre: 'Creating Docker VM',
            post: 'Docker VM created',
            exception: 'Error creating Docker VM'
        },
        'vm.restart': {
            pre: 'Restarting Docker VM',
            post: 'Docker VM restarted',
            exception: 'Error restarting Docker VM'
        },
        'vm.recover': {
            pre: 'Recovering Docker VM',
            post: 'Docker VM recovered',
            exception: 'Error recovering Docker VM'
        },
    },
    ethereum: {
        'node.start': {
            pre: 'Starting geth',
            post: 'geth started',
            exception: 'Error starting geth'
        },
        'node.stop': {
            pre: 'Stopping geth',
            post: 'geth stopped',
            exception: 'Error stopping geth'
        },
        'sync': {
            pre: 'Syncing chain',
            post: 'Chain synced',
            exception: 'Chain sync error'
        }
    },
    client: {
        'start': {
            pre: 'Starting Golem',
            post: 'Connecting to network',
            exception: 'Error starting Golem'
        },
        'stop': {
            pre: 'Stopping Golem',
            post: 'Golem has stopped',
            exception: 'Error stopping Golem'
        },
        'quit': {
            pre: 'Terminating Golem',
            post: 'Golem terminated',
            exception: 'Error terminating Golem'
        }
    }
}


function dig(src, ...rest) {
    for ( let arg of rest )
        src = src[arg];
    return src;
}


function getGolemStatus(component, method, stage, data) {
    let result = {};

    try {
        result.message = dig(messages, component, method, stage);
    } catch ( e ) {
        result.message = `Golem - ${component}`;
    }

    if (stage == 'exception') {
        result.status = 'Exception';
    } else try {
        result.status = dig(statuses, component, method, stage);
    } catch ( e ) { }

    return result;
}


/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
export function subscribeGolemStatus(session) {
    return eventChannel(emit => {
        function on_status(args) {
            if (args && args.length)
                emit({
                    type: SET_GOLEM_STATUS,
                    payload: getGolemStatus.apply(null, args)
                });
        }

        function on_status_rpc(result) {
            if (result && result.length)
                on_status(result[0]);
        }

        _handleRPC(on_status_rpc, session, config.GOLEM_STATUS_RPC);
        _handleSUBPUB(on_status, session, config.GOLEM_STATUS_CH);

        return () => _handleUNSUBPUB(on_status, session, config.GOLEM_STATUS_CH);
    })
}


/**
 * [*golemStatus generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* golemStatusFlow(session) {
    const channel = yield call(subscribeGolemStatus, session)

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