import React from "react";
import { hashHistory } from "react-router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactPasswordStrength from "react-password-strength";
import Lottie from "react-lottie";

import * as Actions from "../../../actions";

import lockedIcon from "./../../../assets/img/locked.svg";
import unlockedIcon from "./../../../assets/img/unlocked.svg";

import animDataLocked from "./../../../assets/anims/onboarding/password.json";
import animDataGenerating from "./../../../assets/anims/onboarding/generating-keys.json";
import animDataUnlocked from "./../../../assets/anims/onboarding/unlocked-app.json";

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: null,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            passwordMaskToggle: false,
            confirmationMaskToggle: false
        };
        this.asyncLoad = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.passwordModal.error && nextProps.loadingIndicator) {
            const container = document.getElementById("passwordContainer");
            container.classList.add("modal-error");
            this.refs.password.classList.add("invalid");
            this.refs.errorInfo.textContent = "wrong password";
            setTimeout(() => {
                container.classList.remove("modal-error");
            }, 1000);
            if (this.refs.password) this.refs.password.value = "";
            this.props.handleLoading(false);
        }
    }

    _handleChange = e => {
        this.setState({
            password: e.password
        });
        this.props.handlePasswordValidation(e.isValid);
    };

    _handlePassword = e => this.setState({ password: e.target.value });

    _confirmPassword = e => {
        const _password = e.target.value;
        if (_password === this.state.password) {
            e.target.classList.add("password_confirmed");
            e.target.classList.remove("password_not_confirmed");
        } else {
            e.target.classList.add("password_not_confirmed");
            e.target.classList.remove("password_confirmed");
        }
    };

    _setPassword = () => {
        const { handleLoading, passwordModal, printInfo, actions } = this.props;
        actions.setPassword(this.state.password);

        if (passwordModal && passwordModal.register)
            printInfo(this.state.password);

        handleLoading(true);
    };

    _togglePasswordMask(_key) {
        this.setState({
            [_key]: !this.state[_key]
        });
    }

    _preventSpace = event => {
        var key = event.which || window.event.which;
        if (key === 32) {
            event.preventDefault();
        }
    };

    _focustToInput() {
        if (!this.asyncLoad) {
            setTimeout(() => {
                const registerInput = document.getElementById("register");
                const passwordInput = this.refs.password;
                const focusedInput = registerInput || passwordInput;
                focusedInput.focus();
                this.asyncLoad = true;
            }, 600);
        }
        return null;
    }

    _initProperContent = (_passwordModal, _loadingIndicator) => {
        const { isPasswordValid } = this.props;
        if (_passwordModal.status) {
            return (
                <div className="container__register">
                    <div className="info__register">
                        {_passwordModal.register ? (
                            _loadingIndicator ? (
                                <span>
                                    <h1>Generating keys...</h1>
                                    Key generation may take some time depending
                                    on
                                    <br />
                                    the power of your machine. Even up to 20
                                    minutes...
                                    <br />
                                    <br />
                                    Your identicon avatar based on ethereum
                                    address is
                                    <br />
                                    being generated. It is a security icon, to
                                    allow you to
                                    <br />
                                    easily check if an address you want to
                                    interact with is
                                    <br />
                                    being the right one.
                                </span>
                            ) : (
                                <span>
                                    We don't keep a copy of your password.
                                    <br />
                                    After password creation remember to write it
                                    down
                                    <br />
                                    or print it, as there is no password
                                    recovery option.
                                    <br />
                                    <a href="https://docs.golem.network/#/Products/Brass-Beta/Usage?id=backing-up-your-golem-wallet">
                                        Learn more
                                    </a>
                                </span>
                            )
                        ) : (
                            <span>
                                Appearently, you already registered.
                                <br />
                                Please <strong>login</strong> to unlock the
                                application!
                            </span>
                        )}
                    </div>
                    <form id="passwordForm" onSubmit={this._setPassword}>
                        {_passwordModal.register ? (
                            _loadingIndicator ? (
                                <div />
                            ) : (
                                [
                                    <div key="1" className="container__field">
                                        <label>Password</label>
                                        <ReactPasswordStrength
                                            className="passwordField"
                                            minLength={5}
                                            minScore={2}
                                            scoreWords={[
                                                "too weak",
                                                "weak",
                                                "good",
                                                "strong",
                                                "you should feel safe"
                                            ]}
                                            changeCallback={this._handleChange}
                                            inputProps={{
                                                id: "register",
                                                type: `${
                                                    this.state
                                                        .passwordMaskToggle
                                                        ? "text"
                                                        : "password"
                                                }`,
                                                name: "password_input",
                                                autoComplete: "off",
                                                className: "form-control",
                                                onKeyPress: this._preventSpace,
                                                required: true,
                                                disabled: _loadingIndicator
                                            }}/>
                                        <span
                                            ref="passwordMaskToggle"
                                            className={`icon-eye ${
                                                this.state.passwordMaskToggle
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={this._togglePasswordMask.bind(
                                                this,
                                                "passwordMaskToggle"
                                            )}/>
                                    </div>,
                                    <div key="2" className="container__field">
                                        <label>Confirm Password</label>
                                        <input
                                            type={`${
                                                this.state
                                                    .confirmationMaskToggle
                                                    ? "text"
                                                    : "password"
                                            }`}
                                            onChange={this._confirmPassword}
                                            onKeyPress={this._preventSpace}
                                            required
                                            disabled={
                                                _loadingIndicator ||
                                                !isPasswordValid
                                            }/>
                                        <span
                                            ref="passwordMaskToggle"
                                            className={`icon-eye ${
                                                this.state
                                                    .confirmationMaskToggle
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={this._togglePasswordMask.bind(
                                                this,
                                                "confirmationMaskToggle"
                                            )}/>
                                    </div>
                                ]
                            )
                        ) : (
                            <div
                                id="passwordContainer"
                                className="container__field">
                                <label>Password</label>
                                <input
                                    ref="password"
                                    type={`${
                                        this.state.passwordMaskToggle
                                            ? "text"
                                            : "password"
                                    }`}
                                    onChange={this._handlePassword}
                                    onKeyPress={this._preventSpace}
                                    required
                                    disabled={_loadingIndicator}/>
                                <span
                                    ref="passwordMaskToggle"
                                    className={`icon-eye ${
                                        this.state.passwordMaskToggle
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={this._togglePasswordMask.bind(
                                        this,
                                        "passwordMaskToggle"
                                    )}/>
                                <span ref="errorInfo" className="error-info" />
                            </div>
                        )}
                        {this._focustToInput()}
                    </form>
                </div>
            );
        } else {
            return (
                <div>
                    <span>
                        Seems like you already unlocked the application.
                        <br />
                        Enjoy all the unique features!
                    </span>
                </div>
            );
        }
    };

    render() {
        const { passwordModal, loadingIndicator } = this.props;
        console.log("passwordModal", passwordModal);
        defaultOptions.animationData = passwordModal.status
            ? loadingIndicator
                ? animDataGenerating
                : animDataLocked
            : animDataUnlocked;
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                    <Lottie options={defaultOptions} />
                </div>
                <div className="desc__onboarding">
                    {passwordModal &&
                        this._initProperContent(
                            passwordModal,
                            loadingIndicator
                        )}
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);
