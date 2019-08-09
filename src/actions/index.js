export let dict = Object.freeze({
    ONBOARDING: 'ONBOARDING',
    UPDATE_NODE_NAME: 'UPDATE_NODE_NAME',
    //ACCOUNT
    SET_PUBLIC_KEY: 'SET_PUBLIC_KEY',
    CALL_WITHDRAW_MODAL: 'CALL_WITHDRAW_MODAL',
    WITHDRAW: 'WITHDRAW',
    GET_GAS_COST: 'GET_GAS_COST',
    SET_PASSWORD: 'SET_PASSWORD',
    //NETWORK
    SET_BALANCE: 'SET_BALANCE',
    SET_RESOURCES: 'SET_RESOURCES',
    SET_HISTORY: 'SET_HISTORY',
    SET_SYSTEM_INFO: 'SET_SYSTEM_INFO',
    SET_ADVANCED_PRESET: 'SET_ADVANCED_PRESET',
    CREATE_ADVANCED_PRESET: 'CREATE_ADVANCED_PRESET',
    DELETE_ADVANCED_PRESET: 'DELETE_ADVANCED_PRESET',
    SET_ADVANCED_CHART: 'SET_ADVANCED_CHART',
    SET_CHOSEN_HARDWARE_PRESET: 'SET_CHOSEN_HARDWARE_PRESET',
    SET_ADVANCED_MANUALLY: 'SET_ADVANCED_MANUALLY',
    BLOCK_NODE: 'BLOCK_NODE',
    SET_CONCENT_DEPOSIT_BALANCE: 'SET_CONCENT_DEPOSIT_BALANCE',
    //TASKS
    SET_TASKLIST: 'SET_TASKLIST',
    SET_TASK_DETAILS: 'SET_TASK_DETAILS',
    GET_TASK_DETAILS: 'GET_TASK_DETAILS',
    FETCH_HEALTHY_NODE_NUMBER: 'FETCH_HEALTHY_NODE_NUMBER',
    SET_HEALTHY_NODE_NUMBER: 'SET_HEALTHY_NODE_NUMBER',
    SET_TASK_INFO: 'SET_TASK_INFO',
    SET_PREVIEW: 'SET_PREVIEW',
    UPDATE_PREVIEW_LOCK: 'UPDATE_PREVIEW_LOCK',
    DELETE_TASK: 'DELETE_TASK',
    CREATE_TASK: 'CREATE_TASK',
    ADD_MISSING_TASK_FILES: 'ADD_MISSING_TASK_FILES',
    RESTART_TASK: 'RESTART_TASK',
    RESTART_FRAME: 'RESTART_FRAME',
    RESTART_SUBTASK: 'RESTART_SUBTASK',
    RUN_TEST_TASK: 'RUN_TEST_TASK',
    ABORT_TEST_TASK: 'ABORT_TEST_TASK',
    SET_TASK_TEST_STATUS: 'SET_TASK_TEST_STATUS',
    GET_ESTIMATED_COST: 'GET_ESTIMATED_COST',
    SET_ESTIMATED_COST: 'SET_ESTIMATED_COST',
    CLEAR_TASK_PLAIN: 'CLEAR_TASK_PLAIN',
    GET_TASK_PRESETS: 'GET_TASK_PRESETS',
    SET_TASK_PRESETS: 'SET_TASK_PRESETS',
    SAVE_TASK_PRESET: 'SAVE_TASK_PRESET',
    DELETE_TASK_PRESET: 'DELETE_TASK_PRESET',
    SET_FOOTER_INFO: 'SET_FOOTER_INFO',
    GET_TASK_GAS_PRICE: 'GET_TASK_GAS_PRICE',
    SET_TASK_GAS_PRICE: 'SET_TASK_GAS_PRICE',
    SET_DIRECTORY_TREE: 'SET_DIRECTORY_TREE',
    GET_FRAGMENTS: 'GET_FRAGMENTS',
    SET_FRAGMENTS: 'SET_FRAGMENTS',
    CLEAR_FRAGMENTS: 'CLEAR_FRAGMENTS',
    //SETTINGS
    SET_FILE_LOCATION: 'SET_FILE_LOCATION',
    SET_LOCAL_GETH: 'SET_LOCAL_GETH',
    SET_PERFORMANCE_CHARTS: 'SET_PERFORMANCE_CHARTS',
    RECOUNT_BENCHMARK: 'RECOUNT_BENCHMARK',
    SET_PROV_MIN_PRICE: 'SET_PROV_MIN_PRICE',
    SET_REQ_MAX_PRICE: 'SET_REQ_MAX_PRICE',
    SET_AVATAR: 'SET_AVATAR',
    SET_NODE_NAME: 'SET_NODE_NAME',
    SET_PROV_TRUST: 'SET_PROV_TRUST',
    SET_REQ_TRUST: 'SET_REQ_TRUST',
    SET_NET_PROV_TRUST: 'SET_NET_PROV_TRUST',
    SET_NET_REQ_TRUST: 'SET_NET_REQ_TRUST',
    SET_PROVIDING: 'SET_PROVIDING',
    SET_GPU_PROVIDING: 'SET_GPU_PROVIDING',
    SET_TASK_STATS: 'SET_TASK_STATS',
    IS_NODE_PROVIDER: 'IS_NODE_PROVIDER',
    SET_MULTIPLIER: 'SET_MULTIPLIER',
    UPDATE_MULTIPLIER: 'UPDATE_MULTIPLIER',
    SET_ENVIRONMENTS: 'SET_ENVIRONMENTS',
    ENABLE_ENVIRONMENT: 'ENABLE_ENVIRONMENT',
    DISABLE_ENVIRONMENT: 'DISABLE_ENVIRONMENT',
    TOGGLE_CONCENT: 'TOGGLE_CONCENT',
    UNLOCK_CONCENT_DEPOSIT: 'UNLOCK_CONCENT_DEPOSIT',
    SET_CONCENT_SWITCH: 'SET_CONCENT_SWTICH',
    SET_CONCENT_ONBOARDING_SHOWN: 'SET_CONCENT_ONBOARDING_SHOWN',
    //NOTIFICATION_CENTER
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    SET_SEEN_NOTIFICATION: 'SET_SEEN_NOTIFICATION',
    //FRAME WINDOW
    SET_ALL_FRAMES: 'SET_ALL_FRAMES',
    SET_FRAMES_WITH_SUBTASKS: 'SET_FRAMES_WITH_SUBTASKS',
    SET_CONNECTED_PEERS: 'SET_CONNECTED_PEERS',
    SET_SUBTASKS_BORDER: 'SET_SUBTASKS_BORDER',
    SET_PREVIEW_LIST: 'SET_PREVIEW_LIST',
    SET_SUBTASKS_LIST: 'SET_SUBTASKS_LIST',
    FETCH_SUBTASKS_LIST: 'FETCH_SUBTASKS_LIST',
    SET_SUBTASKS_VISIBILITY: 'SET_SUBTASKS_VISIBILITY',
    SET_FRAME_ID: 'SET_FRAME_ID',
    SET_FRAME_INDEX: 'SET_FRAME_INDEX',
    NEXT_FRAME: 'NEXT_FRAME',
    PREVIOUS_FRAME: 'PREVIOUS_FRAME',
    //GENERAL
    APP_QUIT: 'APP_QUIT',
    APP_QUIT_GRACEFUL: 'APP_QUIT_GRACEFUL',
    TOGGLE_FORCE_QUIT: 'TOGGLE_FORCE_QUIT',
    SET_CONNECTION: 'SET_CONNECTION',
    SET_GOLEM_VERSION: 'SET_GOLEM_VERSION',
    SET_CHAIN_INFO: 'SET_CHAIN_INFO',
    SET_VIRTUALIZATION_STATUS: 'SET_VIRTUALIZATION_STATUS',
    SET_LATEST_VERSION: 'SET_LATEST_VERSION',
    UPDATE_SEEN: 'UPDATE_SEEN',
    START_GOLEM: 'START_GOLEM',
    STOP_GOLEM: 'STOP_GOLEM',
    CONTINUE_WITH_PROBLEM: 'CONTINUE_WITH_PROBLEM',
    SET_GOLEM_STATUS: 'SET_GOLEM_STATUS',
    SET_GOLEM_PAUSE_STATUS: 'SET_GOLEM_PAUSE_STATUS',
    SET_GOLEM_LOADING_STATUS: 'SET_GOLEM_LOADING_STATUS',
    START_LOADING: 'START_LOADING',
    END_LOADING: 'END_LOADING',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    LOGIN_FRAME: 'LOGIN_FRAME',
    LOGOUT_FRAME: 'LOGOUT_FRAME',
    SET_AUTOLAUNCH: 'SET_AUTOLAUNCH',
    SET_PREVIEW_RADIO: 'SET_PREVIEW_RADIO',
    SET_PREVIEW_EXPANDED: 'SET_PREVIEW_EXPANDED',
    SET_CURRENCY: 'SET_CURRENCY',
    SET_ZOOM_RATIO: 'SET_ZOOM_RATIO',
    SET_NETWORK_INFO: 'SET_NETWORK_INFO',
    TOGGLE_DEVELOPER_MODE: 'TOGGLE_DEVELOPER_MODE',
    SET_PASSWORD_MODAL: 'SET_PASSWORD_MODAL',
    ADD_QUEUE: 'ADD_QUEUE',
    REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
    SET_TERMS: 'SET_TERMS',
    CHECK_TERMS_ACCEPTED: 'CHECK_TERMS_ACCEPTED',
    ACCEPT_TERMS: 'ACCEPT_TERMS',
    SET_TERMS_STATUS: 'SET_TERMS_STATUS',
    SET_CONCENT_TERMS: 'SET_CONCENT_TERMS',
    CHECK_CONCENT_TERMS_ACCEPTED: 'CHECK_CONCENT_TERMS_ACCEPTED',
    ACCEPT_CONCENT_TERMS: 'ACCEPT_CONCENT_TERMS',
    SET_CONCENT_TERMS_STATUS: 'SET_CONCENT_TERMS_STATUS',
    //ERROR
    SET_CONNECTION_PROBLEM: 'SET_CONNECTION_PROBLEM',
    SET_COMPONENT_WARNING: 'SET_COMPONENT_WARNING',
    SET_FILE_CHECK: 'SET_FILE_CHECK'
});

