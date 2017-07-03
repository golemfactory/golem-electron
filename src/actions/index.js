export let dict = Object.freeze({
    ONBOARDING: 'ONBOARDING',
    UPDATE_NODE_NAME: 'UPDATE_NODE_NAME',
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
    //TASKS
    SET_TASKLIST: 'SET_TASKLIST',
    SET_TASK_DETAILS: 'SET_TASK_DETAILS',
    GET_TASK_DETAILS: 'GET_TASK_DETAILS',
    SET_TASK_INFO: 'SET_TASK_INFO',
    SET_PREVIEW: 'SET_PREVIEW',
    DELETE_TASK: 'DELETE_TASK',
    CREATE_TASK: 'CREATE_TASK',
    RESTART_TASK: 'RESTART_TASK',
    RESTART_SUBTASK: 'RESTART_SUBTASK',
    RUN_TEST_TASK: 'RUN_TEST_TASK',
    SET_TASK_TEST_STATUS: 'SET_TASK_TEST_STATUS',
    GET_ESTIMATED_COST: 'GET_ESTIMATED_COST',
    SET_ESTIMATED_COST: 'SET_ESTIMATED_COST',
    CLEAR_TASK_PLAIN: 'CLEAR_TASK_PLAIN',
    GET_TASK_PRESETS: 'GET_TASK_PRESETS',
    SET_TASK_PRESETS: 'SET_TASK_PRESETS',
    SAVE_TASK_PRESET: 'SAVE_TASK_PRESET',
    DELETE_TASK_PRESET: 'DELETE_TASK_PRESET',
    SET_FOOTER_INFO: 'SET_FOOTER_INFO',
    //SETTINGS
    SET_FILE_LOCATION: 'SET_FILE_LOCATION',
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
    //FRAME WINDOW
    SET_ALL_FRAMES: 'SET_ALL_FRAMES',
    SET_FRAMES_WITH_SUBTASKS: 'SET_FRAMES_WITH_SUBTASKS',
    SET_CONNECTED_PEERS: 'SET_CONNECTED_PEERS',
    SET_SUBTASKS_BORDER: 'SET_SUBTASKS_BORDER',
    SET_PREVIEW_LIST: 'SET_PREVIEW_LIST',
    SET_SUBTASKS_LIST: 'SET_SUBTASKS_LIST',
    SET_SUBTASKS_VISIBILITY: 'SET_SUBTASKS_VISIBILITY',
    //GENERAL
    START_GOLEM: 'START_GOLEM',
    STOP_GOLEM: 'STOP_GOLEM',
    SET_GOLEM_ENGINE_STATUS: 'SET_GOLEM_ENGINE_STATUS',
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
    UPLOAD: 'UPLOAD',
    SET_ZOOM_RATIO: 'SET_ZOOM_RATIO',
    SET_NETWORK_INFO: 'SET_NETWORK_INFO',
    //ERROR
    SET_CONNECTION_PROBLEM: 'SET_CONNECTION_PROBLEM',
    SET_FILE_CHECK: 'SET_FILE_CHECK'
})

