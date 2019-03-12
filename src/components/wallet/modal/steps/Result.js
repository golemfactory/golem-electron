import React from "react";
import Lottie from "react-lottie";

import animDataSuccess from "./../../../../assets/anims/success";
import animDataError from "./../../../../assets/anims/error";
import { modals, currencyIcons } from "./../../../../constants";

const { clipboard } = window.electron;

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: null,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default class WithdrawResult extends React.Component {
    constructor(props) {
        super(props);
    }

    _handleApply = () => this.props.applyHandler();

    _initResult = (_condition) => {
        if (_condition)
            return [
                <div key="1">
                    <span className="info__result">
                        Your fund has been sent
                        <br />
                        to the provided address.
                    </span>
                    <br />
                    <span className="info__result">You can watch it on:</span>
                </div>,
                <div key="2">
                    {this._initEtherscan(this.props.txList)}
                    <br />
                </div>
            ];

        return (
            <div>
                <span className="info__result">
                    There's a problem with withdrawal.
                </span>
                <br />
                <span className="info__result">Please try again later.</span>
            </div>
        );
    }

    _initEtherscan(_txList) {
        return _txList.map(id => {
            return (
                <div key={id.toString()}>
                    <a href={`https://etherscan.io/tx/${id}`}>Etherscan</a>
                </div>
            );
        });
    }
    //<span className="btn--cancel">Back</span>
    render() {
        const { type, currency, isSuccess } = this.props;
        defaultOptions.animationData = isSuccess
            ? animDataSuccess
            : animDataError;
        return (
            <div className="content__modal content__modal--result ">
                <div className="container__icon">
                    <Lottie options={defaultOptions} />
                </div>
                {this._initResult(isSuccess)}
                <div className="action__modal">
                    <button
                        type="button"
                        className="btn--primary"
                        onClick={this._handleApply}
                        autoFocus>
                        Okay
                    </button>
                </div>
            </div>
        );
    }
}
