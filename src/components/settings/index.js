import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions';

import SettingsList from './SettingsList';
import Stats from './stats';
import ACL from './acl';

let activateContent;

const mapStateToProps = state => ({
  nodeId: state.info.networkInfo.key,
  version: state.info.version
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export class Settings extends React.Component {
  state = {
    mainTabIndex: 0
  };

  _handleTab = elm => {
    const index = Array.prototype.indexOf.call(
      elm.target.parentElement.children,
      elm.currentTarget
    );
    let menuItems = document.getElementsByClassName('settings-main-tab-item');
    for (var i = 0; i < menuItems.length; i++) {
      menuItems[i].classList.remove('active');
    }
    elm.currentTarget.classList.add('active');
    this.setState({
      mainTabIndex: index
    });
  };

  mainContentList = [
    <SettingsList />,
    <Stats />,
    <ACL actions={this.props.actions} />
  ];

  render() {
    const { version } = this.props;
    const { mainTabIndex } = this.state;

    return (
      <div className="content__settings">
        <nav className="nav">
          <ul className="nav__list" role="menu">
            <li
              className="nav__item settings-main-tab-item active"
              role="menuitem"
              tabIndex="0"
              onClick={this._handleTab}
              aria-label="Settings">
              Settings
            </li>
            <li
              className="nav__item settings-main-tab-item"
              role="menuitem"
              tabIndex="0"
              onClick={this._handleTab}
              aria-label="Node statistics">
              Node statistics
            </li>
            <li
              className="nav__item settings-main-tab-item"
              role="menuitem"
              tabIndex="0"
              onClick={this._handleTab}
              aria-label="ACL">
              ACL
            </li>
            <span className="selector" />
          </ul>
        </nav>
        <Fragment>{this.mainContentList[mainTabIndex]}</Fragment>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

/*
<div className="footer__settings">
    <span>
        {version.error
            ? version.message
            : `${version.message}${version.number}`}
    </span>
    <br />
    <span>{`Golem Interface v${__VERSION__}`}</span>
</div>
 */