const {ONBOARDING, UPDATE_NODE_NAME,
    //NETWORK
    SET_BALANCE, SET_RESOURCES, SET_HISTORY, SET_SYSTEM_INFO, SET_ADVANCED_PRESET, CREATE_ADVANCED_PRESET, DELETE_ADVANCED_PRESET, SET_ADVANCED_CHART, SET_CHOSEN_HARDWARE_PRESET, SET_ADVANCED_MANUALLY,
    //TASKS
    SET_TASKLIST, SET_TASK_DETAILS, GET_TASK_DETAILS, SET_TASK_INFO, SET_PREVIEW, DELETE_TASK, CREATE_TASK, RESTART_TASK, RESTART_SUBTASK, RUN_TEST_TASK, SET_TASK_TEST_STATUS, GET_ESTIMATED_COST, SET_ESTIMATED_COST, CLEAR_TASK_PLAIN, GET_TASK_PRESETS, SET_TASK_PRESETS, SAVE_TASK_PRESET, DELETE_TASK_PRESET, SET_FOOTER_INFO,
    //SETTINGS
    SET_FILE_LOCATION, SET_PERFORMANCE_CHARTS, RECOUNT_BENCHMARK, SET_PROV_MIN_PRICE, SET_REQ_MAX_PRICE, SET_AVATAR, SET_NODE_NAME, SET_PROV_TRUST, SET_REQ_TRUST, SET_NET_PROV_TRUST, SET_NET_REQ_TRUST,
    //FRAME WINDOW
    SET_ALL_FRAMES, SET_FRAMES_WITH_SUBTASKS, SET_SUBTASKS_BORDER, SET_PREVIEW_LIST, SET_SUBTASKS_LIST, SET_SUBTASKS_VISIBILITY,
    //GENERAL
    START_GOLEM, STOP_GOLEM, SET_GOLEM_ENGINE_STATUS, START_LOADING, END_LOADING, LOGIN, LOGOUT, LOGIN_FRAME, LOGOUT_FRAME, SET_AUTOLAUNCH, SET_CONNECTED_PEERS, SET_PREVIEW_RADIO, SET_PREVIEW_EXPANDED, SET_CURRENCY, UPLOAD, SET_ZOOM_RATIO, SET_NETWORK_INFO,
    //ERROR
    SET_CONNECTION_PROBLEM, SET_FILE_CHECK} = dict

export const updateNodeName = (payload) => ({
    type: UPDATE_NODE_NAME,
    payload
})

export const setAllFrames = (payload) => ({
    type: SET_ALL_FRAMES,
    payload
})

export const setFramesWithSubTask = (payload) => ({
    type: SET_FRAMES_WITH_SUBTASKS,
    payload
})

export const setSubtasksBorder = (payload) => ({
    type: SET_SUBTASKS_BORDER,
    payload
})

export const setPreviews = (payload) => ({
    type: SET_PREVIEW_LIST,
    payload
})

export const setSubtasksList = (payload) => ({
    type: SET_SUBTASKS_LIST,
    payload
})

export const setSubtasksVisibility = (payload) => ({
    type: SET_SUBTASKS_VISIBILITY,
    payload
})

export const setTaskInfo = (payload) => ({
    type: SET_TASK_INFO,
    payload
})

export const setSystemInfo = (payload) => ({
    type: SET_SYSTEM_INFO,
    payload
})

export const setAdvancedPreset = (payload) => ({
    type: SET_ADVANCED_PRESET,
    payload
})

export const createAdvancedPreset = (payload) => ({
    type: CREATE_ADVANCED_PRESET,
    payload
})

export const deleteAdvancedPreset = (payload) => ({
    type: DELETE_ADVANCED_PRESET,
    payload
})

export const setAdvancedChart = (payload) => ({
    type: SET_ADVANCED_CHART,
    payload
})

export const setChosenPreset = (payload, init) => ({
    type: SET_CHOSEN_HARDWARE_PRESET,
    payload,
    init
})

export const setAdvancedManually = (payload) => ({
    type: SET_ADVANCED_MANUALLY,
    payload
})

export const setHistory = (payload) => ({
    type: SET_HISTORY,
    payload
})

export const setResources = (payload) => ({
    type: SET_RESOURCES,
    payload
})

export const setConnectedPeers = (payload) => ({
    type: SET_CONNECTED_PEERS,
    payload
})


export const setFileLocation = (payload) => ({
    type: SET_FILE_LOCATION,
    payload
})

export const setPerformanceCharts = (payload) => ({
    type: SET_PERFORMANCE_CHARTS,
    payload
})

export const setProviderMinPrice = (payload, init) => ({
    type: SET_PROV_MIN_PRICE,
    payload,
    init
})

export const setRequestorMaxPrice = (payload, init) => ({
    type: SET_REQ_MAX_PRICE,
    payload,
    init
})

export const setAvatar = (payload) => ({
    type: SET_AVATAR,
    payload
})

export const setNodeName = (payload) => ({
    type: SET_NODE_NAME,
    payload
})

export const setProviderTrust = (payload, init) => ({
    type: SET_PROV_TRUST,
    payload: (payload / 50) - 1,
    init
})

