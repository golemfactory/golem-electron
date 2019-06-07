import { eventChannel, buffers } from "redux-saga";
import {
    fork,
    take,
    takeLatest,
    call,
    put,
    cancel,
    select
} from "redux-saga/effects";
import { BigNumber } from "bignumber.js";
import { isEqual } from "lodash";

import { dict } from "../actions";

import { config, _handleSUBPUB, _handleUNSUBPUB, _handleRPC } from "./handler";

const {
    SET_BALANCE,
    SET_CONCENT_DEPOSIT_BALANCE,
    GET_CONCENT_DEPOSIT_BALANCE
} = dict;
const ETH_DENOM = 10 ** 18; //POW shorthand thanks to ES6
const BALANCE_DICT = Object.freeze({
    GNT: "gnt",
    AVG_GNT: "av_gnt",
    ETH: "eth",
    GNT_LOCK: "gnt_lock",
    ETH_LOCK: "eth_lock",
    LAST_GNT_UPDATE: "last_gnt_update",
    LAST_ETH_UPDATE: "last_eth_update",
    CONTRACTS: "contract_addresses"
});

/**
 * [subscribeConnectedPeers func. fetchs connedted peers data with interval]
 * @param  {Object} session     [Websocket connection session]
 * @return {Object}             [Action object]
 */
// export function subscribeBalance(session) {
//     return eventChannel(emit => {
//         function on_balance(args) {
//             let balance = args[0];
//             emit({
//                 type: SET_BALANCE,
//                 payload: [(balance.GNT_available / ETH_DENOM) || 0, (balance.ETH / ETH_DENOM) || 0]
//             })
//         }
//         _handleSUBPUB(on_balance, session, config.BALANCE_CH)

//         return () => {
//             console.log('negative')
//             _handleUNSUBPUB(on_balance, session, config.BALANCE_CH)
//         }
//     })
// }

export function subscribeBalance(session) {
    const interval = 1000;

    return eventChannel(emit => {
        const fetchBalance = () => {
            function on_balance(args) {
                const balance = args[0];

                let gntTotal = new BigNumber(
                    balance[BALANCE_DICT.GNT] === null
                        ? 0
                        : balance[BALANCE_DICT.GNT]
                );
                let gnt = new BigNumber(
                    balance[BALANCE_DICT.AVG_GNT] === null
                        ? 0
                        : balance[BALANCE_DICT.AVG_GNT]
                );
                let eth = new BigNumber(
                    balance[BALANCE_DICT.ETH] === null
                        ? 0
                        : balance[BALANCE_DICT.ETH]
                );
                let gntLock = new BigNumber(
                    balance[BALANCE_DICT.GNT_LOCK] === null
                        ? 0
                        : balance[BALANCE_DICT.GNT_LOCK]
                );
                let ethLock = new BigNumber(
                    balance[BALANCE_DICT.ETH_LOCK] === null
                        ? 0
                        : balance[BALANCE_DICT.ETH_LOCK]
                );
                let contractAddresses = balance[BALANCE_DICT.CONTRACTS];

                if (gnt.isNaN()) {
                    gnt = 0;
                }

                if (eth.isNaN()) {
                    eth = 0;
                }

                emit({
                    type: SET_BALANCE,
                    payload: [
                        gnt.dividedBy(ETH_DENOM),
                        eth.dividedBy(ETH_DENOM),
                        balance[BALANCE_DICT.LAST_GNT_UPDATE],
                        balance[BALANCE_DICT.LAST_ETH_UPDATE],
                        gntLock
                            .dividedBy(ETH_DENOM)
                            .precision(8)
                            .toString(),
                        ethLock
                            .dividedBy(ETH_DENOM)
                            .precision(8)
                            .toString(),
                        gntTotal
                            .minus(gnt)
                            .dividedBy(ETH_DENOM)
                            .precision(8)
                            .toString(),
                        contractAddresses
                    ]
                });
            }

            _handleRPC(on_balance, session, config.BALANCE_RPC);
        };

        const fetchOnStartup = () => {
            fetchBalance();

            return fetchOnStartup;
        };

        const channelInterval = setInterval(fetchOnStartup(), interval);

        return () => {
            console.log("negative");
            clearInterval(channelInterval);
        };
    });
}

export function concentDepositBalance(session) {
    const interval = 10000;

    return eventChannel(emit => {
        const fetchConcentBalance = () => {
            function on_info(args) {
                const concent_info = args[0];
                if (concent_info) {
                    const { value, status, timelock } = concent_info;
                    emit({
                        type: SET_CONCENT_DEPOSIT_BALANCE,
                        payload: {
                            value: new BigNumber(value),
                            status,
                            timelock
                        }
                    });
                }
            }

            _handleRPC(
                on_info,
                session,
                config.CONCENT_DEPOSIT_BALANCE_RPC,
                []
            );
        };

        const fetchOnStartup = () => {
            fetchConcentBalance();

            return fetchOnStartup;
        };

        const channelInterval = setInterval(fetchOnStartup(), interval);

        return () => {
            console.log("negative");
            clearInterval(channelInterval);
        };
    });
}

export function* concentBalanceFlow(session) {
    const getConcentBalance = state => state.realTime.concentBalance;
    const channel = yield call(concentDepositBalance, session);
    try {
        while (true) {
            let action = yield take(channel);
            const concentBalance = yield select(getConcentBalance);
            if (!isEqual(concentBalance, action.payload)) yield put(action);
        }
    } finally {
        console.info("yield cancelled!");
        channel.close();
    }
}

/**
 * [*connectedPeers generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* balanceFlow(session) {
    yield fork(concentBalanceFlow, session);
    const channel = yield call(subscribeBalance, session);
    try {
        while (true) {
            let action = yield take(channel);
            yield put(action);
        }
    } finally {
        console.info("yield cancelled!");
        channel.close();
    }
}
