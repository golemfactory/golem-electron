import createCachedSelector from 're-reselect';
const {ipcRenderer, remote} = window.electron
const log = remote.require('./electron/debug_handler.js')

import { dict } from './../actions'
import checkNested from './../utils/checkNested'

const {
        SET_CONNECTED_PEERS, 
        SET_GOLEM_STATUS, 
        SET_PASSWORD_MODAL, 
        SET_PASSWORD,
    } = dict

const initialState = {
    connectedPeers: null,
    golemStatus: [{client:["start", "pre", null]}],
    passwordModal: { 
        status: false, 
        register: false,
        error: false
    }
}

const password = {
    REGISTER: "Requires new password",
    LOGIN: "Requires password"
}

const statusReducer = (state = initialState, action) => {
    switch (action.type) {

    case SET_CONNECTED_PEERS:
        return Object.assign({}, state, {
            peerInfo: action.payload,
            connectedPeers: action.payload.length
        });

    case SET_GOLEM_STATUS:
        return Object.assign({}, state, {
            golemStatus: action.payload
        });

    case SET_PASSWORD_MODAL:
        return Object.assign({}, state, {
            passwordModal: Object.assign({}, state.passwordModal, {
                ...action.payload
            })
        });

    default:
        return state
    }
}

export default statusReducer

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
        },
        'allocation': {
            exception: 'Resource allocation error'
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

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = mapFn(object[key], key)
        return result
    }, {})
}

function nodesString(num) {
    if (num < 1) return 'No Nodes Connected';
    const postfix = num != 1 ? 's' : '';
    return `${num} Node${postfix}`;
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
    } else if (stage == 'post') {
        result.status = 'Ready';
    } else try {
        result.status = 'Not Ready';
    } catch ( e ) { 
        log.warn('SAGA > GOLEM', e)
    }

    return result;
}

export const getStatusSelector = createCachedSelector(
        (state) => state.golemStatus,
        (state) => state.connectedPeers,
        (state) => state.isEngineOn,
        (state, key) => key,
        (golemStatus, connectedPeers, isEngineOn, key) => {
            let statusObj = objectMap(golemStatus[0], 
                (status, component) => getGolemStatus
                                        .apply(null, [component]
                                        .concat(status)))

            if(statusObj 
                && !Object
                    .keys(statusObj)
                    .some(key => statusObj[key].status === "Exception" )){
                if(isEngineOn && Number.isInteger(connectedPeers)){
                    statusObj.client = {
                        status: 'Ready',
                        message: nodesString(connectedPeers),
                    }
                } else if(!isEngineOn
                    && checkNested(statusObj, "client", "message")
                    && !(statusObj.client.message === password.LOGIN
                        || statusObj.client.message === password.REGISTER)){
                    statusObj.client = {
                        status: 'Not Ready',
                        message: "Waiting for configuration",
                    }
                }

                /**
                 * Dirty hack to show component status tooltip when user 
                 * logged in successfully, cuz "logged in" is post status on Golem side.
                 */
                if(checkNested(statusObj, "client", "message")
                    && statusObj.client.message === "Logged In"){
                    statusObj.client = {
                        status: 'Not Ready',
                        message: statusObj.client.message,
                    }
                }
            }
            
            return statusObj
        }
    )(
        (state, key) => key // Cache selectors by type name
    )

export const passwordModalSelector = createCachedSelector(
    (state) => state,
    (state) => state.passwordModal,
    (state, key) => key,
    (state, passwordModal) => {
        const currentStatus = getStatusSelector(state, 'golemStatus');

        if(currentStatus && currentStatus.client){
            const clientMessage = currentStatus.client;
            if(clientMessage.message === password.REGISTER){
                passwordModal = {...passwordModal,  status: true, register: true}
            }
            else if(clientMessage.message === password.LOGIN){
                passwordModal = {...passwordModal, status: true, register: false}
            }
        }

        return passwordModal
    })(
        (state, key) => key // Cache selectors by type name
    )