import { combineReducers } from 'redux'
import input from './input'
import loader from './loader'
import currency from './currency'
import realTime from './realTime'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
    loader,
    currency,
    realTime,
    input,
    routing: routerReducer
})

export default reducer