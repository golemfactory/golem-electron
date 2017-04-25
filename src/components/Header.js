import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { browserHistory, Link } from 'react-router'
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'
const {BrowserWindow} = window.require('electron').remote;
import { setConfig, getConfig } from './../utils/configStorage'
/**
 * { Class for header component with navigation. }
 *
 * @class      Header (name)
 */
export default class Header extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const index = location.pathname === "/" ? 1 : 2 // <-- HARDCODED
        let navItems = document.getElementsByClassName('nav__item')
        navItems > 0 && navItems[index].classList.add('active')
    }

    /**
     * [_navigateTo active class handling for navigation items]
     * @param  {String}     to      [Route fo the page]
     * @param  {Object}     elm     [Element in target]
     */
    _navigateTo(to, isNav = true, elm) {
        let navItems = document.getElementsByClassName('nav__item')
        let menuItems = document.getElementsByClassName('menu__item')
        if (isNav) {
            for (var i = 0; i < navItems.length; i++) {
                navItems[i].classList.remove('active')
            }
            for (var i = 0; i < menuItems.length; i++) {
                menuItems[i].classList.remove('active')
            }
            elm.currentTarget.classList.add('active')
        } else {
            for (var i = 0; i < navItems.length; i++) {
                navItems[i].classList.remove('active')
            }
            for (var i = 0; i < menuItems.length; i++) {
                menuItems[i].classList.remove('active')
            }
            elm.currentTarget.classList.add('active')
        }

        browserHistory.push(to);
    }


    /**
     * [_onClose,_onMinimize,_onMaximize Native Window Button handlers]
     */
    _onClose() {
        let win = BrowserWindow.getFocusedWindow();
        win.close()
    }

    _onMinimize() {
        let win = BrowserWindow.getFocusedWindow();
        win.minimize()
    }

    _onMaximize() {
        let win = BrowserWindow.getFocusedWindow();
        win.isMaximized() ? win.unmaximize() : win.maximize()
    }


    /**
     * [_handleTab to change active class of selected tab title]
     * 
     * @param   {Object}     elm     [target element]
     */
    _handleMenu(to, elm) {
        let menuItems = document.getElementsByClassName('menu__item')
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].classList.remove('active')
        }
        elm.currentTarget.classList.add('active')
        browserHistory.push(`/preview/${to}`);
    }

    render() {
        const {activeHeader} = this.props
        return (
            <header className="header">
             <div className="top-titlebar">
                <div>
                    <span>Golem</span>
                </div>
                <div className="os__menu">
                    <span className="icon-minimize"/>
                    <span className="icon-close"/>
                </div>
             </div>
            <nav className="nav" role="menubar">
                <ul className="nav__list" role="menu">
                    <li className="nav__item traffic-light">
                        <div className="close" onClick={::this._onClose} role="menuitem" tabIndex="0" aria-label="Close"></div>
                        <div className="minimize" onClick={::this._onMinimize} role="menuitem" tabIndex="0" aria-label="Minimize"></div>
                        <div className="maximize" onClick={::this._onMaximize} disabled={true} role="menuitem" tabIndex="0" aria-label="Maximize"></div>
                    </li>
                    {activeHeader === 'main' && <li className="nav__item" onClick={this._navigateTo.bind(this, '/', true)} role="menuitem" tabIndex="0" aria-label="Network">Network</li>}
                    {activeHeader === 'main' && <li className="nav__item" onClick={this._navigateTo.bind(this, '/tasks', true)} role="menuitem" tabIndex="0" aria-label="Tasks">Tasks</li>}
                    {activeHeader === 'main' && <span className="selector"></span>}
                </ul>
                {activeHeader === 'main' &&
            <ul className="menu" role="menu">
                    <ReactTooltip placement="bottom" trigger={['hover']} overlay={<p>New Task</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }}>
                        <li className="menu__item"><span className="icon-add" role="menuitem" tabIndex="0" aria-label="New Task"/></li>
                    </ReactTooltip>
                    <ReactTooltip placement="bottom" trigger={['hover']} overlay={<p>Docs</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }}>
                        <li className="menu__item"><span className="icon-doc" role="menuitem" tabIndex="0" aria-label="Documentation"/></li>
                    </ReactTooltip>
                    <ReactTooltip placement="bottomRight" trigger={['hover']} overlay={<p>Settings</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }}>
                        <li className="menu__item" onClick={this._navigateTo.bind(this, '/settings', false)} role="menuitem" tabIndex="0" aria-label="Settings"><span className="icon-settings"/></li>
                    </ReactTooltip>
                </ul>
            }
            {activeHeader === 'secondary' &&
            <div className="header__frame">
                    <div className="title">
                        <span>HMD Model Bake 3.5</span>
                    </div>
                    <div className="info">
                        <span className="time">1:21:15 Remaining</span>
                        <span className="amount__frame">250 Frames</span>
                    </div>
                    <div className="menu" role="menu">
                        <span className="menu__item active" role="menuitem" tabIndex="0" aria-label="Completed Frames" onClick={this._handleMenu.bind(this, 'complete')}>Complete</span>
                        <span className="menu__item" role="menuitem" tabIndex="0" aria-label="All Frames" onClick={this._handleMenu.bind(this, 'all')}>All</span>
                    </div>
                </div>
            }
            </nav>
            
            </header>
        );
    }
}