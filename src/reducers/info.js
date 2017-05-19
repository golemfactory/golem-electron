import { dict } from './../actions'

const {SET_NETWORK_INFO, SET_FILE_CHECK} = dict

const initialState = {
    networkInfo: {},
    fileCheckModal: {
        status: false,
        files: []
    }
}
const setInfo = (state = initialState, action) => {
    switch (action.type) {
    case SET_NETWORK_INFO:
        return Object.assign({}, state, {
            networkInfo: action.payload
        });

    case SET_FILE_CHECK:
        const {status, files} = action.payload
        return Object.assign({}, state, {
            fileCheckModal: {
                status,
                files: files || []
            }
        });

    default:
        return state;
    }
}

export default setInfo