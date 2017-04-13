export const dict = {
    START_LOADING: 'START_LOADING',
    END_LOADING: 'END_LOADING',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SET_MESSAGE: 'SET_MESSAGE',
    SET_AUTOLAUNCH: 'SET_AUTOLAUNCH',
    SET_BLENDER: 'SET_BLENDER',
    SET_PREVIEW: 'SET_PREVIEW',
    SET_PREVIEW_EXPANDED: 'SET_PREVIEW_EXPANDED',
    SET_CURRENCY: 'SET_CURRENCY',
    UPLOAD: 'UPLOAD'
}

const {START_LOADING, END_LOADING, LOGIN, LOGOUT, SET_MESSAGE, SET_AUTOLAUNCH, SET_BLENDER, SET_PREVIEW, SET_PREVIEW_EXPANDED, SET_CURRENCY, UPLOAD} = dict

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

export const setMessage = (message) => ({
    type: SET_MESSAGE,
    message
})

export const setAutoLaunch = (payload) => ({
    type: SET_AUTOLAUNCH,
    payload
})

export const setBlender = (blender) => ({
    type: SET_BLENDER,
    blender
})

export const setPreview = (payload) => ({
    type: SET_PREVIEW,
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