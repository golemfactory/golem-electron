import { dict } from './../../actions'

const {SET_TASK_STATS, SET_UNSUPPORTED_TASK_STATS} = dict

const initialState = {
    stats: {
        provider: {},
        requestor: {}
    },
    unsupported_stats: {}
}
const setStats = (state = initialState, action) => {
    switch (action.type) {

    case SET_TASK_STATS:
        return Object.assign({}, state, {
            stats: action.payload
        });

    case SET_UNSUPPORTED_TASK_STATS:
        return Object.assign({}, state, {
            unsupported_stats:  action.payload
        });

    default:
        return state;
    }
}

export default setStats
