import { BigNumber } from "bignumber.js";
import { dict } from './../../actions'

const {SET_TASK_DETAILS, SET_TASK_PRESETS, SET_ESTIMATED_COST, SET_TASK_TEST_STATUS, SET_TASK_GAS_PRICE, CLEAR_TASK_PLAIN, SET_HEALTHY_NODE_NUMBER} = dict

const initialState = {
    detail: {},
    presets: {},
    estimated_cost: {
        GNT: 0,
        ETH: 0
    },
    test_status: {},
    nodeNumber: {},
    gasInfo: {}
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

    case SET_TASK_GAS_PRICE:
        const {current_gas_price, gas_price_limit } = action.payload
        return Object.assign({}, state, {
            gasInfo: {
                current_gas_price: new BigNumber(current_gas_price),
                gas_price_limit: new BigNumber(gas_price_limit)
            }
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

    case SET_HEALTHY_NODE_NUMBER:
        return Object.assign({}, state, {
            nodeNumber: {
                ...state.nodeNumber,
                ...action.payload
            }
        });


    default:
        return state;
    }
}

export default setTaskDetails