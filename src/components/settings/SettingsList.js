import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Transition, animated } from 'react-spring/renderprops.cjs';

import Personal from './Personal';
import Performance from './Performance';
import Price from './Price';
import Concent from './Concent';
import ConcentModal from './modal/ConcentModal';
import Trust from './Trust';
import FileLocation from './FileLocation';
import Geth from './Geth';
import Peers from './Peers';

import * as Actions from './../../actions';

const mapStateToProps = state => ({
    nodeId: state.info.networkInfo.key,
    isDeveloperMode: state.input.developerMode,
    isMainNet: state.info.isMainNet,
    concentSwitch: state.concent.concentSwitch
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class SettingsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeContent: null,
            concentModal: false,
            isConcentOn: props.concentSwitch
        };
    }

    componentDidMount() {
        const { actions, nodeId } = this.props;
        actions.showTrust(nodeId);

        this.headerEl = document.getElementById('personal');
        this.settingsTab = document.getElementById('tabContainer');
        this.settingsTab.addEventListener('keydown', this.backHandler);
    }

    componentWillUnmount() {
        this.settingsTab &&
            this.settingsTab.removeEventListener('keydown', this.backHandler);
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextProps.isDeveloperMode != this.props.isDeveloperMode &&
            this.state.activeContent > 3
        ) {
            this.setState({
                activeContent: null
            });
        }

        if (
            nextProps.concentSwitch !== this.props.concentSwitch &&
            !nextProps.concentSwitch
        ) {
            this.setState({
                concentModal: !nextProps.concentSwitch
            });
        }
    }

    backHandler = e => {
        if (e.key === 'Escape') {
            this._backToTabs();
        }
    };

    /**
     * [_handleTab func. will make selected tab visible in tab system]
     * @param  {DOM}        elm         [Clicked DOM Element]
     */
    _handleTab = elm => {
        let target = elm.currentTarget;
        let targetRoot = target.parentElement;
        let index = targetRoot.getAttribute('value');
        this.setState({
            activeContent:
                this.state.activeContent !== parseInt(index)
                    ? parseInt(index)
                    : null
        });
    };

    _backToTabs = elm => {
        this.setState({
            activeContent: null
        });
    };

    /**
     * [loadTabItems func. will  populate list with given items.]
     * @param  {Array}      data        [List of items]
     * @return {DOM}                    [Elements of list]
     */
    loadTabItems(data) {
        return data.map((item, index) => (
            <div
                className="settings-tab-item"
                key={index.toString()}
                value={index}>
                <div
                    className="tab-item-title"
                    onClick={this._handleTab}
                    role="tab"
                    tabIndex="0">
                    <span>{item.title}</span>
                    <span
                        className="icon-arrow-right"
                        aria-label="Expand Tab"
                    />
                </div>
            </div>
        ));
    }

    /**
     * [_closeModal funcs. closes modals.]
     */
    _closeModal = (isCancel = false) => {
        this.setState({
            concentModal: false
        });

        if (isCancel) this.props.actions.toggleConcent(true, false);
    };

    /**
     * [_disableConcent will disable concent with optional lock fund feature]
     * @param  {Boolean} isUnlockIncluded [if user wants to unlock the fund, the parameter will be true]
     * @return
     */
    _disableConcent = isUnlockIncluded => {
        this.setState(
            {
                concentModal: false
            },
            () =>
                this.props.actions.toggleConcent(false, true, isUnlockIncluded)
        );
    };

    _enterStyle = () => ({ transform: 100 });
    _leaveStyle = () => ({ transform: -100 });

    render() {
        const { concentModal, activeContent } = this.state;
        const { isMainNet } = this.props
        const tabItems = [
            {
                title: 'Performance',
                content: <Performance />
            },
            {
                title: 'Price',
                content: <Price />
            },
            {
                title: 'Concent Settings',
                content: <Concent />
            },
            {
                title: 'Network Trust',
                content: <Trust />
            },
            {
                title: 'Default File Location',
                content: <FileLocation />
            },
            {
                title: 'Custom Geth',
                content: <Geth />
            },
            {
                title: 'Peers',
                content: <Peers />
            }
        ];
        const filteredTabs = tabItems.filter(
            (item, _) => !(item.title == 'Concent Settings' && isMainNet)
        );
        return (
            <Fragment>
                <Personal />
                <div
                    className="settings-transition-container"
                    id="tabContainer">
                    <Transition
                        items={
                            !Number.isInteger(activeContent)
                                ? [
                                      <div className="settings-tab" id="tabs">
                                          {this.loadTabItems(filteredTabs)}
                                      </div>
                                  ]
                                : [
                                      <div
                                          className="tab-item-content"
                                          role="tabpanel"
                                          id="tabContent"
                                          tabIndex="1">
                                          <div
                                              className="back-btn"
                                              onClick={this._backToTabs}>
                                              <span
                                                  className="icon-arrow-left"
                                                  aria-label="Back to Tabs"
                                              />
                                              {filteredTabs[activeContent]?.title}
                                          </div>
                                          {filteredTabs[activeContent]?.content}
                                      </div>
                                  ]
                        }
                        keys={item => item.props.id}
                        native
                        initial={null}
                        from={
                            Number.isInteger(activeContent)
                                ? this._enterStyle
                                : this._leaveStyle
                        }
                        enter={{ transform: 0 }}
                        leave={
                            !Number.isInteger(activeContent)
                                ? this._enterStyle
                                : this._leaveStyle
                        }>
                        {item => ({ transform }) => (
                            <animated.div
                                className="horizontal-transition-container"
                                tabIndex="1"
                                style={{
                                    transform: transform.interpolate(
                                        x => `translate3d(${x}%,0,0)`
                                    )
                                }}>
                                {item}
                            </animated.div>
                        )}
                    </Transition>
                </div>
                {concentModal &&
                    ReactDOM.createPortal(
                        <ConcentModal
                            closeModal={this._closeModal}
                            toggleConcentCallback={this._disableConcent}
                        />,
                        document.getElementById('modalPortal')
                    )}
            </Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsList);
