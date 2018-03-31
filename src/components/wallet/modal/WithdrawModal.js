import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import {BigNumber} from 'bignumber.js';

import * as Actions from '../../../actions'

import WithdrawForm from "./steps/Form"
import Confirmation from "./steps/Confirmation"
import Result from "./steps/Result"
import {modals, currencyIcons} from './../../../constants'

const ETH_DENOM = 10 ** 18; //POW shorthand thanks to ES6

const mapStateToProps = state => ({
    publicKey: state.account.publicKey
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class WithdrawModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
        	index: 0,
            formData: {
                amount: new BigNumber(0.2).multipliedBy(ETH_DENOM),
                sendFrom: props.publicKey,
                sendTo: "",
                isSuccess: false,
                txList: []
            }
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
    _handleApply(_amount, _sendTo, _suffix) {

        //TO DO go to confirmation screen
        if(this.state.index == 0){
        	this.setState({
                formData: {
                    sendFrom: this.props.publicKey,
                    amount: _amount,
                    sendTo: _sendTo,
                    type: _suffix
                }
            }, () => {
                this.setState({
                        index: this.state.index + 1
                })
            })
        } else if(this.state.index === 1){
            this._withdrawAsync(this.state.formData).then((result) => {
                if(result){
                    this.setState({
                        index: this.state.index + 1,
                        txList: result,
                        isSuccess: result && result.length > 0
                    })
                }
            })
        }
        else {
            this.props.closeModal(modals.WITHDRAWMODAL)
        }
        //this.props.closeModal(modals.WITHDRAWMODAL)
    }

    _withdrawAsync(_formData){
        return new Promise((response, reject) => {
            const {amount, sendTo, type} = _formData
            this.props.actions.withdraw({
                    amount: amount.toString(), 
                    sendTo, 
                    type
                },
                response,
                reject)
        })
    }

    _initSteps(_index){
    	switch(_index){
    		case 0:
    			return <WithdrawForm 
                    {...this.props} 
                    cancelHandler={::this._handleCancel} 
                    applyHandler={::this._handleApply}
                    formData={this.state.formData}
                    />
    		case 1:
    			return <Confirmation 
                    {...this.props}  
                    backHandler={::this._handleBack} 
                    applyHandler={::this._handleApply}
                    formData={this.state.formData}
                    />
            case 2:
                return <Result 
                            applyHandler={::this._handleApply} 
                            isSuccess={this.state.isSuccess}
                            txList={this.state.txList}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawModal)
