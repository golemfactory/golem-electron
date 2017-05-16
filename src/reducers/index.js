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
import performance from './settings/performance'
import price from './settings/price'
import profile from './settings/profile'
import trust from './settings/trust'
/*Tasks*/
import details from './tasks/details'
import preview from './tasks/preview'
/*Onboard*/
import onboard from './onboard'
/*Rest*/
import input from './input'
import loader from './loader'
import currency from './currency'
import realTime from './realTime'
import info from './info'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
    all,
    single,
    task,
    advanced,
    history,
    resources,
    fileLocation,
    performance,
    price,
    profile,
    trust,
    details,
    preview,
    onboard,
    input,
    loader,
    currency,
    realTime,
    info,
    routing: routerReducer
})

export default reducer