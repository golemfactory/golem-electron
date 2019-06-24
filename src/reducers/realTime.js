import { BigNumber } from 'bignumber.js';
import createCachedSelector from 're-reselect';
import { some } from 'lodash';
import { dict } from './../actions';
import checkNested from './../utils/checkNested';
const { ipcRenderer, remote } = window.electron;
const log = remote.require('./electron/debug_handler.js');
const { setConfig, getConfig, dictConfig } = remote.getGlobal('configStorage');

const { CONCENT_BALANCE_STATE } = dictConfig;
const {
    SET_BALANCE,
    SET_TASKLIST,
    SET_CONNECTED_PEERS,
    SET_GOLEM_STATUS,
    SET_FOOTER_INFO,
    SET_PASSWORD_MODAL,
    SET_PASSWORD,
    SET_CONCENT_DEPOSIT_BALANCE
} = dict;

const tempCBSString = CONCENT_BALANCE_STATE && getConfig(CONCENT_BALANCE_STATE);
const tempCBS = tempCBSString ? JSON.parse(tempCBSString) : null;
const lastConcentBalance = tempCBS
    ? {
          value: new BigNumber(tempCBS.value),
          status: tempCBS.status,
          timelock: tempCBS.timelock
      }
    : null;

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
    concentBalance: lastConcentBalance || null,
    taskList: [],
    connectedPeers: null,
    peerInfo: [],
    golemStatus: [{ client: ['start', 'pre', null] }],
    footerInfo: null,
    passwordModal: {
        status: false,
        register: false,
        error: false
    }
};

const password = {
    REGISTER: 'Requires new password',
    LOGIN: 'Requires password'
};

const statusDict = {
    READY: 'Ready',
    NOTREADY: 'Not Ready',
    EXCEPTION: 'Exception',
    WARNING: 'Warning'
};

let badgeActive = false;
let badgeTemp = 0;
let _isPasswordModalPopped = false;

const realTime = (state = initialState, action) => {
    switch (action.type) {
        case SET_BALANCE:
            return Object.assign({}, state, {
                balance: action.payload
            });

        case SET_TASKLIST:
            let badge = 0;
            action.payload &&
                action.payload.forEach(item => {
                    item.status === 'In Progress' && (badge = badge + 1);
                });
            if (badge !== badgeTemp) {
                ipcRenderer.send('set-badge', badge);
                badgeTemp = badge;
                badgeActive || (badgeActive = true);
            } else if (badge === 0 && badgeActive) {
                ipcRenderer.send('set-badge', 0);
                badgeActive = false;
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
            const { value, status, timelock } = action.payload;
            setConfig(CONCENT_BALANCE_STATE, JSON.stringify(action.payload));
            return Object.assign({}, state, {
                concentBalance: action.payload
            });

        default:
            return state;
    }
};

export default realTime;

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
        allocation: {
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
        'vm.restore': {
            pre: 'Restoring Docker VM',
            post: 'Docker VM restored',
            exception: 'Error restoring Docker VM'
        },
        'vm.setup': {
            warning: ''
        },
        'vm.start': {
            warning: ''
        },
        'vm.stop': {
            pre: 'Creating Docker VM',
            post: 'Docker VM created',
            exception: 'Error stopping a VM'
        },
        'instance.check': {
            pre: 'Checking for Docker VM',
            post: 'Docker VM is available',
            exception: 'Docker VM is not available'
        }
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
        sync: {
            pre: 'Syncing chain',
            post: 'Chain synced',
            exception: 'Chain sync error'
        }
    },
    client: {
        get_password: {
            pre: 'Requires password',
            post: 'Logged In',
            exception: 'Problem with password'
        },
        new_password: {
            pre: 'Requires new password',
            post: 'Registered',
            exception: 'Problem with password'
        },
        sync: {
            pre: 'Syncing Golem',
            post: 'Golem synced',
            exception: 'Error syncing Golem'
        },
        start: {
            pre: 'Starting Golem',
            post: 'Connecting to network',
            exception: 'Error starting Golem'
        },
        stop: {
            pre: 'Stopping Golem',
            post: 'Golem has stopped',
            exception: 'Error stopping Golem'
        },
        quit: {
            pre: 'Terminating Golem',
            post: 'Golem terminated',
            exception: 'Error terminating Golem'
        }
    }
};

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = mapFn(object[key], key);
        return result;
    }, {});
}

