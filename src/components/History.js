import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import Tooltip from '@tippy.js/react';
import { Transition, animated, config } from 'react-spring';
import { AutoSizer, List, defaultCellRangeRenderer } from 'react-virtualized';
const posed = require('react-pose');
const { PoseGroup } = posed;

import HistoryItem from './HistoryItem';
import * as Actions from '../actions';
import { getFilteredPaymentHistory } from '../reducers';

const filter = {
    PAYMENT: 'outgoing',
    INCOME: 'incoming',
    DEPOSIT: 'deposit'
};

const Item = posed.default.div({
    enter: { opacity: 1 },
    exit: { opacity: 0 }
});

const mapStateToProps = state => ({
    isMainNet: state.info.isMainNet,
    isEngineOn: state.info.isEngineOn,
    paymentHistory: getFilteredPaymentHistory.bind(null, state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            filteredList: props.paymentHistory(0)
        };

        this.copyTimeout = false;
    }

    componentWillUnmount() {
        this.copyTimeout && clearTimeout(this.copyTimeout);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.activeTab !== this.state.activeTab)
            this.setState({
                filteredList: nextProps.paymentHistory(nextState.activeTab)
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(nextState, this.state);
    }

    /**
     * [_handleTab to change active class of selected tab title]
     *
     * @param   {Object}     elm     [target element]
     */
    _handleTab = elm => {
        const tabPanel = document.getElementById('historyTab');
        const tabTitles = tabPanel.childNodes;
        for (var i = 0; i < tabTitles.length; i++) {
            tabTitles[i].classList.remove('active');
        }
        elm.currentTarget.classList.add('active');
        this.setState({
            activeTab: elm.target.getAttribute('value')
        });
    };

    /**
     * [getStyles func. updated style list]
     * @return {Array} [style list of the animated item]
     */
    getStyles = (_list, _filter) => {
        return _list(_filter);
    };

    defaultStyle = () => {
        return {
            height: 0,
            opacity: 0,
            borderWidth: 0
        };
    };

    /**
     * [willEnter func. DOM elements enter animation]
     * @return {Object} [Style object]
     */
    willEnter = () => {
        return {
            height: 76,
            opacity: 1,
            borderWidth: 1
        };
    };

    /**
     * [willLeave DOM elements leave animation]
     * @return {Object} [Style object]
     */
    willLeave = () => {
        return {
            height: 0,
            opacity: 0,
            borderWidth: 0
        };
    };

    cellRangeRenderer(props) {
        const children = defaultCellRangeRenderer(props);
        const animatedChildren = (
            <PoseGroup key="list">
                {children.map(item => (
                    <Item key={item.key}>{item}</Item>
                ))}
            </PoseGroup>
        );
        return [animatedChildren];
    }

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style // Style object to be applied to row (to position it)
    }) => {
        const { filteredList } = this.state;
        const tx = filteredList[index];
        return (
            <div key={key} style={style}>
                <HistoryItem tx={tx} {...this.props} />
            </div>
        );
    };

    render() {
        const {
            isEngineOn,
            isMainNet,
            paymentHistory,
            toggleTransactionHistory
        } = this.props;
        const { activeTab, filteredList } = this.state;
        return (
            <div className="content__history">
                <div
                    id="historyTab"
                    className="tab-panel tab--sticky"
                    role="tablist">
                    <div
                        className="tab__title active"
                        value={null}
                        onClick={this._handleTab}
                        role="tab"
                        tabIndex="0">
                        All
                    </div>
                    <div
                        className="tab__title"
                        value={filter.INCOME}
                        onClick={this._handleTab}
                        role="tab"
                        tabIndex="0">
                        Incoming
                    </div>
                    <div
                        className="tab__title"
                        value={filter.PAYMENT}
                        onClick={this._handleTab}
                        role="tab"
                        tabIndex="0">
                        Outgoing
                    </div>
                    {!isMainNet && (
                        <div
                            className="tab__title"
                            value={filter.DEPOSIT}
                            onClick={this._handleTab}
                            role="tab"
                            tabIndex="0">
                            Deposit
                        </div>
                    )}
                    <div className="tab__back">
                        <span onClick={toggleTransactionHistory}>
                            <span className="icon-back" />
                            Back
                        </span>
                    </div>
                </div>
                <div>
                    {paymentHistory && filteredList.length > 0 ? (
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1 1 auto', height: '100%' }}>
                                <AutoSizer>
                                    {({ width, height }) => {
                                        return (
                                            <List
                                                width={width}
                                                height={height - 48} //offset of height
                                                cellRangeRenderer={
                                                    this.cellRangeRenderer
                                                }
                                                rowCount={filteredList.length}
                                                rowHeight={76}
                                                rowRenderer={this.rowRenderer}
                                            />
                                        );
                                    }}
                                </AutoSizer>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-list__history">
                            <span>
                                You don’t have any{' '}
                                {activeTab ? activeTab : 'earnings or payment'}{' '}
                                yet.
                                <br />
                                {isEngineOn
                                    ? ''
                                    : 'Start Golem below to generate some.'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(History);
