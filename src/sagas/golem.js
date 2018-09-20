import { eventChannel, buffers } from 'redux-saga';
import { take, call, put, cancel } from 'redux-saga/effects';
import { dict } from '../actions'
const {remote} = window.electron;
const log = remote.require('./electron/debug_handler.js')

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
    hyperdrive: {
        'instance.check': {
            pre: 'Checking for hyperg',
            post: 'Hyperg is available',
            exception: 'Hyperg is not available'
        },
        'instance.connect': {
            pre: 'Connecting to hyperg',
            post: 'Connected to hyperg',
            exception: 'Cannot connect to hyperg'
        },
        'instance.version': {
            pre: 'Hyperg version checking',
            post: 'Hyperg version checked',
            exception: 'Outdated hyperg version'
        }
    },
    docker: {
        'instance.start': {
            pre: 'Docker is starting',
            post: 'Docker is started',
            exception: 'Error starting docker'
        },
        'instance.stop': {
            pre: 'Docker is stopping',
            post: 'Docker is stopped',
            exception: 'Error stopping docker'
        },
        'instance.check': {
            pre: 'Checking for docker',
            post: 'Docker is available',
            exception: 'Docker is not available'
        },
        'instance.env': {
            pre: 'Setting VM environment',
            post: 'VM environment configured',
            exception: 'Docker environment error'
        },
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
        'vm.stop': {
            pre: 'Creating Docker VM',
            post: 'Docker VM created',
            exception: 'Error stopping a VM'
        },
    },
    ethereum: {
        'node.start': {
            pre: 'Connecting geth',
            post: 'Geth connected',
            exception: 'Error connecting geth'
        },
        'node.stop': {
            pre: 'Stopping geth',
            post: 'Geth stopped',
            exception: 'Error stopping geth'
        },
        'sync': {
            pre: 'Syncing chain',
            post: 'Chain synced',
            exception: 'Chain sync error'
        }
    },
    client: {
        'get_password': {
            pre: 'Requires password',
            post: 'Logged In',
            exception: 'Problem with password'
        },
        'new_password': {
            pre: 'Requires new password',
            post: 'Registered',
            exception: 'Problem with password'
        },
        'sync': {
            pre: 'Syncing Golem',
            post: 'Golem synced',
            exception: 'Error syncing Golem'
        },
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
    const result = {};

    try {
        result.message = dig(messages, component, method, stage);
    } catch ( e ) {
        result.message = `Golem - ${component}`;
        log.warn('SAGA > GOLEM', `${e}: Given "${component}.${method}.${stage}" status doesn't defined on Golem Client!`)
    }

    if (stage == 'exception') {
        result.status = 'Exception';
    } else try {
        result.status = dig(statuses, component, method, stage);
    } catch ( e ) { 
        log.warn('SAGA > GOLEM', e)
    }

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
            if (args && args.length){
                    emit({
                        type: SET_GOLEM_STATUS,
                        payload: args
                    });
                }
        }
        
        _handleSUBPUB(on_status, session, config.GOLEM_STATUS_CH);

        return () => _handleUNSUBPUB(on_status, session, config.GOLEM_STATUS_CH);
    })
}


/**
 * [*golemStatus generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield  {Object}             [Action object]
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