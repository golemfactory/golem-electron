import { combineReducers } from 'redux'
/*Frame*/
import all from './frame/all'
import single from './frame/single'
import task from './frame/task'
/*Network*/
import advanced from './network/advanced'
import history from './network/history'
import resources from './network/resources'
/*Settings*/
import fileLocation from './settings/fileLocation'
import geth from './settings/geth'
import performance from './settings/performance'
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
import realTime from './realTime'
import info from './info'
import queue from './queue'
import { routerReducer } from 'react-router-redux'

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
    queue,
    routing: routerReducer
})

export default reducer