const {
    ONBOARDING,
    UPDATE_NODE_NAME,
    //ACCOUNT
    CALL_WITHDRAW_MODAL,
    WITHDRAW,
    GET_GAS_COST,
    SET_PASSWORD,
    //NETWORK
    SET_BALANCE,
    SET_RESOURCES,
    SET_HISTORY,
    SET_SYSTEM_INFO,
    SET_ADVANCED_PRESET,
    CREATE_ADVANCED_PRESET,
    DELETE_ADVANCED_PRESET,
    SET_ADVANCED_CHART,
    SET_CHOSEN_HARDWARE_PRESET,
    SET_ADVANCED_MANUALLY,
    BLOCK_NODE,
    //TASKS
    SET_TASKLIST,
    SET_TASK_DETAILS,
    GET_TASK_DETAILS,
    FETCH_HEALTHY_NODE_NUMBER,
    SET_TASK_INFO,
    SET_PREVIEW,
    UPDATE_PREVIEW_LOCK,
    DELETE_TASK,
    CREATE_TASK,
    ADD_MISSING_TASK_FILES,
    RESTART_TASK,
    RESTART_FRAME,
    RESTART_SUBTASK,
    RUN_TEST_TASK,
    ABORT_TEST_TASK,
    SET_TASK_TEST_STATUS,
    GET_ESTIMATED_COST,
    SET_ESTIMATED_COST,
    CLEAR_TASK_PLAIN,
    GET_TASK_PRESETS,
    SET_TASK_PRESETS,
    SAVE_TASK_PRESET,
    DELETE_TASK_PRESET,
    SET_FOOTER_INFO,
    GET_TASK_GAS_PRICE,
    GET_FRAGMENTS,
    CLEAR_FRAGMENTS,
    SET_DIRECTORY_TREE,
    //SETTINGS
    SET_FILE_LOCATION,
    SET_LOCAL_GETH,
    SET_PERFORMANCE_CHARTS,
    RECOUNT_BENCHMARK,
    SET_PROV_MIN_PRICE,
    SET_REQ_MAX_PRICE,
    SET_AVATAR,
    SET_NODE_NAME,
    SET_PROV_TRUST,
    SET_REQ_TRUST,
    SET_NET_PROV_TRUST,
    SET_NET_REQ_TRUST,
    SET_PROVIDING,
    SET_GPU_PROVIDING,
    SET_TASK_STATS,
    UPDATE_MULTIPLIER,
    ENABLE_ENVIRONMENT,
    DISABLE_ENVIRONMENT,
    TOGGLE_CONCENT,
    UNLOCK_CONCENT_DEPOSIT,
    SET_CONCENT_ONBOARDING_SHOWN,
    //NOTIFICATION CENTER
    PUSH_NOTIFICATION,
    REMOVE_NOTIFICATION,
    SET_SEEN_NOTIFICATION,
    //FRAME WINDOW
    SET_ALL_FRAMES,
    SET_FRAMES_WITH_SUBTASKS,
    SET_SUBTASKS_BORDER,
    SET_PREVIEW_LIST,
    SET_SUBTASKS_LIST,
    FETCH_SUBTASKS_LIST,
    SET_SUBTASKS_VISIBILITY,
    SET_FRAME_ID,
    SET_FRAME_INDEX,
    NEXT_FRAME,
    PREVIOUS_FRAME,
    //GENERAL
    APP_QUIT,
    APP_QUIT_GRACEFUL,
    TOGGLE_FORCE_QUIT,
    SET_GOLEM_VERSION,
    SET_LATEST_VERSION,
    UPDATE_SEEN,
    START_GOLEM,
    STOP_GOLEM,
    CONTINUE_WITH_PROBLEM,
    SET_GOLEM_STATUS,
    SET_GOLEM_PAUSE_STATUS,
    SET_GOLEM_LOADING_STATUS,
    START_LOADING,
    END_LOADING,
    LOGIN,
    LOGOUT,
    LOGIN_FRAME,
    LOGOUT_FRAME,
    SET_CONNECTED_PEERS,
    SET_PREVIEW_RADIO,
    SET_PREVIEW_EXPANDED,
    SET_CURRENCY,
    SET_ZOOM_RATIO,
    SET_NETWORK_INFO,
    TOGGLE_DEVELOPER_MODE,
    SET_PASSWORD_MODAL,
    ADD_QUEUE,
    REMOVE_FROM_QUEUE,
    CHECK_TERMS_ACCEPTED,
    ACCEPT_TERMS,
    SET_TERMS_STATUS,
    CHECK_CONCENT_TERMS_ACCEPTED,
    ACCEPT_CONCENT_TERMS,
    SET_CONCENT_TERMS_STATUS,
    //ERROR
    SET_CONNECTION_PROBLEM,
    SET_COMPONENT_WARNING,
    SET_FILE_CHECK
} = dict;

