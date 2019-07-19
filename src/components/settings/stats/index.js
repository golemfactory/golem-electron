import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ProviderStats from './Provider'
import RequestorStats from './Requestor'

export default class Stats extends React.Component {

    state = {
        statisticTabIndex: 0
    };

    _handleTab = elm => {
        const index = Array.prototype.indexOf.call(
            elm.target.parentElement.children,
            elm.currentTarget
        );
        let menuItems = document.getElementsByClassName('stats-tab-item');
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].classList.remove('active');
        }
        elm.currentTarget.classList.add('active');
        this.setState({
            statisticTabIndex: index
        });
    };

    statisticContentList = [
        <ProviderStats/>,
        <RequestorStats/>
    ]

    render() {
        const { statisticTabIndex } = this.state;
        return (
            <div className="content__stats">
                <nav className="nav stats-nav">
                    <ul className="nav__list" role="menu">
                        <li
                            className="nav__item stats-tab-item active"
                            role="menuitem"
                            tabIndex="0"
                            onClick={this._handleTab}
                            aria-label="Provider Statistics">
                            Provider statistics
                        </li>
                        <li
                            className="nav__item stats-tab-item"
                            role="menuitem"
                            tabIndex="0"
                            onClick={this._handleTab}
                            aria-label="Requestor Statistics">
                            Requestor statistics
                        </li>
                        <span className="selector" />
                    </ul>
                </nav>
                <Fragment>
                    {this.statisticContentList[statisticTabIndex]}
                </Fragment>
            </div>
        );
    }
}
