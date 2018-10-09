import { combineReducers } from 'redux'
/*Frame*/
import all from './frame/all'
import single from './frame/single'
import task from './frame/task'
/*Network*/
import advanced from './network/advanced'
import history, * as fromHistory from './network/history'
import resources from './network/resources'
/*Settings*/
import fileLocation from './settings/fileLocation'
import geth from './settings/geth'
import performance, * as fromPerformance from './settings/performance'
import price from './settings/price'
import profile from './settings/profile'
import trust from './settings/trust'
import stats from './settings/stats'
/*Tasks*/
import details from './tasks/details'
import preview from './tasks/preview'
import create from './tasks/create'
/*Onboard*/
import onboard from './onboard'
/*Account*/
import account from './account'
/*Rest*/
import input from './input'
import loader from './loader'
import currency from './currency'
import realTime, * as fromRealTime from './realTime'
import info from './info'
import queue from './queue'

const reducer = combineReducers({
    //FRAME
    all,
    single,
    task,
    //NETWORK
    advanced,
    history,
    resources,
    //SETTINGS
    fileLocation,
    geth,
    performance,
    price,
    profile,
    trust,
    stats,
    //TASK
    details,
    preview,
    create,
    //ONBOARD
    onboard,
    //ACCOUNT
    account,
    //GENERAL
    input,
    loader,
    currency,
    realTime,
    info,
    queue
})

export default reducer


export const getFilteredPaymentHistory = (state, filter, isDefault) => fromHistory.getFilteredPaymentSelector(state.history, filter, isDefault)
export const getStatus = (state, key) => fromRealTime.getStatusSelector(state.realTime, key)
export const getPasswordModalStatus = (state, key) => fromRealTime.passwordModalSelector(state.realTime, key)
export const getGPUEnvironment = (state, key) => fromPerformance.getGPUEnvironmentSelector(state.performance, key)