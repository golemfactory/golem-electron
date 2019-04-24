import 'react-hot-loader/patch'
require('css-browser-selector')
import React from 'react'
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { createHashHistory } from 'history'
import './utils/electronLayer'


import App from './container/App.doc'
import reducer from './reducers'
import './scss/main.scss'

const history = window.routerHistory = createHashHistory()
const routingMiddleware = routerMiddleware(history)
const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

let store = createStore(
    reducer,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__
        ? enhancer
        : applyMiddleware(routingMiddleware)
);

document.addEventListener("DOMContentLoaded", function() {
    renderWithHotReload(App);

    // Hot Module Replacement API
    if (module.hot) {
        module.hot.accept("./container/App.doc", () => {
            const App = require("./container/App.doc").default;
            renderWithHotReload(App);
        });
    }

    /**
     * @param  {Class} React Component  { Main Application Component }
     * @return {[DOM]}
     */
    function renderWithHotReload(App) {
        render(
            <AppContainer warnings={false}>
                <Provider store={store}>
                    <App history={history} />
                </Provider>
            </AppContainer>,
            document.getElementById("mount")
        );
    }
});
