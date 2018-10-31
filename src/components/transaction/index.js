import React, { Component } from "react";

class TransactionTube extends Component {
    constructor(props) {
        super(props);
    }

    _toggleHistory = () => {
        this.props.toggleTransactionHistory();
    };

    render() {
        return (
            <div className="content__tube">
                <span>LATEST TRANSACTION:</span>
                <span>
                    <span>+ </span>
                    <b>0.0142 GNT</b>
                </span>
                <span>07/05/2018 - 13:56:53</span>
                <div className="btn__transaction-history" onClick={this._toggleHistory}>
                    <span>
                        <span className="icon-transaction-history"/>
                        <b>Transaction History</b>
                    </span>
                </div>
            </div>
        );
    }
}

export default TransactionTube;
