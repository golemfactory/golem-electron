import { BigNumber } from 'bignumber.js';
import { dict } from './../../actions';

const ETH_DENOM = 10 ** 18;

function weiToETH(x) {
    return new BigNumber(x).dividedBy(ETH_DENOM).toNumber();
}

const {
    SET_TASK_DETAILS,
    SET_TASK_PRESETS,
    SET_ESTIMATED_COST,
    SET_TASK_TEST_STATUS,
    SET_TASK_GAS_PRICE,
    CLEAR_TASK_PLAIN,
    SET_HEALTHY_NODE_NUMBER,
    SET_FRAGMENTS
} = dict;

const initialState = {
    detail: {},
    presets: {},
    estimated_cost: {
        GNT: new BigNumber(0),
        ETH: new BigNumber(0),
        deposit: {
            GNT_suggested: new BigNumber(0),
            GNT_required: new BigNumber(0),
            ETH: new BigNumber(0)
        }
    },
    test_status: {},
    nodeNumber: {},
    optimalSubtaskCount: 0,
    gasInfo: {},
    fragments: []
};
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
            const [result, error] = action?.payload || [{}, null];
            let {
                GNT = 0,
                ETH = 0,
                deposit = {
                    GNT_suggested: 0,
                    GNT_required: 0,
                    ETH: 0
                }
            } = result;

            return Object.assign({}, state, {
                estimated_cost: {
                    GNT: weiToETH(GNT),
                    ETH: weiToETH(ETH),
                    deposit: {
                        GNT_suggested: weiToETH(deposit.GNT_suggested),
                        GNT_required: weiToETH(deposit.GNT_required),
                        ETH: weiToETH(deposit.ETH)
                    }
                }
            });

        case SET_TASK_GAS_PRICE:
            const { current_gas_price, gas_price_limit } = action.payload;
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
        case SET_FRAGMENTS:
            return Object.assign({}, state, {
                fragments: action.payload
            });

        default:
            return state;
    }
};

export default setTaskDetails;
