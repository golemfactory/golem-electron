import React from 'react';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPasswordStrength from 'react-password-strength';

import * as Actions from '../../actions'


const mapStateToProps = state => ({
    passwordModal: state.realTime.passwordModal
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class PasswordModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            password: ""
        }
        this._handleCancel = ::this._handleCancel
    }

    clickOutside(parent, event) {
            var isClickInside = (parent.contains(event.target) && !parent.isEqualNode(event.target));
            // console.log(parent, event.target, parent.contains(event.target), !parent.isEqualNode(event.target))
            if (!isClickInside) {
                //the click was outside the parent, do something
                if(connectionProblem.issue === knownIssues.PORT)
                    this.props.actions.skipPortError()
                else
                    this.props.actions.setUpdateSeen()
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

    _handleCancel() {
        this.props.closeModal()
    }

    foo(e){
        console.log("Password Callback", e)
        this.setState({
            password: e.password
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

    render() {
        const {passwordModal} = this.props
        return (
            <div ref="modalContent" className="container__modal container__password-modal">
                <div className="content__modal">
                    <div className="container-icon">
                        <span className="icon-lock"/>
                    </div>
                    <form>
                        <div className="container__field">
                            <label>Password</label>
                            <ReactPasswordStrength
                              className="passwordField"
                              minLength={5}
                              minScore={2}
                              scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                              changeCallback={::this.foo}
                              inputProps={{ name: "password_input", autoComplete: "off", className: "form-control" }}
                            />
                        </div>
                        {(passwordModal && passwordModal.register) &&
                            <div className="container__field">
                                <label>Confirm Password</label>
                                <input type="text" placeholder="Re-enter your password" onChange={::this._confirmPassword}/>
                            </div>
                        }
                        <button type="submit" className="btn--outline">{(passwordModal && passwordModal.register) ? "Register": "Login"}</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordModal)
