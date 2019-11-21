import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@tippy.js/react';

import * as Actions from '../actions';
import { getRequestorStatus } from '../reducers';

import mainNetLogo from './../assets/img/mainnet-logo-small.svg';
import testNetLogo from './../assets/img/testnet-logo-small.svg';

import NotificationCenter from './NotificationCenter';
import directorySelector from './../utils/directorySelector';
import notify from './../utils/notify';
import ConditionalRender from './hoc/ConditionalRender';
import QuitModal from '../container/modal/QuitModal';

const { remote } = window.electron;
const { BrowserWindow, dialog } = remote;
const mainProcess = remote.require('./index');

/**
 * Helper function
 */

const getSiblings = function(element) {
  var siblings = [];
  var sibling = element.parentNode.firstChild;
  for (; sibling; sibling = sibling.nextSibling) {
    if (sibling.nodeType !== 1 || sibling === element) continue;
    siblings.push(sibling);
  }
  return siblings;
};

const setActiveClass = function(allNav, path) {
  const index = allNav.findIndex(
    item => path === item.getAttribute('data-path')
  );
  Number.isInteger(index) &&
    index >= 0 &&
    allNav &&
    allNav.length > 0 &&
    allNav[index].classList.add('active');
};

/**
 * Helper function
 */

const mapStateToProps = state => ({
  isEngineOn: state.info.isEngineOn,
  connectedPeers: state.realTime.connectedPeers,
  isMainNet: state.info.isMainNet,
  notificationList: state.notification.notificationList,
  isRequestActive: getRequestorStatus(state, 'shutdown'),
  stats: state.stats.stats,
  forceQuit: state.info.forceQuit
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

const DOCLINK = 'https://docs.golem.network/';

/**
 * { Class for header component with navigation. }
 *
 * @class      Header (name)
 */
export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMac: mainProcess.isMac(),
      quitModal: false
    };
  }

  componentDidMount() {
    let navItems = document.getElementsByClassName('nav__item');
    let menuItems = document.getElementsByClassName('menu__item');
    let allNav = [...navItems, ...menuItems];

    setActiveClass(allNav, location.hash.replace('#', ''));

    window.routerHistory &&
      window.routerHistory.listen((location, action) => {
        [].map.call(allNav, item => {
          item.classList.remove('active');
        });
        setActiveClass(allNav, location.pathname);
      });

    window.onbeforeunload = e => {
      const { isRequestActive, stats, forceQuit } = this.props;

      if (
        (stats?.provider_state?.status === 'Computing' || isRequestActive) &&
        !forceQuit
      )
        this._toggleQuitModal(cb);

      function cb(quitModal) {
        if (quitModal) {
          e.returnValue = true;
        }
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isEngineOn) {
      this._initNotificationCenter();
    }
  }

  /**
   * [_navigateTo active class handling for navigation items]
   * @param  {String}     to      [Route fo the page]
   * @param  {Object}     _       [Element in target]
   */
  _navigateTo(to, _) {
    if (window.routerHistory.location.pathname !== to)
      window.routerHistory.push(to);
  }

  _toggleQuitModal = cb =>
    this.setState(
      prevState => ({ quitModal: !prevState.quitModal }),
      () => cb && cb(this.state.quitModal)
    );

  _gracefulShutdown = () => this.props.actions.gracefulShutdown();

  _forceQuit = () => {
    this.props.actions.toggleForceQuit();
    this._onClose();
  };

  /**
   * [_onClose,_onMinimize,_onMaximize Native Window Button handlers]
   */
  _onClose = () => {
    //this.props.actions.gracefulQuit(); //TO DO popup quit modal
    const win = BrowserWindow.getFocusedWindow();
    win.close();
  };

  _onMinimize() {
    const win = BrowserWindow.getFocusedWindow();
    win.minimize();
  }

  _onMaximize() {
    const win = BrowserWindow.getFocusedWindow();
    win.isMaximized() ? win.unmaximize() : win.maximize();
  }

  /**
   * [_handleTab to change active class of selected tab title]
   *
   * @param   {Object}     elm     [target element]
   */
  _handleMenu(to, elm) {
    if (
      this.props.taskDetails.options &&
      Number(this.props.taskDetails.options.frame_count) > 1
    ) {
      let menuItems = document.getElementsByClassName('menu__item');
      for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active');
      }
      elm.currentTarget.classList.add('active');
      window.routerHistory.push(`/preview/${to}`);
    }
  }

  /**
   * [_onFileDialog func. opens file chooser dialog then checks if files has safe extensions after all redirects user to the new task screen]
   */
  _onFileDialog(dialogRules = []) {
    const onFileHandler = data => {
      //console.log(data)
      if (data) {
        directorySelector.call(this, data);
      }
    };
    /**
     * We're not able to let people to choose directory and file at the same time.
     * @see https://electron.atom.io/docs/api/dialog/#dialogshowopendialogbrowserwindow-options-callback
     */
    dialog.showOpenDialog(
      {
        properties: [...dialogRules, 'multiSelections']
      },
      onFileHandler
    );
  }

  _taskHints(engine, peers) {
    if (!engine) return <p>Golem is not started yet.</p>;
    if (!peers) return <p>There's no connected node yet.</p>;
    return <p>New Task</p>;
  }

  _initNotificationCenter() {
    const { connectedPeers, notificationList } = this.props;
    const unreadNotificationAmount = notificationList.reduce(function(n, item) {
      return n + (item.seen === false);
    }, 0);
    if (unreadNotificationAmount) {
      notify('Meet with concent!', 'To get started, clich here.', '/settings');
      this.props.actions.setSeenNotification();
    }
  }
  render() {
    const { isMac, quitModal } = this.state;
    const {
      activeHeader,
      connectedPeers,
      taskDetails,
      detail,
      isEngineOn,
      isMainNet
    } = this.props;
    let styling = {
      WebkitAppRegion: 'drag'
    };
    return (
      <header
        className={`header ${
          activeHeader === 'secondary' ? 'frame__screen' : ''
        }`}>
        <nav
          className={`nav ${isMainNet ? 'nav-mainnet' : 'nav-testnet'}`}
          role="menubar">
          <div style={styling} className="draggable draggable--other" />
          <ConditionalRender showIf={activeHeader === 'main'}>
            <div className="nav__list">
              <img
                src={isMainNet ? mainNetLogo : testNetLogo}
                className="logo__header"
              />
            </div>
            <ul className="menu" role="menu">
              <Tooltip
                content={
                  <div className="menu__upload">
                    <div
                      className="menu-item__upload"
                      onClick={this._onFileDialog.bind(this, ['openFile'])}>
                      <span
                        className="icon-file"
                        role="menuitem"
                        tabIndex="0"
                        aria-label="Add file for task"
                        title="Add File"
                      />
                      <span>Add file</span>
                    </div>
                    <div
                      className="menu-item__upload"
                      onClick={this._onFileDialog.bind(this, [
                        'openDirectory'
                      ])}>
                      <span
                        className="icon-folder"
                        role="menuitem"
                        tabIndex="0"
                        aria-label="New folder for task"
                        title="Add Folder"
                      />
                      <span>Add folder</span>
                    </div>
                  </div>
                }
                interactive
                placement="bottom"
                theme="light"
                trigger="click"
                isEnabled={!(isMac || !isEngineOn || !connectedPeers)}
                hideOnClick>
                <Tooltip
                  content={this._taskHints(isEngineOn, connectedPeers)}
                  placement="bottom"
                  trigger="mouseenter"
                  hideOnClick={connectedPeers}>
                  <li className="menu__item upload-menu">
                    <span
                      className="icon-add"
                      role="menuitem"
                      tabIndex="0"
                      aria-label="New Task"
                      title="Upload file for the task"
                      onClick={
                        isEngineOn && connectedPeers && isMac
                          ? this._onFileDialog.bind(this, [
                              'openFile',
                              'openDirectory'
                            ])
                          : undefined
                      }
                    />
                  </li>
                </Tooltip>
              </Tooltip>
              <Tooltip
                content={<p>Docs</p>}
                placement="bottom"
                trigger="mouseenter">
                <li className="menu__item">
                  <a href={DOCLINK}>
                    <span
                      className="icon-doc"
                      role="menuitem"
                      tabIndex="0"
                      aria-label="Documentation"
                    />
                  </a>
                </li>
              </Tooltip>
              <Tooltip
                content={<p>Settings</p>}
                placement="bottom"
                trigger="mouseenter">
                <li
                  className="menu__item"
                  onClick={this._navigateTo.bind(this, '/settings')}
                  role="menuitem"
                  data-path="/settings"
                  tabIndex="0"
                  aria-label="Settings">
                  <span className="icon-settings" />
                </li>
              </Tooltip>
            </ul>
          </ConditionalRender>
          <ConditionalRender showIf={activeHeader === 'secondary'}>
            <div className="header__frame">
              <div className="title">
                <span>{taskDetails?.name}</span>
              </div>
              <div className="info">
                <span className="time">{taskDetails?.status}</span>
                <span className="amount__frame">
                  {taskDetails?.options && taskDetails?.options.frame_count}{' '}
                  {taskDetails?.options && taskDetails?.options.frame_count > 1
                    ? ' Frames'
                    : ' Frame'}
                </span>
              </div>
              <div className="menu" role="menu">
                <span
                  className="menu__item"
                  role="menuitem"
                  tabIndex="0"
                  aria-label="Completed Frames"
                  onClick={this._handleMenu.bind(this, 'complete')}>
                  Complete
                </span>
                <span
                  className={`menu__item ${
                    taskDetails?.options && taskDetails?.options.frame_count > 1
                      ? 'active'
                      : ''
                  }`}
                  role="menuitem"
                  tabIndex="0"
                  aria-label="All Frames"
                  onClick={this._handleMenu.bind(this, 'all')}>
                  All
                </span>
              </div>
            </div>
          </ConditionalRender>
        </nav>
        <ConditionalRender showIf={activeHeader === 'main'}>
          <nav className="nav">
            <ul className="nav__list" role="menu">
              <li
                className="nav__item"
                onClick={this._navigateTo.bind(this, '/')}
                role="menuitem"
                data-path="/"
                tabIndex="0"
                aria-label="Network">
                Network
              </li>
              <li
                className="nav__item"
                onClick={this._navigateTo.bind(this, '/tasks')}
                role="menuitem"
                data-path="/tasks"
                tabIndex="0"
                aria-label="Tasks">
                Tasks
              </li>
              <span className="selector" />
            </ul>
          </nav>
        </ConditionalRender>
        {quitModal &&
          ReactDOM.createPortal(
            <QuitModal
              closeModal={this._toggleQuitModal}
              forceQuit={this._forceQuit}
              gracefulShutdown={this._gracefulShutdown}
            />,
            document.getElementById('modalPortal')
          )}
      </header>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
