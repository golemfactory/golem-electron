import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import * as Actions from '../../actions';
import { ETH_DENOM } from '../../constants/variables';
import { timeStampToHR } from '../../utils/time';
import checkNested from '../../utils/checkNested';

const filter = {
    PAYMENT: 'outgoing',
    INCOME: 'incoming',
    DEPOSIT: 'deposit'
};

const mapStateToProps = state => ({
    concentBalance: state.realTime.concentBalance,
    concentSwitch: state.concent.concentSwitch,
    isMainNet: state.info.isMainNet,
    historyList: state.txHistory.historyList,
    networkInfo: state.info.networkInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

class TransactionTube extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConcentInfo: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !isEqual(nextProps.concentBalance?.value, this.props.concentBalance?.value) ||
            !isEqual(nextProps.networkInfo, this.props.networkInfo) ||
            !isEqual(nextProps.paymentHistory, this.props.paymentHistory) ||
            !isEqual(nextProps.historyList, this.props.historyList) ||
            nextState.showConcentInfo !== this.state.showConcentInfo
        );
    }

    _toggleHistory = () => {
        this.props.toggleTransactionHistory();
    };

    _toggleTxTube = elm => {
        const txHistoryBtn = document.getElementById('txHistoryBtn');
        const concentBtn = document.getElementById('concentBtn');
        txHistoryBtn.classList.remove('selected');
        concentBtn.classList.remove('selected');
        elm.target.classList.add('selected');

        this.setState({
            showConcentInfo: elm.target.id === concentBtn.id
        });
    };

    _openConcentSetting = () => {
        window.routerHistory.push('settings');
    };

    _fetchLastTransaction = list => {
        const { created, currency, direction, amount, task_payment } =
            list.length > 0 && list[0].data;
        const { concentBalance, concentSwitch, isMainNet } = this.props;
        const { showConcentInfo } = this.state;
        return (
            <div className="content__tube">
                {concentSwitch && (
                    <div
                        id="txHistoryBtn"
                        className="tx-switch-btn selected"
                        onClick={this._toggleTxTube}>
                        <span className="icon-transaction-history" />
                    </div>
                )}
                {!showConcentInfo ? (
                    list.length > 0 ? (
                        <div className="section__tube content__latest-tx">
                            <span>Latest transaction:</span>
                            <span>
                                <span
                                    className={`finance__indicator ${
                                        direction === filter.INCOME
                                            ? 'indicator--up'
                                            : 'indicator--down'
                                    }`}>
                                    {direction === filter.INCOME ? '+ ' : '- '}
                                </span>
                                <b>
                                    {(
                                        (Number(amount)
                                            ? amount
                                            : task_payment?.missing_amount) /
                                        ETH_DENOM
                                    ).toFixed(4)}
                                    {isMainNet ? ' ' : ' t'}
                                    {currency}
                                </b>
                            </span>
                            <span>{timeStampToHR(created, false, true)}</span>
                            <div
                                className="btn__transaction-history"
                                onClick={this._toggleHistory}>
                                <span>
                                    <span className="icon-transaction-history" />
                                    <b>Transaction History</b>
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="section__tube content__latest-tx">
                            <span className="no-payment">
                                You don't have any payment yet.
                            </span>
                            <div
                                className="btn__transaction-history"
                                onClick={this._toggleHistory}>
                                <span>
                                    <span className="icon-transaction-history" />
                                    <b>Transaction History</b>
                                </span>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="section__tube content__concent-info">
                        <div className="concent-info__deposit">
                            <span>Deposit amount: </span>
                            <span>
                                <b>
                                    {concentBalance
                                        ? concentBalance.value
                                              .dividedBy(ETH_DENOM)
                                              .toFixed(4)
                                        : '-'}
                                    {isMainNet ? ' ' : ' t'}
                                    GNT
                                </b>
                            </span>
                        </div>
                        <div
                            className="btn__concent-settings"
                            onClick={this._openConcentSetting}>
                            <span>
                                <span className="icon-settings" />
                                <b>Concent Settings</b>
                            </span>
                        </div>
                    </div>
                )}
                {concentSwitch && (
                    <div
                        id="concentBtn"
                        className="tx-switch-btn"
                        onClick={this._toggleTxTube}>
                        <span className="icon-locked" />
                    </div>
                )}
            </div>
        );
    };

    render() {
        const { networkInfo, historyList } = this.props;
        const [_, filteredList] = historyList['all'];
        return (
            <div className="container__tube">
                {networkInfo && networkInfo.key ? (
                    this._fetchLastTransaction(filteredList)
                ) : (
                    <span className="content__tube">Loading...</span>
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionTube);
