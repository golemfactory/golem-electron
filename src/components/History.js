import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import Tooltip from '@tippy.js/react';
import { Transition, animated, config } from 'react-spring';
import {
    AutoSizer,
    InfiniteLoader,
    List,
    defaultCellRangeRenderer
} from 'react-virtualized';
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
    historyList: state.txHistory.historyList,
    listPage: state.txHistory.listPage,
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
            filteredList: props.paymentHistory(0),
            rowLoading: false
        };

        this.copyTimeout = false;
    }

    componentWillUnmount() {
        this.copyTimeout && clearTimeout(this.copyTimeout);
        this.forceListUpdateTimeoutStart &&
            clearTimeout(this.forceListUpdateTimeoutStart);
        this.forceListUpdateTimeoutEnd &&
            clearTimeout(this.forceListUpdateTimeoutEnd);
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextState.activeTab !== this.state.activeTab ||
            !isEqual(nextProps.historyList, this.props.historyList) ||
            !isEqual(nextProps.listPage, this.props.listPage)
        ) {
            this.setState({
                filteredList: nextProps.paymentHistory(nextState.activeTab)
            });
            this.forceListUpdateTimeoutStart = setTimeout(() => {
                // TODO dirty update hack, refactor it
                const listDOM = document.getElementById('historyList')
                    ?.firstChild.firstChild;
                if (listDOM) {
                    listDOM.scrollTo(0, listDOM.scrollTop + 1);
                    this.forceListUpdateTimeoutEnd = setTimeout(() => {
                        listDOM.scrollTo(0, listDOM.scrollTop - 1);
                    }, 100);
                }
            }, 800);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !isEqual(nextState, this.state) ||
            !isEqual(nextProps.historyList, this.props.historyList) ||
            !isEqual(nextProps.listPage, this.props.listPage)
        );
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
                {tx ? <HistoryItem tx={tx} {...this.props} /> : 'Loading'}
            </div>
        );
    };

    isRowLoaded = ({ index }) => {
        return !!this.state.filteredList[index];
    };

    loadMoreRows = ({ startIndex, stopIndex }) => {
        const [size, list] = this.props.historyList;
        const pageNumber = Math.floor(list?.length / 30 + 1);
        if (list?.length < size) {
            this.setState({
                rowLoading: true
            });
            setTimeout(() => {
                this.props.actions.expandHistoryPage(pageNumber);
                this.setState({
                    rowLoading: false
                });
            }, 500); //throttle
        }
    };

    render() {
        const {
            isEngineOn,
            isMainNet,
            historyList,
            paymentHistory,
            toggleTransactionHistory
        } = this.props;
        const { activeTab, filteredList, rowLoading } = this.state;
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
                        <InfiniteLoader
                            isRowLoaded={this.isRowLoaded}
                            loadMoreRows={this.loadMoreRows}
                            rowCount={historyList[0]}
                            threshold={10}>
                            {({ onRowsRendered, registerChild }) => (
                                <div style={{ display: 'flex' }}>
                                    <div
                                        id="historyList"
                                        style={{
                                            flex: '1 1 auto',
                                            height: '100%'
                                        }}>
                                        <AutoSizer>
                                            {({ width, height }) => {
                                                return (
                                                    <List
                                                        ref={registerChild}
                                                        filteredList={
                                                            filteredList[0]
                                                                ?.transaction_hash
                                                        }
                                                        width={width}
                                                        height={height - 48} //offset of height
                                                        onRowsRendered={
                                                            onRowsRendered
                                                        }
                                                        cellRangeRenderer={
                                                            this
                                                                .cellRangeRenderer
                                                        }
                                                        rowHeight={76}
                                                        rowCount={
                                                            filteredList.length
                                                        }
                                                        rowRenderer={
                                                            this.rowRenderer
                                                        }
                                                    />
                                                );
                                            }}
                                        </AutoSizer>
                                    </div>
                                </div>
                            )}
                        </InfiniteLoader>
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
                {rowLoading && (
                    <svg className="loading__history" height="1">
                        <line x1="0" y1="0" x2="560" y2="0" strokeWidth="2">
                            <animate
                                attributeType="XML"
                                attributeName="stroke"
                                values="#1c76e7;#0169CA;#1c76e7;#024686"
                                dur="0.8s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeType="XML"
                                attributeName="x2"
                                from="230"
                                to="460"
                                dur="0.5s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeType="XML"
                                attributeName="x1"
                                from="230"
                                to="0"
                                dur="0.5s"
                                repeatCount="indefinite"
                            />
                        </line>
                    </svg>
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(History);
