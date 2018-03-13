import React from 'react';

import WithdrawForm from "./steps/Form"
import {modals, currencyIcons} from './../../../constants'

export default class WithdrawModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.closeModal(modals.WITHDRAWMODAL)
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleApply() {
    	//TO DO go to confirmation screen
        this.props.closeModal(modals.WITHDRAWMODAL)
    }

    render() {
        const {currency} = this.props
        return (
            <div className="container__modal container__withdraw-modal">
            	<WithdrawForm currency={currency} cancelHandler={::this._handleCancel} applyHandler={::this._handleApply}/>
            </div>
        );
    }
}
