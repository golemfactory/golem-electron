export let dict = Object.freeze({
    ONBOARDING: 'ONBOARDING',
    //NETWORK
    SET_BALANCE: 'SET_BALANCE',
    SET_RESOURCES: 'SET_RESOURCES',
    SET_HISTORY: 'SET_HISTORY',
    SET_SYSTEM_INFO: 'SET_SYSTEM_INFO',
    SET_ADVANCED_PRESET: 'SET_ADVANCED_PRESET',
    CREATE_ADVANCED_PRESET: 'CREATE_ADVANCED_PRESET',
    SET_ADVANCED_CHART: 'SET_ADVANCED_CHART',
    SET_CHOSEN_HARDWARE_PRESET: 'SET_CHOSEN_HARDWARE_PRESET',
    //TASKS
    SET_TASKLIST: 'SET_TASKLIST',
    SET_TASK_DETAILS: 'SET_TASK_DETAILS',
    SET_TASK_INFO: 'SET_TASK_INFO',
    SET_PREVIEW: 'SET_PREVIEW',
    DELETE_TASK: 'DELETE_TASK',
    CREATE_TASK: 'CREATE_TASK',
    //SETTINGS
    SET_FILE_LOCATION: 'SET_FILE_LOCATION',
    SET_PERFORMANCE_CHARTS: 'SET_PERFORMANCE_CHARTS',
    SET_PROV_MIN_PRICE: 'SET_PROV_MIN_PRICE',
    SET_REQ_MAX_PRICE: 'SET_REQ_MAX_PRICE',
    SET_AVATAR: 'SET_AVATAR',
    SET_PROFILE_CHARTS: 'SET_PROFILE_CHARTS',
    SET_NODE_NAME: 'SET_NODE_NAME',
    SET_PROV_TRUST: 'SET_PROV_TRUST',
    SET_REQ_TRUST: 'SET_REQ_TRUST',
    //FRAME WINDOW
    SET_ALL_FRAMES: 'SET_ALL_FRAMES',
    SET_FRAMES_WITH_SUBTASKS: 'SET_FRAMES_WITH_SUBTASKS',
    SET_CONNECTED_PEERS: 'SET_CONNECTED_PEERS',
    //GENERAL
    START_LOADING: 'START_LOADING',
    END_LOADING: 'END_LOADING',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
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

const {ONBOARDING,
    //NETWORK
    SET_BALANCE, SET_RESOURCES, SET_HISTORY, SET_SYSTEM_INFO, SET_ADVANCED_PRESET, CREATE_ADVANCED_PRESET, SET_ADVANCED_CHART, SET_CHOSEN_HARDWARE_PRESET,
    //TASKS
    SET_TASKLIST, SET_TASK_DETAILS, SET_TASK_INFO, SET_PREVIEW, DELETE_TASK, CREATE_TASK,
    //SETTINGS
    SET_FILE_LOCATION, SET_PERFORMANCE_CHARTS, SET_PROV_MIN_PRICE, SET_REQ_MAX_PRICE, SET_AVATAR, SET_PROFILE_CHARTS, SET_NODE_NAME, SET_PROV_TRUST, SET_REQ_TRUST,
    //FRAME WINDOW
    SET_ALL_FRAMES, SET_FRAMES_WITH_SUBTASKS, SET_CONNECTED_PEERS,
    //GENERAL
    START_LOADING, END_LOADING, LOGIN, LOGOUT, SET_AUTOLAUNCH, SET_PREVIEW_RADIO, SET_PREVIEW_EXPANDED, SET_CURRENCY, UPLOAD, SET_ZOOM_RATIO, SET_NETWORK_INFO,
    //ERROR
    SET_CONNECTION_PROBLEM, SET_FILE_CHECK} = dict

export const setAllFrames = (payload) => ({
    type: SET_ALL_FRAMES,
    payload
})

export const setFramesWithSubTask = (payload) => ({
    type: SET_FRAMES_WITH_SUBTASKS,
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

export const setAdvancedChart = (payload) => ({
    type: SET_ADVANCED_CHART,
    payload
})

export const setChosenPreset = (payload) => ({
    type: SET_CHOSEN_HARDWARE_PRESET,
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

export const setProviderMinPrice = (payload) => ({
    type: SET_PROV_MIN_PRICE,
    payload
})

export const setRequestorMaxPrice = (payload) => ({
    type: SET_REQ_MAX_PRICE,
    payload
})

export const setAvatar = (payload) => ({
    type: SET_AVATAR,
    payload
})

export const setProfileCharts = (payload) => ({
    type: SET_PROFILE_CHARTS,
    payload
})

export const setNodeName = (payload) => ({
    type: SET_NODE_NAME,
    payload
})

export const setProviderTrust = (payload) => ({
    type: SET_PROV_TRUST,
    payload
})

export const setRequestorTrust = (payload) => ({
    type: SET_REQ_TRUST,
    payload
})

export const setTaskDetails = (payload) => ({
    type: SET_TASK_DETAILS,
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

export const recountBenchmark = (payload) => ({
    type: 'RECOUNT_BENCHMARK',
    payload
})