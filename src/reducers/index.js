import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
/*Frame*/
import all from './frame/all';
import single from './frame/single';
import task from './frame/task';
/*Network*/
import advanced from './network/advanced';
import txHistory, * as fromHistory from './network/history';
import resources from './network/resources';
/*Settings*/
import concent from './settings/concent';
import fileLocation from './settings/fileLocation';
import geth from './settings/geth';
import performance, * as fromPerformance from './settings/performance';
import price from './settings/price';
import profile from './settings/profile';
import trust from './settings/trust';
import stats from './settings/stats';
import acl, * as fromACL from './settings/acl';
/*Tasks*/
import details from './tasks/details';
import preview from './tasks/preview';
import create from './tasks/create';
/*Onboard*/
import onboard from './onboard';
/*Account*/
import account from './account';
/*Notification Center*/
import notification from './notification';
/*Rest*/
import input from './input';
import loader from './loader';
import currency from './currency';
import realTime, * as fromRealTime from './realTime';
import info from './info';
import queue from './queue';

const reducer = history =>
    combineReducers({
        router: connectRouter(history),
        //FRAME
        all,
        single,
        task,
        //NETWORK
        advanced,
        txHistory,
        resources,
        //SETTINGS
        concent,
        fileLocation,
        geth,
        performance,
        price,
        profile,
        trust,
        stats,
        acl,
        //TASK
        details,
        preview,
        create,
        //ONBOARD
        onboard,
        //ACCOUNT
        account,
        //NOTIFICATION CENTER
        notification,
        //GENERAL
        input,
        loader,
        currency,
        realTime,
        info,
        queue
    });

export default reducer;

export const getFilteredPaymentHistory = (state, filter, isDefault) =>
    fromHistory.getFilteredPaymentSelector(state.txHistory, filter, isDefault);
export const getStatus = (state, key) =>
    fromRealTime.getStatusSelector({ ...state.realTime, ...state.info }, key);
export const getPasswordModalStatus = (state, key) =>
    fromRealTime.passwordModalSelector(
        { ...state.realTime, ...state.info },
        key
    );
export const getGPUEnvironment = (state, key) =>
    fromPerformance.getGPUEnvironmentSelector(state.performance, key);
export const getConcentDepositStatus = (state, key) =>
    fromRealTime.concentDepositStatusSelector(state.realTime, key);
export const getRequestorStatus = (state, key) =>
    fromRealTime.requestorStatusSelector(state.realTime, key);
export const getComponentWarnings = (state, key) =>
    fromRealTime.componentWarningSelector({ ...state.realTime, ...state.info }, key);

export const getFilteredKnownPeers = (state, filter, key) =>
    fromACL.getKnownPeersSelector(state.acl, filter, key);

export const getWhiteListLock = (state, key) => 
    fromACL.getWhiteListLockSelector(state.acl, key);
