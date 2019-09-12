const { remote } = window.electron;
const log = remote.require('./electron/debug_handler.js');
const { CUSTOM_RPC } = remote.require('./electron/golem_config.js');

export let config = Object.freeze({
    //WS_URL: 'ws://127.0.0.1:8080/ws',
    WS_URL: `wss://${CUSTOM_RPC || 'localhost:61000'}/ws`,
    //REALM: 'realm1',
    REALM: 'golem',
    AUTHID: 'electron',
    UPDATE_CH: 'net.new_version',
    //Settings
    GET_SETTINGS_RPC: 'env.opts',
    UPDATE_SETTINGS_RPC: 'env.opts.update',
    UPDATE_SETTING_RPC: 'env.opt.update',
    //Account
    GET_DATA_DIR_RPC: 'env.datadir',
    GET_KEY_ID_RPC: 'crypto.keys.id',
    GET_PUBLIC_KEY_RPC: 'crypto.keys.pub',
    GET_STATUS_RPC: 'get_status',
    WITHDRAW_RPC: 'pay.withdraw',
    GAS_COST_RPC: 'pay.withdraw.gas_cost',
    //Network
    GET_NODE_RPC: 'net.ident',
    GET_NODE_KEY_RPC: 'net.ident.key',
    GET_KNOWN_PEERS_RPC: 'net.peers.known',
    GET_CONNECTED_PEERS_RPC: 'net.peers.connected',
    BLOCK_NODE_RPC: 'net.peer.block',
    CONNECTION_CH: 'evt.net.connection',
    GET_P2P_PORT_RPC: 'net.p2p.port',
    GET_TASK_SERVER_PORT_RPC: 'net.tasks.port',
    GET_COMPUTING_TRUST_RPC: 'rep.comp',
    GET_REQUESTING_TRUST_RPC: 'rep.requesting',
    GET_PROVIDER_STATUS: 'provider.status',
    //Tasks
    GET_TASKS_RPC: 'comp.tasks',
    GET_TASKS_CH: 'evt.comp.task.list',
    RUN_TEST_TASK_RPC: 'comp.tasks.check',
    ABORT_TEST_TASK_RPC: 'comp.tasks.check.abort',
    CHECK_TEST_STATUS_RPC: 'comp.task.test.status',
    GET_TASKS_STATS_RPC: 'comp.tasks.stats',
    GET_KNOWN_TASKS_RPC: 'comp.tasks.known',
    REMOVE_TASK_HEADER_RPC: 'comp.tasks.known.delete',
    GET_TASK_RPC: 'comp.task',
    QUERY_TASK_STATE_RPC: 'comp.task.state',
    CREATE_TASK_RPC: 'comp.task.create',
    DELETE_TASK_RPC: 'comp.task.delete',
    ABORT_TASK_RPC: 'comp.task.abort',
    RESTART_TASK_RPC: 'comp.task.restart',
    GET_SUBTASKS_RPC: 'comp.task.subtasks',
    GET_SUBTASK_RPC: 'comp.task.subtask',
    GET_FRAGMENTS_RPC: 'comp.task.rendering.task_fragments',
    GET_SUBTASKS_BORDER_RPC: 'comp.task.subtasks.borders',
    GET_SUBTASKS_FRAMES_RPC: 'comp.task.subtasks.frames',
    RESTART_SUBTASK_RPC: 'comp.task.subtask.restart',
    RESTART_SUBTASKS_RPC: 'comp.task.subtasks.restart',
    TASK_TEST_STATUS_CH: 'evt.comp.task.test.status',
    GET_ESTIMATED_COST_RPC: 'comp.tasks.estimated.cost',
    GET_ESTIMATED_COSTS_RPC: 'comp.tasks.estimated.costs',
    GET_SUBTASK_ESTIMATED_COSTS_RPC: 'comp.task.subtasks.estimated.cost',
    GET_PREVIEW_LIST_RPC: 'comp.task.preview',
    GET_GAS_PRICE_RPC: 'pay.gas_price',
    //Files management
    GET_RES_DIRS_RPC: 'res.dirs',
    GET_RES_DIR_RPC: 'res.dir',
    GET_RES_DIR_SIZE_RPC: 'res.dirs.size',
    CLEAR_DIR_RPC: 'res.dir.clear',
    //Environments
    GET_ENVIRONMENTS_RPC: 'comp.environments',
    GET_ENVIRONMENTS_PERF_RPC: 'comp.environments.perf',
    ENABLE_ENVIRONMENT_RPC: 'comp.environment.enable',
    DISABLE_ENVIRONMENT_RPC: 'comp.environment.disable',
    RUN_BENCHMARK_RPC: 'comp.environment.benchmark',
    GET_PERFORMANCE_RPC: 'comp.environment.performance',
    GET_PERF_MULTIPLIER_RPC: 'performance.multiplier',
    SET_PERF_MULTIPLIER_RPC: 'performance.multiplier.update',
    //Payment
    BALANCE_RPC: 'pay.balance',
    PAYMENTS_RPC: 'pay.payments',
    PAYMENT_ADDRESS_RPC: 'pay.ident',
    INCOME_RPC: 'pay.incomes',
    DEPOSIT_RPC: 'pay.deposit_payments',
    BALANCE_CH: 'evt.pay.balance',
    CONCENT_DEPOSIT_BALANCE_RPC: 'pay.deposit_balance',
    //General
    VERSION_RPC: 'golem.version',
    CHAIN_INFO_RPC: 'golem.mainnet',
    VIRTUALIZATION_RPC: 'env.hw.virtualization',
    QUIT_RPC: 'ui.quit',
    START_GOLEM_RPC: 'ui.start',
    STOP_GOLEM_RPC: 'ui.stop',
    SET_PASSWORD_RPC: 'golem.password.set',
    LOCK_CONFIG_CH: 'evt.ui.widget.config.lock',
    GOLEM_STATUS_RPC: 'golem.status',
    GOLEM_STATUS_CH: 'evt.golem.status',
    GET_TERMS_RPC: 'golem.terms.show',
    CHECK_TERMS_RPC: 'golem.terms',
    ACCEPT_TERMS_RPC: 'golem.terms.accept',
    GET_CONCENT_TERMS_RPC: 'golem.concent.terms.show',
    CHECK_CONCENT_TERMS_RPC: 'golem.concent.terms',
    ACCEPT_CONCENT_TERMS_RPC: 'golem.concent.terms.accept',
    //Hardware Presets
    PRESETS_RPC: 'env.hw.presets',
    PRESET_RPC: 'env.hw.preset',
    PRESET_CREATE_RPC: 'env.hw.preset.create',
    PRESET_ACTIVATE_RPC: 'env.hw.preset.activate',
    PRESET_UPDATE_RPC: 'env.hw.preset.update',
    PRESET_DELETE_RPC: 'env.hw.preset.delete',
    HARDWARE_CAPS_RPC: 'env.hw.caps',
    //Task Presets
    TASK_PRESETS_RPC: 'comp.tasks.preset.get',
    SAVE_TASK_PRESET_RPC: 'comp.tasks.preset.save',
    DELETE_TASK_PRESET_RPC: 'comp.tasks.preset.delete',
    //Concent
    CONCENT_UNLOCK: 'pay.deposit.unlock',
    CONCENT_RELOCK: 'pay.deposit.relock',
    CONCENT_SWITCH_RPC: 'golem.concent.switch.turn',
    CONCENT_SWITCH_STATUS_RPC: 'golem.concent.switch'
});