export const setRequestorTrust = (payload, init) => ({
    type: SET_REQ_TRUST,
    payload: (payload / 50) - 1,
    init
})

export const setNetworkProviderTrust = (payload) => ({
    type: SET_NET_PROV_TRUST,
    payload
})

export const setNetworkRequestorTrust = (payload) => ({
    type: SET_NET_REQ_TRUST,
    payload
})

export const setTaskDetails = (payload) => ({
    type: SET_TASK_DETAILS,
    payload
})

export const getTaskDetails = (payload) => ({
    type: GET_TASK_DETAILS,
    payload
})

export const setPreview = (payload) => ({
    type: SET_PREVIEW,
    payload
})

export const setOnboard = (payload) => ({
    type: ONBOARDING,
    payload
})

export const startGolem = (payload) => ({
    type: START_GOLEM,
    payload
})

export const stopGolem = () => ({
    type: STOP_GOLEM
})

export const setEngineStatus = (payload) => ({
    type: SET_GOLEM_ENGINE_STATUS,
    payload
})

export const startLoading = (id, text) => ({
    type: START_LOADING,
    id,
    text
})

export const endLoading = (id) => ({
    type: END_LOADING,
    id
})

export const login = (payload) => ({
    type: LOGIN,
    payload
})

export const logout = () => ({
    type: LOGOUT
})

export const loginFrame = (payload) => ({
    type: LOGIN_FRAME,
    payload
})

export const logoutFrame = () => ({
    type: LOGOUT_FRAME
})

export const setBalance = (payload) => ({
    type: SET_BALANCE,
    payload
})

export const setAutoLaunch = (payload) => ({
    type: SET_AUTOLAUNCH,
    payload
})

export const setTaskList = (payload) => ({
    type: SET_TASKLIST,
    payload
})

export const deleteTask = (payload) => ({
    type: DELETE_TASK,
    payload
})

export const createTask = (payload) => ({
    type: CREATE_TASK,
    payload
})

export const restartTask = (payload) => ({
    type: RESTART_TASK,
    payload
})

export const restartSubtask = (payload) => ({
    type: RESTART_SUBTASK,
    payload
})

export const runTestTask = (payload) => ({
    type: RUN_TEST_TASK,
    payload
})

export const setTaskTestStatus = (payload) => ({
    type: SET_TASK_TEST_STATUS,
    payload
})

export const getEstimatedCost = (payload) => ({
    type: GET_ESTIMATED_COST,
    payload
})

export const setEstimatedCost = (payload) => ({
    type: SET_ESTIMATED_COST,
    payload
})

export const clearTaskPlain = () => ({
    type: CLEAR_TASK_PLAIN
})

export const getTaskPresets = (payload) => ({
    type: GET_TASK_PRESETS,
    payload
})

export const setTaskPresets = (payload) => ({
    type: SET_TASK_PRESETS,
    payload
})

export const saveTaskPreset = (payload) => ({
    type: SAVE_TASK_PRESET,
    payload
})

export const deleteTaskPreset = (payload) => ({
    type: DELETE_TASK_PRESET,
    payload
})

export const setFooterInfo = (payload) => ({
    type: SET_FOOTER_INFO,
    payload
})

export const setPreviewRadio = (payload) => ({
    type: SET_PREVIEW_RADIO,
    payload
})

export const setPreviewExpanded = (payload) => ({
    type: SET_PREVIEW_EXPANDED,
    payload
})

export const setCurrency = (payload) => ({
    type: SET_CURRENCY,
    payload
})

export const uploadFile = (payload) => ({
    type: UPLOAD,
    payload
})

export const setZoomRatio = (payload) => ({
    type: SET_ZOOM_RATIO,
    payload
})

export const setNetworkInfo = (payload) => ({
    type: SET_NETWORK_INFO,
    payload
})

export const setConnectionProblem = (payload) => ({
    type: SET_CONNECTION_PROBLEM,
    payload
})

export const setFileCheck = (payload) => ({
    type: SET_FILE_CHECK,
    payload
})

export const showTrust = (payload) => ({
    type: 'TRUST_PAGE',
    payload
})

export const recountBenchmark = () => ({
    type: RECOUNT_BENCHMARK
})