import React, { Component } from 'react';
import Tooltip from '@tippy.js/react';
import Lottie from 'react-lottie';
import { Transition, animated, interpolate } from 'react-spring/renderprops.cjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import * as Actions from "./../actions";
import { getStatus, getPasswordModalStatus, getComponentWarnings } from "./../reducers";
import animData from "./../assets/anims/wave.json";

import LoaderBar from "./LoaderBar";
import checkNested from "./../utils/checkNested";
import golem_loading from "./../assets/img/golem-loading.svg";

const { remote, ipcRenderer } = window.electron;
const currentPlatform = remote.getGlobal("process").platform;
const versionGUI = remote.app.getVersion();

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const ISSUES = {
    PORT: {
        title: 'Problem with ports',
        message: 'The ports are unreachable',
        docs: 'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=_1-smb-port-unreachable'
    },
    RAM: {
        title: 'Not enough RAM',
        message: "You don't have enough RAM",
        docs: 'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=ram-warning'
    },
    DISK: {
        title: 'Not enough DISK',
        message: "You don't have enough DISK",
        docs: 'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=disk-space-warning'
    }
}

/*############# HELPER FUNCTIONS ############# */


function isGolemConnected(gs) {
    return (
        !!gs.status &&
        !!gs.message &&
        gs.status === "Ready" &&
        gs.message.includes("Connected")
    );
}

function isGolemConnecting(isEngineOn, status) {
    return (
        status?.client?.status &&
        status.client.status !== "Ready" &&
        isEngineOn
    );
}

