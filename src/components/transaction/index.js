import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Actions from "../../actions";
import { getFilteredPaymentHistory } from "../../reducers";
import { timeStampToHR } from "../../utils/secsToHMS";

const filter = {
    PAYMENT: "payment",
    INCOME: "income"
};
const ETH_DENOM = 10 ** 18;

const mapStateToProps = state => ({
    paymentHistory: getFilteredPaymentHistory.bind(null, state),
    concentBalance: state.realTime.concentBalance
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

        if(elm.target.id === concentBtn.id){
            this.props.actions.getConcentBalance();
        }

        this.setState({
            showConcentInfo: elm.target.id === concentBtn.id
        })
    }

    _openConcentSetting = () => {
        window.routerHistory.push("settings");
    }

    _fetchLastTransaction = list => {
        const { created, type, value } = list[0].data;
        const { concentBalance } = this.props;
        const { showConcentInfo } = this.state;
        return (
            <div className="content__tube">
                <div id="txHistoryBtn" className="tx-switch-btn selected" onClick={this._toggleTxTube}>
                    <span className="icon-transaction-history"/>
                </div>
                {
                    !showConcentInfo
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
                        : <div className="section__tube content__concent-info">
                            <div className="concent-info__deposit">
                                <span>Deposit amount: </span>
                                <span><b>{(4.4444).toFixed(4)} GNT</b></span>
                            </div>
                            <div className="btn__concent-settings" onClick={this._openConcentSetting}>
                                <span>
                                    <span className="icon-settings" />
                                    <b>Concent Settings</b>
                                </span>
                            </div>
                        </div>
                }
                
                <div id="concentBtn" className="tx-switch-btn" onClick={this._toggleTxTube}>
                    <span className="icon-locked"/>
                </div>
            </div>
        );
    };

    render() {
        const { paymentHistory } = this.props;
        const filteredList = paymentHistory(0);
        return (
            <div className="container__tube">
                {
                    (paymentHistory && filteredList.length > 0) 
                        ? this._fetchLastTransaction(filteredList) 
                        : <span className="content__tube">Loading...</span>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionTube);
