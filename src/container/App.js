import React, { Component } from "react";
import { Route, Switch } from "react-router-dom"; // react-router v4
import { ConnectedRouter } from "connected-react-router";
import { hot } from "react-hot-loader";

import constants from "../constants";

import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/Header";
import Footer from "../components/footer";
import MainFragment from "../components/network";
import Tasks from "../components/tasks";
import MasterFilePicker from "../components/tasks/create/MasterFilePicker";
import NewTask from "../components/tasks/create/NewTask";
import TaskForm from "../components/tasks/create/TaskForm";
import Settings from "../components/settings";
import NotFound from "../components/NotFound";
import { OnBoardingComponent } from "../components/hoc/Onboarding";
import { ConcentOnboardingComponent } from "../components/hoc/ConcentOnboarding";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Actions from "../actions";
import { getStatus, getPasswordModalStatus } from "../reducers";
import IssueModal from "./modal/IssueModal";
import WithdrawModal from "./../components/wallet/modal/WithdrawModal";
import PasswordModal from "./modal/PasswordModal";
import checkNested from "./../utils/checkNested";

const routePaths = {
    MAIN: "/",
    TASK_LIST: "/tasks",
    WALLET: "/wallet",
    SETTING: "/settings",
    TASK_ID: "/task/:id",
    MASTER_FILE: "/add-task/master-file/:type?",
    NEW_TASK: "/add-task/type/:type?",
    TASK_FORM: "/add-task/settings",
    ACL: "/acl",
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

/**
 * { Router function to prepare component path }
 *
 * @return     {Route}
 */
const routes = (
    <div>
        <Switch>
            <Route
                exact
                path={routePaths.MAIN}
                component={OnBoardingComponent(
                    MainFragment
                )} /*component={ LoadingComponent(MainFragment, ['MAIN_LOADER'])[0]}*/
            />
            <Route
                exact
                path={routePaths.WALLET}
                component={OnBoardingComponent(
                    MainFragment
                )} /*component={ LoadingComponent(MainFragment, ['MAIN_LOADER'])[0]}*/
            />
            <Route
                path={routePaths.TASK_LIST}
                component={OnBoardingComponent(
                    Tasks
                )} /*component={ LoadingComponent(Tasks, ['TASK_PANEL_LOADER'])[0]}*/
            />
            <Route
                path={routePaths.SETTING}
                component={OnBoardingComponent(
                    ConcentOnboardingComponent(Settings)
                )}
            />
            <Route
                path={routePaths.ACL}
                component={OnBoardingComponent(
                    ConcentOnboardingComponent(Settings)
                )}
            />
            <Route path={routePaths.TASK_ID} component={TaskForm} />
            <Route path={routePaths.MASTER_FILE} component={MasterFilePicker} />
            <Route path={routePaths.NEW_TASK} component={NewTask} />
            <Route path={routePaths.TASK_FORM} component={TaskForm} />
            <Route component={NotFound} status={404} />
        </Switch>
    </div>
);

function isGolemReady(gs) {
    return gs.status === "Ready" && gs.message.toLowerCase().includes("node");
}

const mapStateToProps = (state) => ({
    golemStatus: getStatus(state, "golemStatus"),
    connectionProblem: state.info.connectionProblem,
    latestVersion: state.info.latestVersion,
    withdrawModal: state.account.withdrawModal,
    passwordModal: getPasswordModalStatus(state, "passwordModal"),
    showOnboard: state.onboard.showOnboard,
    taskQueue: state.queue.next,
    //To fill initial resource
    resource: state.resources.resource,
    systemInfo: state.advanced.systemInfo,
    chartValues: state.advanced.chartValues,
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch),
});

/**
 * { Main Application Component. (Include Router) }
 *
 * @class      App (name)
 */
export class App extends Component {
    state = {
        isFooterShown: true,
    };

    componentDidMount() {
        const { actions } = this.props;
        actions.login("Muhammed");

        window.routerHistory?.listen(({ pathname }, action) => {
            const isFooterShown =
                pathname == routePaths.MAIN ||
                pathname == routePaths.TASK_LIST ||
                pathname == routePaths.SETTING ||
                pathname == routePaths.WALLET;
            this.setState({
                isFooterShown,
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            checkNested(nextProps, "golemStatus", "client") &&
            isGolemReady(nextProps.golemStatus.client) &&
            nextProps.taskQueue.length > 0
        ) {
            const newTask = nextProps.taskQueue.last();
            if (newTask) {
                nextProps.actions[newTask.action](...newTask.arguments);
                nextProps.actions.removeQueuedTask();
            }
        }

        if (
            Object.keys(nextProps.systemInfo).length > 0 &&
            typeof nextProps.resource !== "number" &&
            nextProps.chartValues.name !== null
        ) {
            const value = this.calculateResourceValue(
                nextProps.chartValues,
                nextProps.systemInfo
            );
            this.props.actions.setResources(value);
        }
    }

    /**
     * [calculateResourceValue func.]
     * @param  {Int}        options.cpu_cores       [Selected cpu core amount]
     * @param  {Int}        options.memory          [Selected memory amount]
     * @param  {Int}        options.disk            [Selected disk space amount]
     * @return {Int}                                [Mean of their percentage]
     */
    calculateResourceValue({ cpu_cores, memory, disk }, systemInfo) {
        let cpuRatio = cpu_cores / systemInfo.cpu_cores;
        let ramRatio = memory / systemInfo.memory;
        let diskRatio = disk / systemInfo.disk;
        return Math.min(100 * ((cpuRatio + ramRatio + diskRatio) / 3), 100);
    }

    _closeModal = (_modalType) => {
        const { actions } = this.props;
        const modals = constants.modals;
        if (modals.ISSUEMODAL === _modalType) {
            actions.setConnectionProblem(false);
        } else if (modals.WITHDRAWMODAL === _modalType) {
            actions.callWithdrawModal(false, null);
        }
    };

    _showIssueModal(...args) {
        const issues = args.map((item) => (item ? item.issue : null));
        const result = issues.some((item) => !!item);
        return result;
    }

    render() {
        const {
            actions,
            history,
            connectionProblem,
            latestVersion,
            withdrawModal,
            passwordModal,
            showOnboard,
        } = this.props;
        const { isFooterShown } = this.state;
        return (
            <ErrorBoundary>
                <Header actions={actions} activeHeader={"main"} />
                <ConnectedRouter history={history}>{routes}</ConnectedRouter>
                {isFooterShown && <Footer />}
                <div id="modalPortal" className="modal-portal" />
                {this._showIssueModal(connectionProblem, latestVersion) && (
                    <IssueModal closeModal={this._closeModal} />
                )}
                {withdrawModal && withdrawModal.status && (
                    <WithdrawModal
                        {...withdrawModal.payload}
                        closeModal={this._closeModal}
                    />
                )}
                {!showOnboard && passwordModal && passwordModal.status && (
                    <PasswordModal closeModal={this._closeModal} />
                )}
            </ErrorBoundary>
        );
    }
}

export default hot(module)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
