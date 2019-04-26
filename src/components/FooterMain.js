import React, { Component } from 'react';
import Tooltip from '@tippy.js/react';
import Lottie from 'react-lottie';
import { Transition, animated, interpolate } from 'react-spring/renderprops.cjs';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from "./../actions";
import { getStatus, getPasswordModalStatus } from "./../reducers";
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

/*############# HELPER FUNCTIONS ############# */

function isGolemConnected(gs) {
    return (
        !!gs.status &&
        !!gs.message &&
        gs.status === "Ready" &&
        gs.message.toLowerCase().includes("node")
    );
}

function isGolemConnecting(isEngineOn, status) {
    return (
        checkNested(status, "client", "status") &&
        status.client.status !== "Ready" &&
        isEngineOn
    );
}

const mapStateToProps = state => ({
    connectionProblem: state.info.connectionProblem,
    status: getStatus(state, "golemStatus"),
    passwordModal: getPasswordModalStatus(state, "passwordModal"),
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
    golemDotClass(_golemStatus, _connectionProblem) {
        if (_golemStatus && isGolemConnected(_golemStatus)) {
            return _connectionProblem && _connectionProblem.status
                ? "yellow"
                : "green";
        } else if (_golemStatus && _golemStatus.status !== "Exception") {
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
                                ? "https://golem.network/documentation/09-common-issues-troubleshooting/docker-errors-on-windows-10/"
                                : "https://golem.network/documentation/09-common-issues-troubleshooting/docker-errors-mac/"
                        }>
                        <span className="icon-new-window" />
                    </a>
                );
            case "Outdated hyperg version": //hyperg
                return (
                    <a href="https://golem.network/documentation/09-common-issues-troubleshooting/other-common-errors/#outdated-hyperg-version">
                        <span className="icon-new-window" />
                    </a>
                );
            case "Chain sync error": //sync
                return (
                    <a href="https://golem.network/documentation/09-common-issues-troubleshooting/other-common-errors/#sync">
                        <span className="icon-new-window" />
                    </a>
                );
                break;
            case "Error connecting geth": //geth
                return (
                    <a href="https://golem.network/documentation/09-common-issues-troubleshooting/other-common-errors/#geth">
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
            if (checkNested(stat, "environment")) {
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

    _loadConnectionError(status, connectionProblem) {
        return [
            checkNested(status, "client", "message") ? (
                status.client.message.length > 10 ? (
                    <br key="br" />
                ) : (
                    ""
                )
            ) : (
                <br key="br" />
            ),
            connectionProblem.issue == "PORT" ? (
                <span key="infoPorts" className="info__ports">
                    problem with ports
                    <a href="https://golem.network/documentation/09-common-issues-troubleshooting/port-forwarding-connection-errors/#getting-started">
                        <span className="icon-new-window" />
                    </a>
                </span>
            ) : connectionProblem.issue == "WEBSOCKET" ? (
                <span key="infoPorts" className="info__ports">
                    connection dropped
                </span>
            ) : (
                ""
            )
        ];
    }

    render() {
        const {
            status,
            connectionProblem,
            isEngineOn,
            stats,
            engineLoading,
            isEngineLoading,
            passwordModal,
            version
        } = this.props;
        const versionTemplate =
            version &&
            (version.error
                ? version.message
                : `${version.message}${version.number}`);
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
                                connectionProblem
                            )}`}
                        />
                        <div>
                            <span>
                                <span className="status-message">
                                    <span>
                                        {checkNested(
                                            status,
                                            "client",
                                            "message"
                                        ) ? (
                                            status.client.message
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
                                            <a href="https://github.com/golemfactory/golem#installing-and-testing">
                                                <span className="icon-new-window" />
                                            </a>
                                        </span>
                                    )}
                                </span>
                                {status.client &&
                                    checkNested(status, "client", "message") &&
                                    this._loadErrorUrl(status.client.message)}
                                {this._loadConnectionError(
                                    status,
                                    connectionProblem
                                )}
                            </span>
                            <Transition
                              native
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
                                    {checkNested(status, "client", "status") &&
                                    status.client.status !== "Exception" ? (
                                        <div className="status__components">
                                            <div className="item__status">
                                                <div>
                                                    <span className="component-dot component-dot--blue" />
                                                    <span>Hyperg: </span>
                                                </div>
                                                <span>
                                                    {checkNested(
                                                        status,
                                                        "hyperdrive",
                                                        "message"
                                                    ) &&
                                                        status.hyperdrive
                                                            .message}
                                                </span>
                                            </div>
                                            <div className="item__status">
                                                <div>
                                                    <span className="component-dot component-dot--grey" />
                                                    <span>Hypervisor: </span>
                                                </div>
                                                <span>
                                                    {checkNested(
                                                        status,
                                                        "hypervisor",
                                                        "message"
                                                    ) &&
                                                        status.hypervisor
                                                            .message}
                                                </span>
                                            </div>
                                            <div className="item__status">
                                                <div>
                                                    <span className="component-dot component-dot--yellow" />
                                                    <span>Docker: </span>
                                                </div>
                                                <span>
                                                    {checkNested(
                                                        status,
                                                        "docker",
                                                        "message"
                                                    ) && status.docker.message}
                                                </span>
                                            </div>
                                            <div className="item__status">
                                                <div>
                                                    <span className="component-dot component-dot--green" />
                                                    <span>Geth: </span>
                                                </div>
                                                <span>
                                                    {checkNested(
                                                        status,
                                                        "ethereum",
                                                        "message"
                                                    ) &&
                                                        status.ethereum.message}
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
                        <span className="icon-golem-logo" />
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
