import "react-hot-loader/patch";
import "react-tippy/dist/tippy.css";
require("css-browser-selector");
import React from "react";
import { AppContainer } from "react-hot-loader";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware, connectRouter } from "connected-react-router";
import { createHashHistory } from "history";
import "./utils/electronLayer";
import { dict } from "./actions";

import App from "./container/App.frame";
import reducer from "./reducers";
import sagas from "./sagas";
import "./scss/main.scss";

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
    connectRouter(history)(reducer),
    [],
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