export const updateNodeName = payload => ({
    type: UPDATE_NODE_NAME,
    payload
});

export const callWithdrawModal = (status, payload) => ({
    type: CALL_WITHDRAW_MODAL,
    payload: {
        status,
        payload
    }
});

export const withdraw = (payload, _response, _reject) => ({
    type: WITHDRAW,
    payload,
    _response,
    _reject
});

export const getGasCost = (payload, _response, _reject) => ({
    type: GET_GAS_COST,
    payload,
    _response,
    _reject
});

export const setPassword = payload => ({
    type: SET_PASSWORD,
    payload
});

export const setAllFrames = payload => ({
    type: SET_ALL_FRAMES,
    payload
});

export const setFramesWithSubTask = payload => ({
    type: SET_FRAMES_WITH_SUBTASKS,
    payload
});

export const setSubtasksBorder = payload => ({
    type: SET_SUBTASKS_BORDER,
    payload
});

export const setPreviews = payload => ({
    type: SET_PREVIEW_LIST,
    payload
});

export const setSubtasksList = payload => ({
    type: SET_SUBTASKS_LIST,
    payload
});

export const fetchSubtasksList = payload => {
    return {
        type: FETCH_SUBTASKS_LIST,
        payload
    };
};

export const setSubtasksVisibility = payload => ({
    type: SET_SUBTASKS_VISIBILITY,
    payload
});