const mapStateToProps = state => ({
    connectionProblem: state.info.connectionProblem,
    status: getStatus(state, "golemStatus"),
    passwordModal: getPasswordModalStatus(state, "passwordModal"),
    componentWarnings: getComponentWarnings(state, 'componentWarnings'),
    chosenPreset: state.advanced.chosenPreset,
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats,
    isEngineLoading: state.info.isEngineLoading,
    version: state.info.version
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class FooterMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            engineLoading: false
        };
    }

    componentDidMount() {
        const waveLoading = document.getElementById("waveLoading");
        waveLoading && waveLoading.addEventListener(
            "webkitTransitionEnd",
            function(event) {
                waveLoading.remove();
            },
            false
        );
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.isEngineOn !== this.props.isEngineOn) {
            this.setState({
                engineLoading: false
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state))
    }

    _golemize = () => {
        const {
            actions,
            isEngineOn,
            isEngineLoading,
            chosenPreset
        } = this.props;
        if (isEngineOn) {
            actions.stopGolem();
        } else if (!isEngineLoading) {
            actions.startGolem(chosenPreset);
        }
    };

    //TODO re-write it cleaner
    golemDotClass(status, connectionProblem, componentWarnings = []) {
        if (status && isGolemConnected(status)) {
            return (connectionProblem?.status ||
                    componentWarnings.length > 0)
                ? "yellow"
                : "green";
        } else if (status?.status !== "Exception") {
            return "yellow";
        }
        return "red";
    }

    _loadErrorUrl = msg => {
        switch (msg) {
            case "Error creating Docker VM": //docker
                return (
                    <a
                        href={
                            currentPlatform === "win32"
                                ? "https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=docker-errors-on-windows-10"
                                : "https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=docker-errors-on-macos"
                        }>
                        <span className="icon-new-window" />
                    </a>
                );
            case "Outdated hyperg version": //hyperg
                return (
                    <a href="https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=outdated-hyperg-version">
                        <span className="icon-new-window" />
                    </a>
                );
            case "Chain sync error": //sync
                return (
                    <a href="https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=sync">
                        <span className="icon-new-window" />
                    </a>
                );
                break;
            case "Error connecting geth": //geth
                return (
                    <a href="https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=geth">
                        <span className="icon-new-window" />
                    </a>
                );
            default:
                break;
        }
    };

    _openLogs = () => {
        ipcRenderer.send("open-logs");
    };

    _fetchState(stat) {
        if (stat) {
            let state = stat.status;
            if (stat?.environment) {
                state += this._fetchEnvironment(stat.environment);
            }
            return state;
        }
    }

    _fetchEnvironment(env) {
        switch (env) {
            case "BLENDER":         return " (CPU)";
            case "BLENDER_NVGPU":   return " (GPU)";
            case "BLENDER_SGX":     return " (SGX)";
            default:                return "";
        }
    }

    _loadConnectionWarnings(status, connectionProblem, componentWarnings = []) {
        let warningMessage = "";
        const newLineBeforeWarning = 
            status?.client?.message.length > 10 
                ? <br key="br" /> 
                : (" ")

        if(connectionProblem.status)
             warningMessage = connectionProblem.issue == "WEBSOCKET" ? (
                    <span key="warningWebsocket" className="info__warnings">
                        connection dropped
                    </span>
                ) : (
                    " "
                )
        else if(componentWarnings.length > 0) {
            warningMessage = <span key="warningComponent" className="info__warnings">
                                {componentWarnings.length > 1
                                    ? `${componentWarnings.length} issues`
                                    : componentWarnings[0].status 
                                        && ISSUES[componentWarnings[0].issue].title
                                }
                                <Tooltip
                                    interactive
                                    className="tooltip__warning-component"
                                    content={
                                        <p className="info__connection">
                                            {
                                                componentWarnings.map( (item, index) => {
                                                    const {docs, message} = ISSUES[componentWarnings[index].issue]
                                                    return <span 
                                                        key={index.toString()} 
                                                        className="info__connection__item">
                                                            <span className="icon-status-dot"/>
                                                            {message}
                                                            <a href={docs}>
                                                                <span className="icon-new-window"/>
                                                            </a>
                                                    </span>
                                                })
                                            }
                                        </p>
                                    }
                                    distance={status?.client?.message.length > 10 ? 40 : 30}
                                    placement="top"
                                    trigger="mouseenter"
                                    theme="light">
                                    <span className="icon-warning-rounded"/>
                                </Tooltip>
                            </span>
            }

            return [newLineBeforeWarning, warningMessage];
    }

    render() {
        const {
            status,
            componentWarnings,
            connectionProblem,
            isEngineOn,
            stats,
            engineLoading,
            isEngineLoading,
            passwordModal,
            version
        } = this.props;

        const versionTemplate =
            (version?.error
                ? version?.message || ''
                : `${version?.message || ''}${version?.number || ''}`);
        return (
            <div
                className={`content__footer-main ${isGolemConnecting(
                    isEngineOn,
                    status
                ) && "content__footer-main__loading"}`}>
                <div className="section__actions">
                    <div className="section__actions-status">
                        <span
                            className={`progress-status indicator-status indicator-status--${this.golemDotClass(
                                status.client,
                                connectionProblem,
                                componentWarnings
                            )}`}
                        />
                        <div>
                            <span>
                                <span className="status-message">
                                    <span>
                                        {status?.client?.message
                                         ? (
                                            isGolemConnecting(isEngineOn, status)
                                            ? <span>
                                                {status.client.message}
                                                <Tooltip
                                                    content={
                                                        <p className="info__connection">
                                                        The process may take a few seconds.<br/>
                                                        When all connection statuses are green<br/>
                                                        then app will properly connect.
                                                        </p>}
                                                    placement="top"
                                                    trigger="mouseenter">
                                                    <span className="icon-question-mark"/>
                                                </Tooltip>
                                            </span>
                                            : status.client.message
                                        ) : (
                                            <span>
                                                Loading
                                                <span className="jumping-dots">
                                                    <span className="dot-1">
                                                        .
                                                    </span>
                                                    <span className="dot-2">
                                                        .
                                                    </span>
                                                    <span className="dot-3">
                                                        .
                                                    </span>
                                                </span>
                                            </span>
                                        )}
                                    </span>
                                    {status && status[0] && (
                                        <span>
                                            <a href="https://docs.golem.network/#/Products/Brass-Beta/Installation">
                                                <span className="icon-new-window" />
                                            </a>
                                        </span>
                                    )}
                                </span>
                                {
                                    status?.client?.message &&
                                    this._loadErrorUrl(status.client.message)
                                }
                                {this._loadConnectionWarnings(
                                    status,
                                    connectionProblem,
                                    componentWarnings
                                )}
                            </span>
                            <Transition
                              native
                              initial={null}
                              items={!!Object.keys(stats).length}
                              from={{ position: 'absolute', opacity: 0, transform: 90}}
                              enter={{ position: 'initial', opacity: 1, transform: 0 }}
                              leave={{ position: 'absolute', opacity: 0, transform: -180}}>
                              {toggle =>
                                toggle
                                  ? props => <animated.div 
                                        style={{
                                            opacity: props.opacity.interpolate( opacity => opacity ),
                                            transform: props.transform.interpolate( y => `translateX(${y}px)` ),
                                            position: props.position
                                        }} 
                                        className="status-node">
                                    <span>
                                        Provider state:{" "}
                                        {this._fetchState(stats.provider_state)}
                                    </span>
                                    <br />
                                    <span>
                                        Attempted:{" "}
                                        {stats.subtasks_computed &&
                                            stats.subtasks_computed[1] +
                                                stats.subtasks_with_timeout[1] +
                                                stats.subtasks_with_errors[1]}
                                    </span>
                                    <br />
                                    <span>
                                        {stats.subtasks_with_errors &&
                                            `${
                                                stats.subtasks_with_errors[1]
                                            } error | ${stats.subtasks_with_timeout &&
                                                stats
                                                    .subtasks_with_timeout[1]} timeout | ${stats.subtasks_accepted &&
                                                stats
                                                    .subtasks_accepted[1]} success`}
                                    </span>
                                  </animated.div>
                                  : props => <animated.div
                                        style={{
                                            opacity: props.opacity.interpolate( opacity => opacity ),
                                            transform: props.transform.interpolate( y => `translateX(${y}px)` ),
                                            position: props.position
                                        }}
                                        className="status-node__loading">
                                    {
                                        status?.client?.status &&
                                        status.client.status !== "Exception" ? (
                                        <div className="status__components">
                                            <div className="item__status">
                                                <div>
                                                    <span className={`component-dot component-dot--${this.golemDotClass(
                                                        status?.hyperdrive,
                                                        connectionProblem
                                                    )}`} />
                                                    <span>Hyperg: </span>
                                                </div>
                                                <span>
                                                    {status?.hyperdrive?.message}
                                                </span>
                                            </div>
                                            <div className="item__status">
                                                <div>
                                                    <span className={`component-dot component-dot--${this.golemDotClass(
                                                        status?.hypervisor,
                                                        connectionProblem
                                                    )}`} />
                                                    <span>Hypervisor: </span>
                                                </div>
                                                <span>
                                                    {status?.hypervisor?.message}
                                                </span>
                                            </div>
                                            <div className="item__status">
                                                <div>
                                                    <span className={`component-dot component-dot--${this.golemDotClass(
                                                        status?.docker,
                                                        connectionProblem
                                                    )}`} />
                                                    <span>Docker: </span>
                                                </div>
                                                <span>
                                                    {status?.docker?.message}
                                                </span>
                                            </div>
                                            <div className="item__status">
                                                <div>
                                                    <span className={`component-dot component-dot--${this.golemDotClass(
                                                        status?.ethereum,
                                                        connectionProblem
                                                    )}`} />
                                                    <span>Geth: </span>
                                                </div>
                                                <span>
                                                    {status?.ethereum?.message}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span>Error while fetching status</span>
                                    )}
                                  </animated.div>
                              }
                            </Transition>
                        </div>
                    </div>
                    <button
                        className={`btn--primary ${
                            isEngineOn ? "btn--yellow" : ""
                        }`}
                        onClick={this._golemize}
                        disabled={isGolemConnecting(isEngineOn, status)}>
                        {isEngineOn ? "Stop" : "Start"} Golem
                    </button>
                    {
                        <div className="wave-loading" id="waveLoading">
                            <Lottie width={"100%"} options={defaultOptions} />
                        </div>
                    }
                </div>
                <div className="content__footer-social">
                    <span className="element__footer" onClick={this._openLogs}>
                        <span className="icon-logs" />
                        <u>open logs</u>
                    </span>
                    <a
                        className="element__footer"
                        href="https://www.github.com/golemfactory">
                        <span className="icon-golem" />
                        {versionTemplate}
                    </a>
                    <a
                        className="element__footer"
                        href="https://chat.golem.network">
                        <span className="icon-chat" />
                        <u>golem chat</u>
                    </a>
                </div>
                <div>
                    <div
                        className={`loading-indicator ${
                            isEngineLoading ? "active" : ""
                        }`}
                    />
                    <object
                        className={`loading-icon ${
                            isEngineLoading ? "active" : ""
                        }`}
                        type="image/svg+xml"
                        data={golem_loading}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FooterMain);
