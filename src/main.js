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
import createHistory from 'history/createhashHistory'
window.require('electron').webFrame.setZoomLevelLimits(1, 1)


import App from './container/App'
import reducer from './reducers'
import sagas from './sagas'
import './scss/main.scss'

export const APP_VERSION = "v0.1"

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
        window.electron = window.require('electron')
        render(
            <AppContainer>
              <Provider store={ store }>
                <App history={ history } />
              </Provider>
            </AppContainer>,
            window.applicationSurface
        )
    }
})