export const setFrameId = payload => ({
    type: SET_FRAME_ID,
    payload
});

export const setFrameIndex = payload => ({
    type: SET_FRAME_INDEX,
    payload
});

export const nextFrame = () => ({
    type: NEXT_FRAME
});

export const previousFrame = () => ({
    type: PREVIOUS_FRAME
});

export const setTaskInfo = payload => ({
    type: SET_TASK_INFO,
    payload
});

export const setSystemInfo = payload => ({
    type: SET_SYSTEM_INFO,
    payload
});

export const setAdvancedPreset = payload => ({
    type: SET_ADVANCED_PRESET,
    payload
});

export const createAdvancedPreset = (payload, _resolve, _reject) => ({
    type: CREATE_ADVANCED_PRESET,
    payload,
    _resolve,
    _reject
});

export const deleteAdvancedPreset = payload => ({
    type: DELETE_ADVANCED_PRESET,
    payload
});

export const setAdvancedChart = payload => ({
    type: SET_ADVANCED_CHART,
    payload
});

export const setChosenPreset = (payload, init) => ({
    type: SET_CHOSEN_HARDWARE_PRESET,
    payload,
    init
});

export const setAdvancedManually = payload => ({
    type: SET_ADVANCED_MANUALLY,
    payload
});

export const blockNode = (payload, _resolve, _reject) => ({
    type: BLOCK_NODE,
    payload,
    _resolve,
    _reject
});

