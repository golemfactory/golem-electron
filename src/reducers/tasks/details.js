import { dict } from './../../actions'

const {SET_TASK_DETAILS, SET_TASK_PRESETS, SET_ESTIMATED_COST, SET_TASK_TEST_STATUS, CLEAR_TASK_PLAIN} = dict

const initialState = {
    detail: {},
    presets: {},
    estimated_cost: 0,
    test_status: {}
}
const setTaskDetails = (state = initialState, action) => {
    switch (action.type) {
    case SET_TASK_DETAILS:
        return Object.assign({}, state, {
            detail: action.payload
        });

    case SET_TASK_PRESETS:
        return Object.assign({}, state, {
            presets: action.payload
        });

    case SET_ESTIMATED_COST:
        return Object.assign({}, state, {
            estimated_cost: action.payload
        });

    case SET_TASK_TEST_STATUS:
        return Object.assign({}, state, {
            test_status: action.payload
        });
        
    case CLEAR_TASK_PLAIN:
        return Object.assign({}, state, {
            test_status: { 
                status: null 
            },
            detail: {}
        });


    default:
        return state;
    }
}

export default setTaskDetails