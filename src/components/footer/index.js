import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";

import * as Actions from "./../../actions";
import {
  getStatus,
  getPasswordModalStatus,
  getComponentWarnings,
} from "./../../reducers";

import ContentTransition from "./ContentTransition";
import DotAnim from "../DotAnim";
import LoadingIndicator from "./LoadingIndicator";
import SocialBar from "./SocialBar";
import StatusMessage from "./StatusMessage";
import Wave from "./Wave";

import { componentStatus } from "./../../constants/statusDicts";

/*############# HELPER FUNCTIONS ############# */

function isGolemConnected(gs, portSkipped = true) {
  return (
    !!gs?.status &&
    !!gs?.message &&
    portSkipped &&
    gs?.status === componentStatus.READY &&
    gs?.message.includes("Node")
  );
}

function isGolemConnecting(isEngineOn, portSkipped, status) {
  return (
    status?.client?.status &&
    (status.client.message === "Logged In" ||
      !portSkipped ||
      (status.client.status !== componentStatus.READY &&
        status.client.status !== componentStatus.SHUTDOWN)) &&
    !status.client.message.includes("configuration")
  );
}

function golemDotClass(
  status,
  connectionProblem,
  componentWarnings = [],
  portSkipped = true
) {
  if (status && isGolemConnected(status, portSkipped)) {
    return connectionProblem?.status || componentWarnings.length > 0
      ? componentWarnings.length === 1 && componentWarnings[0].issue === "RAM"
        ? "blue"
        : "yellow"
      : "green";
  } else if (status?.status !== componentStatus.EXCEPTION) {
    return "yellow";
  }
  return "red";
}

const mapStateToProps = (state) => ({
  connectionProblem: state.info.connectionProblem,
  status: getStatus(state, "golemStatus"),
  passwordModal: getPasswordModalStatus(state, "passwordModal"),
  componentWarnings: getComponentWarnings(state, "componentWarnings"),
  chosenPreset: state.advanced.chosenPreset,
  isEngineOn: state.info.isEngineOn,
  stats: state.stats.stats.provider || state.stats.stats,
  isEngineLoading: state.info.isEngineLoading,
  networkInfo: state.info.networkInfo,
  version: state.info.version,
  isGracefulShutdownEnabled: state.info.isGracefulShutdownEnabled,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
});

export class Footer extends PureComponent {
  constructor(props) {
    super(props);
    const skipInitialAnimation = isGolemConnected(props?.status?.client);
    this.state = {
      showPortInfo: false,
      engineLoading: false,
      portSkipped: skipInitialAnimation,
      stopAnim: skipInitialAnimation,
    };
  }

  componentDidMount() {
    const waveLoading = document.getElementById("waveLoading");
    waveLoading &&
      waveLoading.addEventListener(
        "webkitTransitionEnd",
        (event) => {
          this.setState(
            {
              stopAnim: true,
            },
            () => waveLoading.remove()
          );
        },
        false
      );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.isEngineOn !== this.props.isEngineOn) {
      this.setState({
        engineLoading: false,
      });
    }
  }

  _golemize = () => {
    const { actions, isEngineOn, isEngineLoading, chosenPreset } = this.props;
    if (isEngineOn) {
      actions.stopGolem();
    } else if (!isEngineLoading) {
      actions.startGolem(chosenPreset);
    }
  };

  _setPortInfo = () => this.setState({ showPortInfo: true });
  _skipPortChecker = () =>
    this.setState({ showPortInfo: false, portSkipped: true });

  render() {
    const {
      componentWarnings,
      connectionProblem,
      engineLoading,
      isEngineOn,
      isEngineLoading,
      isGracefulShutdownEnabled,
      networkInfo,
      passwordModal,
      stats,
      status,
      version,
    } = this.props;
    const { portSkipped, showPortInfo, stopAnim } = this.state;
    return (
      <div
        className={`content__footer-main ${isGolemConnecting(
          isEngineOn,
          portSkipped,
          status
        ) && "content__footer-main__loading"}`}>
        <div className="section__actions">
          <div className="section__actions-status">
            <span
              className={`progress-status indicator-status indicator-status--${golemDotClass(
                status.client,
                connectionProblem,
                componentWarnings,
                portSkipped
              )}`}
            />
            <div>
              <StatusMessage
                componentWarnings={componentWarnings}
                connectionProblem={connectionProblem}
                isEngineOn={isEngineOn}
                isGolemConnecting={isGolemConnecting}
                showPortInfo={showPortInfo}
                status={status}
              />
              <ContentTransition
                golemDotClass={golemDotClass}
                portSkipped={portSkipped}
                setPortInfo={this._setPortInfo}
                skipPortChecker={this._skipPortChecker}
                stats={stats}
                status={status}
              />
            </div>
          </div>
          <button
            className={`btn--primary ${isEngineOn ? "btn--yellow" : ""}`}
            onClick={this._golemize}
            disabled={isGolemConnecting(isEngineOn, status)}>
            {isEngineOn ? "Stop" : "Start"} Golem
          </button>
          <Wave stopAnim={stopAnim} />
        </div>
        <SocialBar version={version} />
        <LoadingIndicator isEngineLoading={isEngineLoading} />
      </div>
    );
  }
}

function areEqual(prevProps, nextProps) {
  return (
    isEqual(prevProps.connectionProblem, nextProps.connectionProblem) &&
    isEqual(prevProps.status, nextProps.status) &&
    isEqual(prevProps.passwordModal, nextProps.passwordModal) &&
    isEqual(prevProps.componentWarnings, nextProps.componentWarnings) &&
    isEqual(prevProps.chosenPreset, nextProps.chosenPreset) &&
    isEqual(prevProps.isEngineOn, nextProps.isEngineOn) &&
    isEqual(prevProps.stats, nextProps.stats) &&
    isEqual(prevProps.isEngineLoading, nextProps.isEngineLoading) &&
    isEqual(prevProps.version, nextProps.version) &&
    isEqual(
      prevProps.isGracefulShutdownEnabled,
      nextProps.isGracefulShutdownEnabled
    )
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Footer, areEqual));
