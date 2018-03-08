import React from 'react';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPasswordStrength from 'react-password-strength';

import * as Actions from '../../../actions'

import welcomeBeta from './../../../assets/img/welcome-beta.svg'


const mapStateToProps = state => ({
    passwordModal: state.realTime.passwordModal
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: "",
            loadingIndicator: false
        }
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.passwordModal.error){
            const modal = document.getElementById("passwordInput")
            modal.classList.add("modal-error")
            setTimeout(() => {
                modal.classList.remove("modal-error")
            }, 1000)
            if(this.refs.password)
                this.refs.password.value = "";
            this.setState({
                loadingIndicator: false,
                passowrd: ""
            })
        }
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

    _initProperContent(_passwordModal){
        if(_passwordModal.status){
            return <div>
                    {(_passwordModal.register) ?
                        <span>
                            <strong>It is critical to know that</strong>
                            <br/>
                            the password <strong>can not</strong> be recovered.
                            <br/>
                            <u>Write it down in a safe and secure place!</u>
                        </span>
                     :
                        <span>Appearently, you already registered your password
                        <br/>
                        please log in to unlock the application!</span>
                    }
                        <br/>
                        <br/>
                    <form id="passwordForm" onSubmit={::this._setPassword}>
                     {(_passwordModal.register) ?
                        [<div key="1" className="container__field">
                            <label>Password</label>
                            <ReactPasswordStrength
                              className="passwordField"
                              minLength={5}
                              minScore={2}
                              scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                              changeCallback={::this.foo}
                              inputProps={{ name: "password_input", autoComplete: "off", className: "form-control", onKeyPress: this._preventSpace}}
                            />
                        </div>,
                        <div key="2" className="container__field">
                            <label>Confirm Password</label>
                            <input type="password" onChange={::this._confirmPassword} onKeyPress={::this._preventSpace}/>
                        </div>] : 
                        <div id="passwordInput" className="container__field">
                            <label>Password</label>
                            <input ref="password" type="password" onChange={::this._handlePassword} onKeyPress={::this._preventSpace}/>
                        </div>
                        }
                    </form>
                </div>
        } else {
            return <div>
                        <span>
                            Seems like you already unlock the application.
                            <br/>
                            Enjoy the all unique features!
                        </span>
                    </div>
        }
    }

    render() {
        const {passwordModal} = this.props
        const {loadingIndicator} = this.state
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={welcomeBeta}/>
                </div>
                <div className="desc__onboarding">
                    {passwordModal && ::this._initProperContent(passwordModal)}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
