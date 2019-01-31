import 'react-hot-loader/patch'
import 'react-tippy/dist/tippy.css';
require('css-browser-selector')
import React from 'react'
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, __DO_NOT_USE__ActionTypes } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import './utils/electronLayer'
import {dict} from './actions'


import App from './container/App'
import createRootReducer from './reducers'
import sagas from './sagas'
import './scss/main.scss'

/**
 * Redux dev tools workaround to avoid "state undefined" error
 * @see https://github.com/reduxjs/redux-devtools/issues/391
 * @see https://github.com/reduxjs/redux-devtools/issues/391#issuecomment-361059004
 */
if(window.__REDUX_DEVTOOLS_EXTENSION__){
    __DO_NOT_USE__ActionTypes.INIT = '@@redux/INIT';
    __DO_NOT_USE__ActionTypes.REPLACE = '@@redux/REPLACE';
}

const {remote, ipcRenderer} = window.electron
const { configStore, dictConfig } = remote.getGlobal('configStorage')

const history = window.routerHistory = createHashHistory()
const routingMiddleware = routerMiddleware(history)
const appEnv = remote.getGlobal('process').env.NODE_ENV;
const sagaMiddleware = ( appEnv === "development" ? createSagaMiddleware.default() : createSagaMiddleware())
const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(sagaMiddleware, routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

let store = createStore(
        createRootReducer(history), 
        window.__REDUX_DEVTOOLS_EXTENSION__ ? enhancer : applyMiddleware(sagaMiddleware, routingMiddleware));

const RPC_QUIT_STATES = {
    INITIAL: 0,
    PENDING: 1,
    SUCCESS: 2,
    FAILURE: 3
};
let rpcQuitState = RPC_QUIT_STATES.INITIAL;

sagaMiddleware.run(sagas)

configStore.onDidChange(dictConfig.DEVELOPER_MODE, (newVal)=> {
    store.dispatch({
        type: dict.TOGGLE_DEVELOPER_MODE,
        payload: newVal
    })
})

/**
 * In Windows, closing application will kill golem instance
 */
if(remote.getGlobal('process').platform === "win32"){

    window.addEventListener('beforeunload', evt => {
        const _process = remote.app.golem.process;
        const _connected = remote.app.golem.connected;
        const _cb = _result => {
            rpcQuitState = !_result
                ? RPC_QUIT_STATES.SUCCESS
                : RPC_QUIT_STATES.FAILURE;
                       
            if (rpcQuitState == RPC_QUIT_STATES.SUCCESS)
                remote.getCurrentWindow().close();
            else
                remote.app.golem.stopProcess();

            evt.returnValue = true;
        }

        /* Return if the RPC call has been issued */
        if (rpcQuitState != RPC_QUIT_STATES.INITIAL)
            return;
        /* Kill if we're in control of the process (but not yet connected) */
        if (_process && !_connected)
            remote.app.golem.stopProcess();
        /* Return if we're not in control of the process or not connected */
        if (!_process || !_connected)
            return;

        rpcQuitState = RPC_QUIT_STATES.PENDING;
            
        /* Send the RPC call */
        evt.returnValue = false;
        store.dispatch({
            type: 'APP_QUIT',
            _cb
        })
    })
}

document.addEventListener('DOMContentLoaded', function() {
    window.applicationSurface = document.getElementById('mount')
    render(
          <Provider store={ store }>
            <App history={ history } />
          </Provider>,
        window.applicationSurface
    )
})