export const setHistory = payload => ({
    type: SET_HISTORY,
    payload
});

export const setResources = payload => ({
    type: SET_RESOURCES,
    payload
});

export const setConnectedPeers = payload => ({
    type: SET_CONNECTED_PEERS,
    payload
});

export const setFileLocation = payload => ({
    type: SET_FILE_LOCATION,
    payload
});

export const setLocalGeth = payload => ({
    type: SET_LOCAL_GETH,
    payload
});

export const setPerformanceCharts = payload => ({
    type: SET_PERFORMANCE_CHARTS,
    payload
});

export const setProviderMinPrice = (payload, init) => ({
    type: SET_PROV_MIN_PRICE,
    payload,
    init
});

export const setRequestorMaxPrice = (payload, init) => ({
    type: SET_REQ_MAX_PRICE,
    payload,
    init
});

export const setAvatar = payload => ({
    type: SET_AVATAR,
    payload
});

export const setNodeName = payload => ({
    type: SET_NODE_NAME,
    payload
});

export const setProviderTrust = (payload, init) => ({
    type: SET_PROV_TRUST,
    payload: payload / 100,
    init
});

export const setProviding = payload => ({
    type: SET_PROVIDING,
    payload
});

export const setGPUProviding = payload => ({
    type: SET_GPU_PROVIDING,
    payload
});

export const setRequestorTrust = (payload, init) => ({
    type: SET_REQ_TRUST,
    payload: payload / 100,
    init
});

