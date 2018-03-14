import React from 'react';

import WithdrawForm from "./steps/Form"
import Confirmation from "./steps/Confirmation"
import Result from "./steps/Result"
import {modals, currencyIcons} from './../../../constants'

export default class WithdrawModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
        	index: 0
        }
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.closeModal(modals.WITHDRAWMODAL)
    }

    /**
     * [_handleBack funcs. go back to steps]
     */
    _handleBack() {
   		this.setState({
   			index: this.state.index - 1
        })
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleApply() {
    	//TO DO go to confirmation screen
        if(this.state.index < 2){
        	this.setState({
       			index: this.state.index + 1
            })
        } else {
            this.props.closeModal(modals.WITHDRAWMODAL)
        }
        //this.props.closeModal(modals.WITHDRAWMODAL)
    }

    _initSteps(_index){
        const {currency} = this.props
    	switch(_index){
    		case 0:
    			return <WithdrawForm currency={currency} cancelHandler={::this._handleCancel} applyHandler={::this._handleApply}/>
    		case 1:
    			return <Confirmation currency={currency} backHandler={::this._handleBack} applyHandler={::this._handleApply}/>
            case 2:
                return <Result applyHandler={::this._handleApply}/>
    		default:
    			return <div></div>
    	}
    }

    render() {
    	const { index } = this.state
        return (
            <div className="container__modal container__withdraw-modal">
            	{this._initSteps(index)}
            </div>
        );
    }
}
