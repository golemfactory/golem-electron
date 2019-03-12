import React, { Component } from "react";
import { Route, Switch } from "react-router-dom"; // react-router v4
import { ConnectedRouter } from "connected-react-router";
import { hot } from "react-hot-loader";

import constants from "../constants";

import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/Header";
import MainFragment from "../components/network";
import Tasks from "../components/tasks";
import Frame from "../components/tasks/frame";
import MasterFilePicker from "../components/tasks/MasterFilePicker";
import NewTask from "../components/tasks/NewTask";
import TaskDetail from "../components/tasks/TaskDetail";
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
                path="/"
                component={OnBoardingComponent(
                    MainFragment
                )} /*component={ LoadingComponent(MainFragment, ['MAIN_LOADER'])[0]}*/
            />
            <Route
                path="/tasks"
                component={OnBoardingComponent(
                    Tasks
                )} /*component={ LoadingComponent(Tasks, ['TASK_PANEL_LOADER'])[0]}*/
            />
            <Route
                path="/settings"
                component={OnBoardingComponent(
                    ConcentOnboardingComponent(Settings)
                )}
            />
            <Route path="/task/:id" component={TaskDetail} />
            <Route path="/add-task/master-file" component={MasterFilePicker} />
            <Route path="/add-task/type/:type?" component={NewTask} />
            <Route path="/add-task/settings" component={TaskDetail} />
            <Route component={NotFound} status={404} />
        </Switch>
    </div>
);

function isGolemReady(gs) {
    return gs.status === "Ready" && gs.message.toLowerCase().includes("node");
}

const mapStateToProps = state => ({
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
    chartValues: state.advanced.chartValues
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

/**
 * { Main Application Component. (Include Router) }
 *
 * @class      App (name)
 */
export class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { actions } = this.props;
        actions.login("Muhammed");
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

    _closeModal = _modalType => {
        const { actions } = this.props;
        const modals = constants.modals;
        if (modals.ISSUEMODAL === _modalType) {
            actions.setConnectionProblem(false);
        } else if (modals.WITHDRAWMODAL === _modalType) {
            actions.callWithdrawModal(false, null);
        }
    };

    _showIssueModal(...args) {
        const issues = args.map(item => (item ? item.issue : null));
        const result = issues.some(item => !!item);
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
            showOnboard
        } = this.props;
        return (
            <ErrorBoundary>
                <Header actions={actions} activeHeader={"main"} />
                <ConnectedRouter history={history}>{routes}</ConnectedRouter>
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
