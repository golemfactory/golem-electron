import "react-hot-loader/patch";
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/translucent.css';
import 'tippy.js/themes/light.css';
require("css-browser-selector");
import React from "react";
import { AppContainer } from "react-hot-loader";
import { render } from "react-dom";
import { Provider } from "react-redux";
import {
    createStore,
    applyMiddleware,
    compose,
    __DO_NOT_USE__ActionTypes
} from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from "history";
import "./utils/electronLayer";
import { dict } from "./actions";

import App from "./container/App.frame";
import createRootReducer from './reducers';
import sagas from "./sagas";
import "./scss/main.scss";

/**
 * Redux dev tools workaround to avoid "state undefined" error
 * @see https://github.com/reduxjs/redux-devtools/issues/391
 * @see https://github.com/reduxjs/redux-devtools/issues/391#issuecomment-361059004
 */
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    __DO_NOT_USE__ActionTypes.INIT = "@@redux/INIT";
    __DO_NOT_USE__ActionTypes.REPLACE = "@@redux/REPLACE";
}

const { remote } = window.electron;
const { configStore, dictConfig } = remote.getGlobal("configStorage");

const history = (window.routerHistory = createHashHistory());
const routingMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(sagaMiddleware, routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

let store = createStore(
    createRootReducer(history),
    window.__REDUX_DEVTOOLS_EXTENSION__
        ? enhancer
        : applyMiddleware(sagaMiddleware, routingMiddleware)
);

sagaMiddleware.run(sagas);

configStore.onDidChange(dictConfig.DEVELOPER_MODE, newVal => {
    store.dispatch({
        type: dict.TOGGLE_DEVELOPER_MODE,
        payload: newVal
    });
});

document.addEventListener("DOMContentLoaded", function() {
    renderWithHotReload(App);

    // Hot Module Replacement API
    if (module.hot) {
        module.hot.accept("./container/App.frame", () => {
            const App = require("./container/App.frame").default;
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
