import {BigNumber} from 'bignumber.js';
import createCachedSelector from 're-reselect';
import { dict } from './../actions'
const {ipcRenderer, remote} = window.electron
const log = remote.require('./electron/debug_handler.js')

const {
        SET_BALANCE, 
        SET_TASKLIST, 
        SET_CONNECTED_PEERS, 
        SET_GOLEM_STATUS, 
        SET_FOOTER_INFO, 
        SET_PASSWORD_MODAL, 
        SET_PASSWORD,
        SET_CONCENT_DEPOSIT_BALANCE
    } = dict

const initialState = {
    balance: [
        new BigNumber(0), 
        new BigNumber(0), 
        null,
        null,
        new BigNumber(0).toString(), 
        new BigNumber(0).toString(),
        new BigNumber(0).toString()
    ],
    concentBalance: null,
    taskList: [],
    connectedPeers: null,
    peerInfo: [],
    golemStatus: ["client", "start", "pre"],
    footerInfo: null,
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

let badgeActive = false
let badgeTemp = 0
let _isPasswordModalPopped = false

const realTime = (state = initialState, action) => {
    switch (action.type) {
    case SET_BALANCE:
        return Object.assign({}, state, {
            balance: action.payload
        });

    case SET_TASKLIST:
        let badge = 0
        action.payload && action.payload.forEach((item) => {
            item.status === 'In Progress' && (badge = badge + 1)
        })
        if (badge !== badgeTemp) {
            ipcRenderer.send('set-badge', badge)
            badgeTemp = badge
            badgeActive || (badgeActive = true)
        } else if (badge === 0 && badgeActive) {
            ipcRenderer.send('set-badge', 0)
            badgeActive = false
        }
        return Object.assign({}, state, {
            taskList: action.payload
        });

    case SET_CONNECTED_PEERS:
        return Object.assign({}, state, {
            peerInfo: action.payload,
            connectedPeers: action.payload.length
        });

    case SET_GOLEM_STATUS:
        _isPasswordModalPopped = false
        return Object.assign({}, state, {
            golemStatus: action.payload
        });

    case SET_PASSWORD_MODAL:
        return Object.assign({}, state, {
            passwordModal: Object.assign({}, state.passwordModal, {
                ...action.payload
            })
        });

    case SET_FOOTER_INFO:
        return Object.assign({}, state, {
            footerInfo: action.payload
        });

    case SET_CONCENT_DEPOSIT_BALANCE:
        const {value, status, timelock} = action.payload
        return Object.assign({}, state, {
            concentBalance: action.payload
        });

    default:
        return state
    }
}

export default realTime

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
        (state) => state.passwordModal,
        (state, key) => key,
        (golemStatus, connectedPeers, passwordModal, key) => {
            let statusObj = getGolemStatus.apply(null, golemStatus)
            
            if(statusObj.status !== "Exception"){
                if(Number.isInteger(connectedPeers)){
                    statusObj = {
                        status: 'Ready',
                        message: nodesString(connectedPeers),
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
        const currentStatus = getStatusSelector(state, 'golemStatus')
        if(currentStatus){
            if(currentStatus.message === password.REGISTER && !_isPasswordModalPopped){
                passwordModal = {...passwordModal,  status: true, register: true}
                _isPasswordModalPopped = true
            }
            else if(currentStatus.message === password.LOGIN && !_isPasswordModalPopped){
                passwordModal = {...passwordModal, status: true, register: false}
                _isPasswordModalPopped = true
            }
        }

        return passwordModal
    })(
        (state, key) => key // Cache selectors by type name
    )