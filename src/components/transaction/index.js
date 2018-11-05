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
    paymentHistory: getFilteredPaymentHistory.bind(null, state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

class TransactionTube extends Component {
    constructor(props) {
        super(props);
    }

    _toggleHistory = () => {
        this.props.toggleTransactionHistory();
    };

    _fetchLastTransaction = list => {
        const { created, type, value } = list[0].data;
        return (
            <div className="content__tube">
                <span>LATEST TRANSACTION:</span>
                <span>
                    <span className={`finance__indicator ${type === filter.INCOME ? "indicator--up" : "indicator--down"}`}>
                        {type === filter.INCOME ? "+ " : "- "}
                    </span>
                    <b>{(value / ETH_DENOM).toFixed(4)} GNT</b>
                </span>
                <span>{timeStampToHR(created)}</span>
                <div className="btn__transaction-history" onClick={this._toggleHistory}>
                    <span>
                        <span className="icon-transaction-history" />
                        <b>Transaction History</b>
                    </span>
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