function nodesString(num) {
    if (num < 1) return 'No Nodes Connected';
    const postfix = num != 1 ? 's' : '';
    return `${num} Node${postfix}`;
}

function dig(src, ...rest) {
    for (let arg of rest) src = src[arg];
    return src;
}

function getGolemStatus(component, method, stage, data) {
    const result = {};

    try {
        result.message = dig(messages, component, method, stage);
    } catch (e) {
        result.message = `Golem - ${component}`;
        log.warn(
            'SAGA > GOLEM',
            `${e}: Given "${component}.${method}.${stage}" status doesn't defined on Golem Client!`
        );
    }

    if (stage == 'exception') {
        result.status = statusDict.EXCEPTION;
    } else if (stage == 'post') {
        result.status = statusDict.READY;
    } else if (stage == 'warning') {
        result.status = statusDict.WARNING;
        result.data = data;
    } else
        try {
            result.status = statusDict.NOTREADY;
        } catch (e) {
            log.warn('SAGA > GOLEM', e);
        }

    return result;
}

export const getStatusSelector = createCachedSelector(
    state => state.golemStatus,
    state => state.connectedPeers,
    state => state.isEngineOn,
    (state, key) => key,
    (golemStatus, connectedPeers, isEngineOn, key) => {
        let statusObj = objectMap(golemStatus[0], (status, component) =>
            getGolemStatus.apply(null, [component].concat(status))
        );

        if (
            statusObj &&
            !Object.keys(statusObj).some(
                key => statusObj[key].status === statusDict.EXCEPTION
            )
        ) {
            if (statusObj[0]) {
                statusObj.client = {
                    status: statusDict.EXCEPTION,
                    message: 'Outdated version'
                };
            } else if (isEngineOn && Number.isInteger(connectedPeers)) {
                statusObj.client = {
                    status: statusDict.READY,
                    message: nodesString(connectedPeers)
                };
            } else if (
                checkNested(statusObj, 'client', 'message') &&
                !(
                    statusObj.client.message === password.LOGIN ||
                    statusObj.client.message === password.REGISTER
                )
            ) {
                statusObj.client = {
                    status: statusDict.NOTREADY,
                    message: isEngineOn
                        ? statusObj.client.message || 'Starting Golem'
                        : 'Waiting for configuration'
                };
            }
        }

        return statusObj;
    }
)(
    (state, key) => key // Cache selectors by type name
);

export const passwordModalSelector = createCachedSelector(
    state => state,
    state => state.passwordModal,
    (state, key) => key,
    (state, passwordModal) => {
        const currentStatus = getStatusSelector(state, 'golemStatus');

        if (currentStatus && currentStatus.client) {
            const clientMessage = currentStatus.client;
            if (clientMessage.message === password.REGISTER) {
                passwordModal = {
                    ...passwordModal,
                    status: true,
                    register: true
                };
            } else if (clientMessage.message === password.LOGIN) {
                passwordModal = {
                    ...passwordModal,
                    status: true,
                    register: false
                };
            }
        }

        return passwordModal;
    }
)(
    (state, key) => key // Cache selectors by type name
);

export const concentDepositStatusSelector = createCachedSelector(
    state => state.concentBalance,
    (state, key) => key,
    (concentBalance, key) => {
        if (concentBalance) {
            switch (concentBalance.status) {
                case 'unlocking':
                    return { statusCode: 2, time: concentBalance.timelock };
                case 'unlocked':
                    return { statusCode: 1, time: null };
                default:
                    return { statusCode: 0, time: null }; //locked
            }
        }
        return { statusCode: 0, time: null };
    }
)(
    (state, key) => key // Cache selectors by type name
);

const warningCollector = [];
export const componentWarningSelector = createCachedSelector(
    state => state,
    state => state.componentWarnings,
    (state, key) => key,
    (state, componentWarnings, key) => {
        const currentStatus = getStatusSelector(state, 'golemStatus');
        const hypervisorData = currentStatus?.hypervisor?.data;

        addWarning(hypervisorData, 'smb_blocked', 'PORT');
        addWarning(hypervisorData, 'lowered_memory', 'RAM');
        addWarning(hypervisorData, 'low_diskspace', 'DISK');

        return componentWarnings.concat(warningCollector);
    }
)(
    (state, key) => key // Cache selectors by type name
);

function addWarning(data, title, unit) {
    if (
        data?.status == title &&
        !some(warningCollector, {
            status: true,
            issue: unit
        })
    ) {
        warningCollector.push({
            status: true,
            issue: unit
        });
    }
}