export const setNetworkProviderTrust = payload => ({
    type: SET_NET_PROV_TRUST,
    payload
});

export const setNetworkRequestorTrust = payload => ({
    type: SET_NET_REQ_TRUST,
    payload
});

export const setTaskStats = payload => ({
    type: SET_TASK_STATS,
    payload
});

export const updateMultiplier = payload => ({
    type: UPDATE_MULTIPLIER,
    payload
});

export const enableEnvironment = payload => ({
    type: ENABLE_ENVIRONMENT,
    payload
});

export const disableEnvironment = payload => ({
    type: DISABLE_ENVIRONMENT,
    payload
});

export const toggleConcent = (isSwitchOn, informRPC, toggleLock) => ({
    type: TOGGLE_CONCENT,
    isSwitchOn,
    informRPC,
    toggleLock
});

export const unlockConcentDeposit = payload => ({
    type: UNLOCK_CONCENT_DEPOSIT,
    payload
});

export const setConcentOnboardingShown = () => ({
    type: SET_CONCENT_ONBOARDING_SHOWN
});

export const pushNotification = payload => ({
    type: PUSH_NOTIFICATION,
    payload
});

export const removeNotification = payload => ({
    type: REMOVE_NOTIFICATION,
    payload
});

export const setSeenNotification = () => ({
    type: SET_SEEN_NOTIFICATION
});

export const setTaskDetails = payload => ({
    type: SET_TASK_DETAILS,
    payload
});

export const getTaskDetails = payload => ({
    type: GET_TASK_DETAILS,
    payload
});

export const fetchHealthyNodeNumber = payload => ({
    type: FETCH_HEALTHY_NODE_NUMBER,
    payload
});

export const setPreview = payload => ({
    type: SET_PREVIEW,
    payload
});

export const updatePreviewLock = payload => ({
    type: UPDATE_PREVIEW_LOCK,
    payload
});

export const setOnboard = payload => ({
    type: ONBOARDING,
    payload
});

export const gracefulShutdown= payload => ({
    type: APP_QUIT_GRACEFUL,
    payload
});

export const toggleForceQuit= payload => ({
    type: TOGGLE_FORCE_QUIT,
    payload
});

export const setVersion = payload => ({
    type: SET_GOLEM_VERSION,
    payload
});

export const setLatestVersion = payload => ({
    type: SET_LATEST_VERSION,
    payload
});

export const setUpdateSeen = () => ({
    type: UPDATE_SEEN
});

export const startGolem = payload => ({
    type: START_GOLEM,
    payload
});

export const stopGolem = () => ({
    type: STOP_GOLEM
});

export const skipPortError = () => ({
    type: CONTINUE_WITH_PROBLEM
});

export const setGolemStatus = payload => ({
    type: SET_GOLEM_STATUS,
    payload
});

export const setPauseStatus = payload => ({
    type: SET_GOLEM_PAUSE_STATUS,
    payload
});

export const startLoading = (id, text) => ({
    type: START_LOADING,
    id,
    text
});

export const endLoading = id => ({
    type: END_LOADING,
    id
});

export const login = payload => ({
    type: LOGIN,
    payload
});

export const logout = () => ({
    type: LOGOUT
});

export const loginFrame = payload => ({
    type: LOGIN_FRAME,
    payload
});

export const logoutFrame = () => ({
    type: LOGOUT_FRAME
});

export const setBalance = payload => ({
    type: SET_BALANCE,
    payload
});

export const setTaskList = payload => ({
    type: SET_TASKLIST,
    payload
});

export const deleteTask = payload => ({
    type: DELETE_TASK,
    payload
});

export const createTask = (payload, _resolve, _reject) => ({
    type: CREATE_TASK,
    payload,
    _resolve,
    _reject
});

export const addMissingFiles = payload => ({
    type: ADD_MISSING_TASK_FILES,
    payload
});

