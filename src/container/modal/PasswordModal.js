import React from 'react';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPasswordStrength from 'react-password-strength';

import * as Actions from '../../actions'

import mainNetIcon from './../../assets/img/main-net-icon.svg'
import testNetIcon from './../../assets/img/test-net-icon.svg'

const mapStateToProps = state => ({
    passwordModal: state.realTime.passwordModal,
    isMainNet: state.info.isMainNet
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class PasswordModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            password: "",
            loadingIndicator: false,
            passwordMaskToggle: false,
            confirmationMaskToggle: false
        }
        this._handleCancel = ::this._handleCancel
    }

    clickOutside(parent, event) {
            var isClickInside = (parent.contains(event.target) && !parent.isEqualNode(event.target));
            if (!isClickInside) {
                this._handleCancel()
            }
    }

    componentDidMount() {
        this._specifiedElement = this.refs.modalContent
        this._clickOutside = this.clickOutside.bind(this, this._specifiedElement)
        window.applicationSurface.addEventListener('click', this._clickOutside)
    }

    componentWillUnmount() {
        window.applicationSurface.removeEventListener('click', this._clickOutside)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.passwordModal.error && this.state.loadingIndicator){
            const container = document.getElementById("passwordModalContainer")
            container.classList.add("modal-error")
            this.refs.password.classList.add("invalid")
            this.refs.errorInfo.textContent = "wrong password"
            setTimeout(() => {
                container.classList.remove("modal-error")
            }, 1000)
            if(this.refs.password)
                this.refs.password.value = "";
            this.setState({
                loadingIndicator: false,
                passowrd: ""
            })
        }
    }

    _handleCancel() {
        this.props.closeModal()
    }

    foo(e){
        this.setState({
            password: e.password
        })
    }

    _handlePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    _confirmPassword(e){
        const _password = e.target.value
        if(_password === this.state.password){
            e.target.classList.add("password_confirmed")
            e.target.classList.remove("password_not_confirmed")
        } else {
            e.target.classList.add("password_not_confirmed")
            e.target.classList.remove("password_confirmed")
        }
    }

    _setPassword(){
        this.props.actions.setPassword(this.state.password)
        this.setState({
            loadingIndicator: true
        })
    }

    _preventSpace(event){
        var key = event.which || window.event.which;
        if (key === 32) {
          event.preventDefault();
        }
    }

    _togglePasswordMask(_key){
        this.setState({
            [_key] : !this.state[_key]
        })
    }

    render() {
        const {isMainNet, passwordModal} = this.props
        const {loadingIndicator, passwordMaskToggle, confirmationMaskToggle} = this.state
        return (
            <div ref="modalContent" className="container__modal container__password-modal">
                <div id="passwordModalContainer" className="content__modal">
                    <div className="container-icon">
                        <img src={isMainNet ? mainNetIcon : testNetIcon} className="chain-image"/>
                    </div>
                    <div>
                        <strong>Enter password</strong>
                        <br/>
                        <span className="notice">to unlock your Golem</span>
                    </div>
                    <form id="loginForm" onSubmit={::this._setPassword}>
                     {(passwordModal && passwordModal.register) ?
                        [<div key="1" className="container__field">
                            <label>Password</label>
                            <ReactPasswordStrength
                              className="passwordField"
                              minLength={5}
                              minScore={2}
                              scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                              changeCallback={::this.foo}
                              inputProps={{ 
                                name: "password_input", 
                                type:`${this.state.passwordMaskToggle ? "text" : "password"}`,
                                autoComplete: "off", 
                                className: "form-control", 
                                onKeyPress: this._preventSpace,
                                required: true,
                                autoFocus: true
                            }}
                            />
                            <span 
                                ref="passwordMaskToggle" 
                                className={`icon-eye ${passwordMaskToggle ? "active" : ""}`} 
                                onClick={this._togglePasswordMask.bind(this, "passwordMaskToggle")}/>
                        </div>,
                        <div key="2" className="container__field">
                            <label>Confirm Password</label>
                            <input 
                                    type={`${this.state.confirmationMaskToggle ? "text" : "password"}`}  
                                    onChange={::this._confirmPassword} 
                                    onKeyPress={::this._preventSpace} 
                                    required/>
                            <span 
                                ref="passwordMaskToggle" 
                                className={`icon-eye ${confirmationMaskToggle ? "active" : ""}`} 
                                onClick={this._togglePasswordMask.bind(this, "confirmationMaskToggle")}/>
                        </div>] : 
                        <div className="container__field">
                            <label>Password</label>
                            <input 
                                ref="password" 
                                type={`${passwordMaskToggle ? "text" : "password"}`}
                                onChange={::this._handlePassword} 
                                onKeyPress={::this._preventSpace}
                                required autoFocus/>
                            <span ref="passwordMaskToggle" 
                            className={`icon-eye ${passwordMaskToggle ? "active" : ""}`} 
                            onClick={this._togglePasswordMask.bind(this, "passwordMaskToggle")}/>
                            <span ref="errorInfo" className="error-info"/>
                        </div>
                        }
                        <button 
                            type="submit" 
                            className={`btn--primary ${loadingIndicator && 'btn--loading'}`} 
                            disabled={loadingIndicator}> {loadingIndicator 
                                                            ? 'Signing in' 
                                                            : ((passwordModal && passwordModal.register) 
                                                                ? "Register"
                                                                : "Login") }
                            {loadingIndicator 
                        && <span className="jumping-dots">
                          <span className="dot-1">.</span>
                          <span className="dot-2">.</span>
                          <span className="dot-3">.</span>
                        </span> }</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordModal)
