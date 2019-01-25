import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Actions from "../../actions";
import { getFilteredPaymentHistory, getStatus } from "../../reducers";
import { timeStampToHR } from "../../utils/secsToHMS";
import checkNested from '../../utils/checkNested'

const filter = {
    PAYMENT: "payment",
    INCOME: "income"
};
const ETH_DENOM = 10 ** 18;

const mapStateToProps = state => ({
    concentBalance: state.realTime.concentBalance,
    concentSwitch: state.concent.concentSwitch,
    paymentHistory: getFilteredPaymentHistory.bind(null, state),
    networkInfo: state.info.networkInfo,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

class TransactionTube extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConcentInfo: false
        }
    }

    _toggleHistory = () => {
        this.props.toggleTransactionHistory();
    };

    _toggleTxTube = (elm) => {
        const txHistoryBtn  = document.getElementById("txHistoryBtn")
        const concentBtn    = document.getElementById("concentBtn") 
        txHistoryBtn.classList.remove("selected")
        concentBtn.classList.remove("selected")
        elm.target.classList.add("selected")

        this.setState({
            showConcentInfo: elm.target.id === concentBtn.id
        })
    }

    _openConcentSetting = () => {
        window.routerHistory.push("settings");
    }

    _fetchLastTransaction = list => {
        const { created, type, value } = list.length > 0 && list[0].data;
        const { concentBalance, concentSwitch } = this.props;
        const { showConcentInfo } = this.state;
        return (
            <div className="content__tube">
                {concentSwitch 
                    && <div id="txHistoryBtn" className="tx-switch-btn selected" onClick={this._toggleTxTube}>
                        <span className="icon-transaction-history"/>
                    </div>
                }
                {
                    !showConcentInfo
                        ? (list.length > 0
                            ? <div className="section__tube content__latest-tx">
                                <span>Latest transaction:</span>
                                <span>
                                    <span className={`finance__indicator ${type === filter.INCOME ? "indicator--up" : "indicator--down"}`}>
                                        {type === filter.INCOME ? "+ " : "- "}
                                    </span>
                                    <b>{(value / ETH_DENOM).toFixed(4)} GNT</b>
                                </span>
                                <span>{timeStampToHR(created, false, true)}</span>
                                <div className="btn__transaction-history" onClick={this._toggleHistory}>
                                    <span>
                                        <span className="icon-transaction-history" />
                                        <b>Transaction History</b>
                                    </span>
                                </div>
                            </div>
                            : <div className="section__tube content__latest-tx">
                                <span className="no-payment">
                                    You don't have any payment yet.
                                </span>
                                <div className="btn__transaction-history" onClick={this._toggleHistory}>
                                    <span>
                                        <span className="icon-transaction-history" />
                                        <b>Transaction History</b>
                                    </span>
                                </div>
                            </div>)
                        : <div className="section__tube content__concent-info">
                            <div className="concent-info__deposit">
                                <span>Deposit amount: </span>
                                <span>
                                    <b>
                                        {concentBalance 
                                            ? concentBalance.value.dividedBy(ETH_DENOM).toFixed(4) 
                                            : "-"
                                        } GNT
                                    </b>
                                    </span>
                            </div>
                            <div className="btn__concent-settings" onClick={this._openConcentSetting}>
                                <span>
                                    <span className="icon-settings" />
                                    <b>Concent Settings</b>
                                </span>
                            </div>
                        </div>
                }
                {concentSwitch 
                    && <div id="concentBtn" className="tx-switch-btn" onClick={this._toggleTxTube}>
                        <span className="icon-locked"/>
                    </div>
                }
            </div>
        );
    };

    render() {
        const { paymentHistory, networkInfo } = this.props;
        const filteredList = paymentHistory(0);
        return (
            <div className="container__tube">
                {
                    (paymentHistory 
                        && networkInfo 
                        && networkInfo.key) 
                            ? this._fetchLastTransaction(filteredList) 
                            : <span className="content__tube">Loading...</span>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionTube);