export const restartTask = (payload, _resolve, _reject) => ({
    type: RESTART_TASK,
    payload,
    _resolve,
    _reject
});

export const restartFrame = payload => ({
    type: RESTART_FRAME,
    payload
});

export const restartSubtask = payload => ({
    type: RESTART_SUBTASK,
    payload
});

export const runTestTask = payload => ({
    type: RUN_TEST_TASK,
    payload
});

export const abortTestTask = payload => ({
    type: ABORT_TEST_TASK,
    payload
});

export const setTaskTestStatus = payload => ({
    type: SET_TASK_TEST_STATUS,
    payload
});

export const getEstimatedCost = payload => ({
    type: GET_ESTIMATED_COST,
    payload
});

export const setEstimatedCost = payload => ({
    type: SET_ESTIMATED_COST,
    payload
});

export const clearTaskPlain = () => ({
    type: CLEAR_TASK_PLAIN
});

export const getTaskPresets = payload => ({
    type: GET_TASK_PRESETS,
    payload
});

export const setTaskPresets = payload => ({
    type: SET_TASK_PRESETS,
    payload
});

export const saveTaskPreset = payload => ({
    type: SAVE_TASK_PRESET,
    payload
});

export const deleteTaskPreset = payload => ({
    type: DELETE_TASK_PRESET,
    payload
});

export const setFooterInfo = payload => ({
    type: SET_FOOTER_INFO,
    payload
});

export const getFragments = payload => ({
    type: GET_FRAGMENTS,
    payload
});

export const clearFragments = () => ({
    type: CLEAR_FRAGMENTS
});

export const getTaskGasPrice = () => ({
    type: GET_TASK_GAS_PRICE
});

export const setDirectoryTree = payload => ({
    type: SET_DIRECTORY_TREE,
    payload
});

export const setPreviewRadio = payload => ({
    type: SET_PREVIEW_RADIO,
    payload
});

export const setPreviewExpanded = payload => ({
    type: SET_PREVIEW_EXPANDED,
    payload
});

export const setCurrency = payload => ({
    type: SET_CURRENCY,
    payload
});

export const setZoomRatio = payload => ({
    type: SET_ZOOM_RATIO,
    payload
});

export const setNetworkInfo = payload => ({
    type: SET_NETWORK_INFO,
    payload
});

export const toggleDeveloperMode = payload => ({
    type: TOGGLE_DEVELOPER_MODE,
    payload
});

export const setPasswordModal = payload => ({
    type: SET_PASSWORD_MODAL,
    payload
});

export const addQueue = payload => ({
    type: ADD_QUEUE,
    payload
});

export const removeQueuedTask = () => ({
    type: REMOVE_FROM_QUEUE
});

export const checkTermsAccepted = () => ({
    type: CHECK_TERMS_ACCEPTED
});

export const checkConcentTermsAccepted = () => ({
    type: CHECK_CONCENT_TERMS_ACCEPTED
});

export const acceptTerms = (monitor, sentry, _resolve, _reject) => ({
    type: ACCEPT_TERMS,
    monitor,
    sentry,
    _resolve,
    _reject
});

export const acceptConcentTerms = (_resolve, _reject) => ({
    type: ACCEPT_CONCENT_TERMS,
    _resolve,
    _reject
});

export const setTermsStatus = payload => ({
    type: SET_TERMS_STATUS,
    payload
});

export const setConcentTermsStatus = payload => ({
    type: SET_CONCENT_TERMS_STATUS,
    payload
});

export const setConnectionProblem = payload => ({
    type: SET_CONNECTION_PROBLEM,
    payload
});

export const setComponentWarning = payload => ({
    type: SET_COMPONENT_WARNING,
    payload
});

export const setFileCheck = payload => ({
    type: SET_FILE_CHECK,
    payload
});

export const showTrust = payload => ({
    type: 'TRUST_PAGE',
    payload
});

export const recountBenchmark = () => ({
    type: RECOUNT_BENCHMARK
});
