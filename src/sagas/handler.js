export let config = Object.freeze({
    //WS_URL: 'ws://127.0.0.1:8080/ws',
    WS_URL: 'ws://127.0.0.1:61000/ws',
    //REALM: 'realm1',
    REALM: 'golem',
    COUNTER_CH: 'com.golem.oncounter',
    BLENDER_CH: 'com.golem.blender',
    PREVIEW_CH: 'com.golem.preview',
    UPLOAD_CH: 'com.golem.upload.on_progress',
    LOCK_CONFIG_CH: 'evt.ui.widget.config.lock',
    //Settings
    GET_SETTINGS_RPC: 'env.opts',
    UPDATE_SETTINGS_RPC: 'env.opts.update',
    //Account
    GET_DATA_DIR_RPC: 'env.datadir',
    GET_KEY_ID_RPC: 'crypto.keys.id',
    GET_PUBLIC_KEY_RPC: 'crypto.keys.pub',
    GET_STATUS_RPC: 'get_status',
    //Network
    GET_NODE_RPC: 'net.ident',
    GET_NODE_KEY_RPC: 'net.ident.key',
    GET_KNOWN_PEERS_RPC: 'net.peers.known',
    GET_CONNECTED_PEERS_RPC: 'net.peers.connected',
    CONNECTION_CH: 'evt.net.connection',
    GET_P2P_PORT_RPC: 'net.p2p.port',
    GET_TASK_SERVER_PORT_RPC: 'net.tasks.port',
    GET_COMPUTING_TRUST_RPC: 'rep.comp',
    GET_REQUESTING_TRUST_RPC: 'rep.requesting',
    //Tasks
    GET_TASKS_RPC: 'comp.tasks',
    GET_TASKS_CH: 'evt.comp.task.list',
    RUN_TEST_TASK_RPC: 'comp.tasks.check',
    ABORT_TEST_TASK_RPC: 'comp.tasks.check.abort',
    GET_TASKS_STATS_RPC: 'comp.tasks.stats',
    GET_KNOWN_TASKS_RPC: 'comp.tasks.known',
    REMOVE_TASK_HEADER_RPC: 'comp.tasks.known.delete',
    GET_TASK_RPC: 'comp.task',
    GET_TASK_COST_RPC: 'comp.task.cost',
    QUERY_TASK_STATE_RPC: 'comp.task.state',
    CREATE_TASK_RPC: 'comp.task.create',
    DELETE_TASK_RPC: 'comp.task.delete',
    ABORT_TASK_RPC: 'comp.task.abort',
    RESTART_TASK_RPC: 'comp.task.restart',
    GET_SUBTASKS_RPC: 'comp.task.subtasks',
    GET_SUBTASK_RPC: 'comp.task.subtask',
    RESTART_SUBTASK_RPC: 'comp.task.subtask.restart',
    //Files management
    GET_RES_DIRS_RPC: 'res.dirs',
    GET_RES_DIR_RPC: 'res.dir',
    GET_RES_DIR_SIZE_RPC: 'res.dirs.size',
    CLEAR_DIR_RPC: 'res.dir.clear',
    //Environments
    GET_ENVIRONMENTS_RPC: 'comp.environments',
    GET_ENVIRONMENTS_PERF_RPC: 'comp.environments.perf',
    ENABLE_ENVIRONMENT_RPC: 'comp.environment.enable',
    DISABLE_ENVIRONMENT_RPC: 'comp.environment.enable',
    RUN_BENCHMARK_RPC: 'comp.environment.benchmark',
    //Payment
    BALANCE_RPC: 'pay.balance',
    PAYMENTS_RPC: 'pay.payments',
    PAYMENT_ADDRESS_RPC: 'pay.ident',
    INCOME_RPC: 'pay.incomes',
    BALANCE_CH: 'evt.pay.balance',
    //General
    QUIT_RPC: 'ui.quit',
    LOCK_CONFIG_CH: 'evt_lock_config',
    //Hardware Presets
    PRESETS_RPC: 'env.hw.presets',
    PRESET_RPC: 'env.hw.preset',
    PRESET_CREATE_RPC: 'env.hw.preset.create',
    PRESET_ACTIVATE_RPC: 'env.hw.preset_activate',
    PRESET_UPDATE_RPC: 'env.hw.preset_update',
    PRESET_DELETE_RPC: 'env.hw.preset_delete',
})


/**
 * [_handleSUBPUB func. subscribe constructor for wamp ]
 * @param  {function}   _callback   [Callback function for changes]
 * @param  {Object}     _session    [Websocket connection session]
 * @param  {String}     _channel    [Subscription address]
 * @return nothing
 */
export let _handleSUBPUB = (_callback, _session, _channel) => {
    let cb = {
        onEvent: _callback,
        onSuccess: function() {
            console.log(`un/subscribed to ${_channel} topic`);
        },
        onError: function(err) {
            console.warn(`failed to un/subscribe ${_channel} topic`, err);
        }
    }
    _session.subscribe(_channel, cb)
}

/**
 * [_handleUNSUBPUB func. unsubscribe constructor for wamp ]
 * @param  {function}   _callback   [Callback function for changes]
 * @param  {Object}     _session    [Websocket connection session]
 * @param  {String}     _channel    [Subscription address]
 * @return nothing
 */
export let _handleUNSUBPUB = (_callback, _session, _channel) => {
    let cb = {
        onEvent: _callback,
        onSuccess: function() {
            console.log(`un/subscribed to ${_channel} topic`);
        },
        onError: function(err) {
            console.warn(`failed to un/subscribe ${_channel} topic`, err);
        }
    }
    _session.unsubscribe(_channel, cb)
}

/**
 * [_handleRPC func. remote procedure call constructor for wamp ]
 * @param   {function}      _callback       [Callback function for sucessful execution]
 * @param   {Object}        _session        [Websocket connection session]
 * @param   {String}        _rpc_address    [RPC address]
 * @param   {Object}        _parameter      [RPC parameter (optional)]
 * @return nothing
 */
export let _handleRPC = (_callback, _session, _rpc_address, _parameter = null) => {
    _session.call(_rpc_address, _parameter, {
        onSuccess: _callback,
        onError: function(err, details, arr) {
            console.log(`Fetch ${_rpc_address} failed!`, err, details, arr);
        }
    })
}