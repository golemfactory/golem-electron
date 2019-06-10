import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@tippy.js/react';

import * as Actions from '../actions';

import mainNetLogo from './../assets/img/mainnet-logo-small.svg';
import testNetLogo from './../assets/img/testnet-logo-small.svg';

import NotificationCenter from './NotificationCenter';
import directorySelector from "./../utils/directorySelector";

const { remote } = window.electron;
const { BrowserWindow, dialog } = remote;
const mainProcess = remote.require('./index');

/**
 * Helper function
 */

const getSiblings = function(elem) {
    var siblings = [];
    var sibling = elem.parentNode.firstChild;
    for (; sibling; sibling = sibling.nextSibling) {
        if (sibling.nodeType !== 1 || sibling === elem) continue;
        siblings.push(sibling);
    }
    return siblings;
};

/**
 * Helper function
 */

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    connectedPeers: state.realTime.connectedPeers,
    isMainNet: state.info.isMainNet,
    notificationList: state.notification.notificationList
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const DOCLINK = 'https://docs.golem.network/';
const HASHLIST = {
    '/': 0,
    '/tasks': 1,
    '/settings': 4
};

/**
 * { Class for header component with navigation. }
 *
 * @class      Header (name)
 */
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMac: mainProcess.isMac()
        };
    }

    componentDidMount() {
        const index =
            HASHLIST[
                window?.routerHistory?.location?.pathname
            ];
        let navItems = document.getElementsByClassName('nav__item');
        let menuItems = document.getElementsByClassName('menu__item');
        let allNav = [...navItems, ...menuItems];
        Number.isInteger(index) &&
            allNav &&
            allNav.length > 0 &&
            allNav[index].classList.add('active');

        /*EXPRIMENTAL*/
        // window.require('electron').ipcRenderer.on('REDIRECT_FROM_TRAY', (event, message) => {
        //     this._navigateTo(message, null)
        // })

        window.routerHistory &&
            window.routerHistory.listen((location, action) => {
                [].map.call(allNav, item => {
                    item.classList.remove('active');
                });

                const index = HASHLIST[location.pathname];
                Number.isInteger(index) &&
                    allNav &&
                    allNav.length > 0 &&
                    allNav[index].classList.add('active');
            });
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

    /**
     * [_onClose,_onMinimize,_onMaximize Native Window Button handlers]
     */
    _onClose() {
        let win = BrowserWindow.getFocusedWindow();
        win.close();
    }

    _onMinimize() {
        let win = BrowserWindow.getFocusedWindow();
        win.minimize();
    }

    _onMaximize() {
        let win = BrowserWindow.getFocusedWindow();
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
        const onFileHandler = (data) => {
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
        const unreadNotificationAmount = notificationList.reduce(function(
            n,
            item
        ) {
            return n + (item.seen === false);
        },
        0);

        return (
            <Tooltip
                arrow
                content={<NotificationCenter />}
                interactive
                placement="bottom"
                theme="light"
                trigger="click"
                hideOnClick>
                <Tooltip
                    content={<p>Notifications</p>}
                    placement="bottom"
                    trigger="mouseenter"
                    hideOnClick={connectedPeers}>
                    <li className="menu__item">
                        <span
                            className="icon-notification"
                            role="menuitem"
                            tabIndex="0"
                            aria-label="Documentation">
                            {unreadNotificationAmount ? (
                                <span className="indicator__notification">
                                    {unreadNotificationAmount}
                                </span>
                            ) : (
                                undefined
                            )}
                        </span>
                    </li>
                </Tooltip>
            </Tooltip>
        );
    }

    // <div className="top-titlebar">
    //     <div style={styling} className="draggable draggable--win"></div>
    //     <div>
    //         <span>Golem</span>
    //     </div>
    //     <div className="os__menu" role="menu">
    //         <span className="icon-minimize" onClick={this._onMinimize} role="menuitem" tabIndex="0" aria-label="Close"/>
    //         <span className="icon-close" onClick={this._onClose} role="menuitem" tabIndex="0" aria-label="Minimize"/>
    //     </div>
    // </div>

    //<span className="icon-file-menu" role="menuitem" tabIndex="0" aria-label="New Task"  title="Add File" onClick={this._onFileDialog.bind(this, ["openFile"])}/>
    //<span className="icon-folder-menu" role="menuitem" tabIndex="0" aria-label="New Task"  title="Add Folder" onClick={this._onFileDialog.bind(this, ["openDirectory"])}/>

    render() {
        const { isMac } = this.state;
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
                    className={`nav ${
                        isMainNet ? 'nav-mainnet' : 'nav-testnet'
                    }`}
                    role="menubar">
                    <div
                        style={styling}
                        className="draggable draggable--other"
                    />
                    {activeHeader === 'main' && (
                        <div className="nav__list">
                            <img
                                src={isMainNet ? mainNetLogo : testNetLogo}
                                className="logo__header"
                            />
                        </div>
                    )}
                    {activeHeader === 'main' && (
                        <ul className="menu" role="menu">
                            {!isMainNet && this._initNotificationCenter()}
                            <Tooltip
                                content={
                                    <div className="menu__upload">
                                        <div
                                            className="menu-item__upload"
                                            onClick={this._onFileDialog.bind(
                                                this,
                                                ['openFile']
                                            )}>
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
                                            onClick={this._onFileDialog.bind(
                                                this,
                                                ['openDirectory']
                                            )}>
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
                                isEnabled={
                                    !(isMac || !isEngineOn || !connectedPeers)
                                }
                                hideOnClick>
                                <Tooltip
                                    content={this._taskHints(
                                        isEngineOn,
                                        connectedPeers
                                    )}
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
                                                isEngineOn &&
                                                connectedPeers &&
                                                isMac
                                                    ? this._onFileDialog.bind(
                                                          this,
                                                          [
                                                              'openFile',
                                                              'openDirectory'
                                                          ]
                                                      )
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
                                    onClick={this._navigateTo.bind(
                                        this,
                                        '/settings'
                                    )}
                                    role="menuitem"
                                    tabIndex="0"
                                    aria-label="Settings">
                                    <span className="icon-settings" />
                                </li>
                            </Tooltip>
                        </ul>
                    )}
                    {activeHeader === 'secondary' && (
                        <div className="header__frame">
                            <div className="title">
                                <span>{taskDetails.name}</span>
                            </div>
                            <div className="info">
                                <span className="time">
                                    {taskDetails.status}
                                </span>
                                <span className="amount__frame">
                                    {taskDetails.options &&
                                        taskDetails.options.frame_count}{' '}
                                    {taskDetails.options &&
                                    taskDetails.options.frame_count > 1
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
                                    onClick={this._handleMenu.bind(
                                        this,
                                        'complete'
                                    )}>
                                    Complete
                                </span>
                                <span
                                    className={`menu__item ${
                                        taskDetails.options &&
                                        taskDetails.options.frame_count > 1
                                            ? 'active'
                                            : ''
                                    }`}
                                    role="menuitem"
                                    tabIndex="0"
                                    aria-label="All Frames"
                                    onClick={this._handleMenu.bind(
                                        this,
                                        'all'
                                    )}>
                                    All
                                </span>
                            </div>
                        </div>
                    )}
                </nav>
                {activeHeader === 'main' && (
                    <nav className="nav">
                        <ul className="nav__list" role="menu">
                            {activeHeader === 'main' && (
                                <li
                                    className="nav__item"
                                    onClick={this._navigateTo.bind(this, '/')}
                                    role="menuitem"
                                    tabIndex="0"
                                    aria-label="Network">
                                    Network
                                </li>
                            )}
                            {activeHeader === 'main' && (
                                <li
                                    className="nav__item"
                                    onClick={this._navigateTo.bind(
                                        this,
                                        '/tasks'
                                    )}
                                    role="menuitem"
                                    tabIndex="0"
                                    aria-label="Tasks">
                                    Tasks
                                </li>
                            )}
                            {activeHeader === 'main' && (
                                <span className="selector" />
                            )}
                        </ul>
                    </nav>
                )}
            </header>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