function errorCallback(topic, _eb, { error, details, argsList }) {
    console.warn(
        'SAGA > HANDLER',
        `Fetch ${topic} failed!`,
        error,
        details,
        Array.isArray(argsList) ? argsList.join() : argsList
    );
    log.warn(
        'SAGA > HANDLER',
        `Fetch ${topic} failed!`,
        error,
        details,
        Array.isArray(argsList) ? argsList.join() : argsList
    );
    _eb && _eb(error, details, argsList);
}

/**
 * [_handleSUBPUB func. subscribe constructor for wamp ]
 * @param  {function}   _callback   [Callback function for changes]
 * @param  {Object}     _session    [Websocket connection session]
 * @param  {String}     _channel    [Subscription address]
 * @return nothing
 */
export let _handleSUBPUB = (_callback, _session, _channel, _eb) => {
    let cb = {
        onEvent: ({ argsList }) => _callback(argsList),
        onSuccess: function() {
            console.log(`subscribed to ${_channel} topic`);
        },

        onError: errorCallback.bind(null, _channel)
    };
    _session.subscribe(_channel, cb, _eb);
};

/**
 * [_handleUNSUBPUB func. unsubscribe constructor for wamp ]
 * @param  {function}   _callback   [Callback function for changes]
 * @param  {Object}     _session    [Websocket connection session]
 * @param  {String}     _channel    [Subscription address]
 * @return nothing
 */
export let _handleUNSUBPUB = (_callback, _session, _channel, _eb) => {
    let cb = {
        onEvent: ({ argsList }) => _callback(argsList),
        onSuccess: function() {
            console.log(`unsubscribed to ${_channel} topic`);
        },
        onError: errorCallback.bind(null, _channel)
    };
    _session.unsubscribe(_channel, cb, _eb);
};

/**
 * [_handleRPC func. remote procedure call constructor for wamp ]
 * @param   {function}      _callback       [Callback function for sucessful execution]
 * @param   {Object}        _session        [Websocket connection session]
 * @param   {String}        _rpc_address    [RPC address]
 * @param   {Object}        _parameter      [RPC parameter (optional)]
 * @return nothing
 */
export let _handleRPC = (
    _callback,
    _session,
    _rpc_address,
    _parameter = null,
    _eb
) => {
    _session.call(_rpc_address, _parameter, {
        onSuccess: ({ argsList }) => _callback(argsList),
        onError: errorCallback.bind(null, _rpc_address, _eb)
    });
};
