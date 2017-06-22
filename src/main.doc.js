import 'react-hot-loader/patch'
require('css-browser-selector')
import React from 'react'
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'
window.require('electron').webFrame.setZoomLevelLimits(1, 1)


import App from './container/App.doc'
import './scss/main.scss'

export const APP_VERSION = "v0.1"

const routingMiddleware = routerMiddleware(browserHistory)
const sagaMiddleware = createSagaMiddleware()
const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

let store = createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ ? enhancer : applyMiddleware(routingMiddleware));
let history = syncHistoryWithStore(browserHistory, store)

document.addEventListener('DOMContentLoaded', function() {

    renderWithHotReload(App)

    // Hot Module Replacement API
    if (module.hot) {
        module.hot.accept('./container/App.doc', () => {
            const App = require('./container/App.doc').default;
            renderWithHotReload(App);
        })
    }

    /**
     * @param  {Class} React Component  { Main Application Component }
     * @return {[DOM]}
     */
    function renderWithHotReload(App) {
        render(
            <AppContainer>
              <Provider store={ store }>
                <App history={ history } />
              </Provider>
            </AppContainer>,
            document.getElementById('mount')
        )
    }
})