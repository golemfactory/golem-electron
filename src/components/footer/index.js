import React, { PureComponent } from 'react';
import { Transition, animated } from 'react-spring/renderprops.cjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import * as Actions from './../../actions';
import {
  getStatus,
  getPasswordModalStatus,
  getComponentWarnings
} from './../../reducers';

import DotAnim from '../DotAnim';
import LoadingIndicator from './LoadingIndicator';
import ModuleStatus from './ModuleStatus';
import ProviderStatus from './ProviderStatus';
import SocialBar from './SocialBar';
import StatusMessage from './StatusMessage';
import Wave from './Wave';

import { componentStatus } from './../../constants/statusDicts';

/*############# HELPER FUNCTIONS ############# */

function isGolemConnected(gs) {
  return (
    !!gs?.status &&
    !!gs?.message &&
    gs?.status === componentStatus.READY &&
    gs?.message.includes('Node')
  );
}

function isGolemConnecting(isEngineOn, status) {
  return (
    status?.client?.status &&
    (status.client.message === 'Logged In' ||
      (status.client.status !== componentStatus.READY &&
        status.client.status !== componentStatus.SHUTDOWN)) &&
    !status.client.message.includes('configuration')
  );
}

function golemDotClass(status, connectionProblem, componentWarnings = []) {
  if (status && isGolemConnected(status)) {
    return connectionProblem?.status || componentWarnings.length > 0
      ? componentWarnings.length === 1 && componentWarnings[0].issue === 'RAM'
        ? 'blue'
        : 'yellow'
      : 'green';
  } else if (status?.status !== componentStatus.EXCEPTION) {
    return 'yellow';
  }
  return 'red';
}

const mapStateToProps = state => ({
  connectionProblem: state.info.connectionProblem,
  status: getStatus(state, 'golemStatus'),
  passwordModal: getPasswordModalStatus(state, 'passwordModal'),
  componentWarnings: getComponentWarnings(state, 'componentWarnings'),
  chosenPreset: state.advanced.chosenPreset,
  isEngineOn: state.info.isEngineOn,
  stats: state.stats.stats.provider || state.stats.stats,
  isEngineLoading: state.info.isEngineLoading,
  networkInfo: state.info.networkInfo,
  version: state.info.version,
  isGracefulShutdownEnabled: state.info.isGracefulShutdownEnabled
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export class Footer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      engineLoading: false,
      stopAnim: false
    };
  }

  componentDidMount() {
    const waveLoading = document.getElementById('waveLoading');
    waveLoading &&
      waveLoading.addEventListener('webkitTransitionEnd', event => {}, false);

    if (isGolemConnected(this.props?.status?.client)) {
      this.setState(
        {
          stopAnim: true
        },
        () => waveLoading.remove()
      );
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.isEngineOn !== this.props.isEngineOn) {
      this.setState({
        engineLoading: false
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

  _cancelShutdown = () => this.props.actions.gracefulShutdown();

  _forceQuit = () => this.props.actions.toggleForceQuit();

  render() {
    const {
      status,
      componentWarnings,
      connectionProblem,
      isEngineOn,
      stats,
      engineLoading,
      isEngineLoading,
      isGracefulShutdownEnabled,
      passwordModal,
      version
    } = this.props;
    return (
      <div
        className={`content__footer-main ${isGolemConnecting(
          isEngineOn,
          status
        ) && 'content__footer-main__loading'}`}>
        <div className="section__actions">
          <div className="section__actions-status">
            <span
              className={`progress-status indicator-status indicator-status--${golemDotClass(
                status.client,
                connectionProblem,
                componentWarnings
              )}`}
            />
            <div>
              <StatusMessage
                componentWarnings={componentWarnings}
                connectionProblem={connectionProblem}
                isEngineOn={isEngineOn}
                isGolemConnecting={isGolemConnecting}
                status={status}
              />
              <Transition
                native
                initial={null}
                items={
                  (stats && !!Object.keys(stats).length) ||
                  status?.client?.message.includes('configuration') ||
                  status?.client?.status === componentStatus.SHUTDOWN
                }
                from={{
                  position: 'absolute',
                  opacity: 0,
                  transform: 90
                }}
                enter={{
                  position: 'initial',
                  opacity: 1,
                  transform: 0
                }}
                leave={{
                  position: 'absolute',
                  opacity: 0,
                  transform: -180
                }}>
                {toggle =>
                  toggle
                    ? props => (
                        <ProviderStatus
                          {...props}
                          cancelShutdown={this._cancelShutdown}
                          forceQuit={this._forceQuit}
                          stats={stats}
                          status={status}
                        />
                      )
                    : props => (
                        <ModuleStatus
                          {...props}
                          connectionProblem={connectionProblem}
                          golemDotClass={golemDotClass}
                          status={status}
                        />
                      )
                }
              </Transition>
            </div>
          </div>
          <button
            className={`btn--primary ${isEngineOn ? 'btn--yellow' : ''}`}
            onClick={this._golemize}
            disabled={isGolemConnecting(isEngineOn, status)}>
            {isEngineOn ? 'Stop' : 'Start'} Golem
          </button>
          <Wave stopAnim={this.state.stopAnim} />
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
