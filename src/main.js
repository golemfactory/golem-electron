import 'react-hot-loader/patch'
require('css-browser-selector')
import React from 'react'
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import { hashHistory } from 'react-router'
import './utils/electronLayer'
import {dict} from './actions'


import App from './container/App'
import reducer from './reducers'
import sagas from './sagas'
import './scss/main.scss'

const {app, remote, ipcRenderer} = window.electron
const { configStore, dictConfig } = remote.getGlobal('configStorage')

const routingMiddleware = routerMiddleware(hashHistory)
const sagaMiddleware = createSagaMiddleware()
const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(sagaMiddleware, routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

let store = createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ ? enhancer : applyMiddleware(sagaMiddleware, routingMiddleware));
let history = syncHistoryWithStore(hashHistory, store)

sagaMiddleware.run(sagas)

configStore.onDidChange(dictConfig.DEVELOPER_MODE, (newVal)=> {
    store.dispatch({
        type: dict.TOGGLE_DEVELOPER_MODE,
        payload: newVal
    })
})

window.addEventListener('beforeunload', evt => {
    evt.returnValue = false

    setTimeout(() => {
        const _cb = function(_result){
            if(!_result)
                remote.getCurrentWindow().close()
            else
                remote.app.golem.stopProcess()
                    .then(remote.app.quit, remote.app.quit);
        }

        if(remote.process.platform === "win32"){
            store.dispatch({
                    type: 'APP_QUIT', 
                    _cb
                })
        } else {
            remote.getCurrentWindow().close()
        }
    })
})
    

document.addEventListener('DOMContentLoaded', function() {

    renderWithHotReload(App)

    // Hot Module Replacement API
    if (module.hot) {
        module.hot.accept('./container/App', () => {
            const App = require('./container/App').default;
            renderWithHotReload(App);
        })
    }

    /**
     * @param  {Class} React Component  { Main Application Component }
     * @return {[DOM]}
     */
    function renderWithHotReload(App) {
        window.applicationSurface = document.getElementById('mount')
        render(
            <AppContainer warnings={false}>
              <Provider store={ store }>
                <App history={ history } />
              </Provider>
            </AppContainer>,
            window.applicationSurface
        )
    }
})