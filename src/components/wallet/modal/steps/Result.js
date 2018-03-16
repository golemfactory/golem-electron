import React from 'react';

import {modals, currencyIcons} from './../../../../constants'

const {clipboard } = window.electron

export default class WithdrawResult extends React.Component {


    constructor(props) {
        super(props);
    }

    _handleApply() {
        this.props.applyHandler()
    }

    _initEtherscan(){
        return ["0x6a7ca41fdd98e00207d2724d03e2bf72b5640bd1", "0x6a7ca41fdd98e00207d2724d03e2bf72b5640bd2"].map(id => {
            return <div key={id.toString()}>
                <a href={`https://etherscan.io/tx/${id}`}>Etherscan</a>
            </div>
        })
    }
//<span className="btn--cancel">Back</span>
    render() {
        const {type, currency} = this.props
        return (
                <div className="content__modal content__modal--result ">
                    <div className="container__icon">
                        <span className="icon-confirmation"/>
                    </div>
                    <div>
                        <span className="info__result">Your fund has been sent<br/>to the provided address.</span>
                        <br/>
                        <span className="info__result">You can watch it on:</span>
                    </div>
                    <div>
                        {this._initEtherscan()}
                        <br/>
                    </div>
                    <div className="action__modal">
                        <button type="button" className="btn--primary" onClick={::this._handleApply} autoFocus>Okay</button>
                    </div>
                </div>
        );
    }
}
