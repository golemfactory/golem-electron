import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import Handlebars from 'handlebars';
import qrcode from 'qrcode-generator';
import html2pdf from 'html2pdf.js';

import * as Actions from '../../actions'
import {getPasswordModalStatus} from '../../reducers'
import Onboarding from './../onboarding';

import Welcome from './steps/Welcome'
import ChainInfo from './steps/ChainInfo'
import Terms from './steps/Terms'
import Type from './steps/Type'
import Register from './steps/Register'
import Print from './steps/Print'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Decline from './steps/Decline'
//import Step6 from './steps/Step6'

import golem_logo from './../../assets/img/golem-black.svg'

const {remote} = window.electron;
const {app} = remote


const steps = Object.freeze({
    WELCOME: 1,
    CHAININFO: 2,
    TERMS: 3,
    TYPE: 4,
    REGISTER: 5,
    PRINT: 6,
    STEP1: 7,
    STEP2: 8,
    STEP3: 9,
    STEP4: 10
})

function printPage(template) {
    var iframe = document.createElement("iframe"); // create the element
    document.body.appendChild(iframe);  // insert the element to the DOM 
    iframe.contentWindow.document.write(template); // write the HTML to be printed
    setTimeout(() => {
        iframe.contentWindow.print(); // print it
        document.body.removeChild(iframe); // remove the iframe from the DOM
    }, 1000);
};

const someAsyncFunction = function(callback) {
  setTimeout(function() {
    var template = `<div class="password__template">
                        <img src="${golem_logo}" class="logo"/>
                        <br/>
                        <span>Thank you for installing Golem.</span>
                        <br/>
                            <span>If you have any questions please contact us on our <a href="https://chat.golem.network">https://chat.golem.network</a></span>
                            <div class="pass__container">
                            <div>
                                <span>Your password:</span>
                                <br/>
                                <span><b>{{message}}</b></span>
                            </div>
                            <div class='title'>{{{qrcode message}}}</div>
                        </div>
                        <span><b>Security guidelines!</b></span>
                        <br/>
                        <span>After printing your password, <b>delete this PDF</b> and <b>temporary files from your machine</b>.
                        <br/>
                        You can also <b>encrypt PDF file with password</b> and <b>store it in secure place</b>,
                        <br/>
                        like USB drive.</span>
                        <style>
                            .logo{
                                margin-top: 30px;
                                margin-left: -10px;
                                margin-bottom: 90px;
                                width: 120px;
                            }
                            .password__template{
                                margin: 10px 45px;
                                font-size: 12pt;
                                line-height: 1.6;
                            }
                            .pass__container{
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                margin: 90px 0 20px 0;
                            }
                        </style>
                    </div>`;

    callback(template);
  }, 1000);
};

const mapStateToProps = state => ({
    isConnected: state.info.isConnected,
    passwordModal: getPasswordModalStatus(state, 'passwordModal'),
    isTermsAccepted: state.info.isTermsAccepted,
    terms: state.info.terms,
    isMainNet: state.info.isMainNet,
    connectionProblem: state.info.connectionProblem
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

class OnboardIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            nodeName: null,
            isNext: true,
            password: "",
            isPasswordValid: false,
            loadingIndicator: false,
            isRegisterRequired: false,
            isAcceptLocked: true,
            isTermsDeclined: false,
            isSentryAccepted: false,
            isMonitorAccepted: true,
            isPrinted: false,
            isSkippingPrint: false,
            printInfo: "",
            closeInformationBand: false
        }
    }

    componentDidMount() {
        this._keypressListener = event => {

            if(event.key === "Enter" && 
                this.state.currentStep !== steps.REGISTER &&
                this.state.currentStep !== steps.TERMS &&
                this.state.currentStep !== steps.STEP1 &&
                this.props.isConnected){
                this._handleNext.call(this)
            }
        }
        document.addEventListener("keypress", this._keypressListener);
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this._keypressListener);
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.currentStep !== this.state.currentStep){
            if(nextState.currentStep > steps.STEP1 && nextState.currentStep < steps.STEP4)
                this.refs.stepControl.classList.add('back-active')
            else
                this.refs.stepControl.classList.remove('back-active')
        }
    }

    _setNodeName(name) {
        this.setState({
            nodeName: name
        })
    }

    _handleLock(_lock){
        if(this.state.isAcceptLocked !== _lock)
            this.setState({
                isAcceptLocked: _lock
            })
    }

    _handleDecline(){
        this.setState({
            isTermsDeclined: true
        })
    }

    _handleSentryRadio(e){
        this.setState({
            isSentryAccepted: !this.state.isSentryAccepted
        })
    }

    _handleMonitorRadio(){
        this.setState({
            isMonitorAccepted: !this.state.isMonitorAccepted
        })
    }

    _handlePasswordValidation(_result){
        if(this.state.isPasswordValid !== _result)
            this.setState({
                isPasswordValid: _result
            })
    }

    _printInfo(_info){
        this.setState({
            printInfo: _info
        })
    }

    /**
     * [shownStep func. will redirect user to relevant Step]
     * @param  {Number}     id      [Id of the step]
     * @return {DOM}                [Step element]
     */
    shownStep(id) {
        const {terms, passwordModal, isMainNet, actions} = this.props
        const { 
            isTermsDeclined,
            isMonitorAccepted,
            isSentryAccepted,
            isPrinted,
            isSkippingPrint,
            nodeName,
            loadingIndicator,
            isPasswordValid
        } = this.state

        let step;
        let key = Symbol(id).toString();
        switch (id) {
        case steps.WELCOME:
            step = <Welcome key={key}/>
            break;
        case steps.CHAININFO:
            step = <ChainInfo isMainNet={isMainNet}/>
            break;
        case steps.TERMS:
            step = isTermsDeclined ? <Decline/> : <Terms 
                                                    key={key} 
                                                    terms={terms} 
                                                    handleLock={::this._handleLock} 
                                                    isMonitorAccepted={isMonitorAccepted} 
                                                    isSentryAccepted={isSentryAccepted}
                                                    handleMonitorRadio={::this._handleMonitorRadio}
                                                    handleSentryRadio={::this._handleSentryRadio}/> 
            break;
        case steps.TYPE:
            step = <Type key={key}/>
            break;
        case steps.REGISTER:
            step = <Register 
                        key={key} 
                        passwordModal={passwordModal}
                        isPasswordValid={isPasswordValid}
                        loadingIndicator={loadingIndicator}
                        handlePasswordValidation={::this._handlePasswordValidation} 
                        handleLoading={::this._handleLoadingIndicator}
                        printInfo={::this._printInfo}/>
            break;
        case steps.PRINT:
            step = <Print 
                    isPrinted={isPrinted} 
                    isSkippingPrint={isSkippingPrint}/>
            break;
        case steps.STEP1:
            step = <Step2 
                    ref={(ref) => this.step2 = ref}
                    nodeName={nodeName}
                    setNodeName={::this._setNodeName} 
                    key={key} 
                    handleNext={::this._handleNext}/>
            break;
        case steps.STEP2:
            step = <Step3 key={key}/>
            break;
        case steps.STEP3:
            step = <Step4 key={key}/>
            break;
        case steps.STEP4:
            step = <Step5 key={key}/>
            break;
        // case 6:
        //     step = <Step6/>
        //     break;
        }

        return step
    }

    /**
     * [_handlePrev func. will redirect user to previous step]
     */
    _handlePrev() {
        const {currentStep} = this.state
        if(currentStep > steps.STEP1){
            this.setState({
                currentStep: currentStep - 1,
                isNext: false
            })
        }
    }

    /**
     * [_handleNext will redirect user to next step]
     */
    _handleNext() {
        const { actions, passwordModal, isTermsAccepted } = this.props
        const { currentStep, nodeName, isRegisterRequired } = this.state 
        if (currentStep === steps.STEP2) {
            const queuedTask = {
                action: "updateNodeName",
                arguments: [nodeName]
            }
            actions.addQueue(queuedTask)
        }

        if (currentStep < steps.STEP4) {
            let nextStep = currentStep + 1;

            if(nextStep === steps.REGISTER){
                this.setState({
                    isRegisterRequired: passwordModal.register
                })
            }

            if((!isRegisterRequired && 
                            nextStep === steps.PRINT) ||
                (isTermsAccepted && 
                            nextStep === steps.TERMS)){
                nextStep++;
            }
            this.setState({
                currentStep: nextStep,
                isNext: true
            })
        } else {
            const {actions} = this.props
            actions.setOnboard(true)
        }

        if(currentStep === steps.WELCOME){
            actions.checkTermsAccepted()
        }
    }

    _handleTermsBack(){
        this.setState({
            isTermsDeclined: false
        })
    }

    _handleTermsAccept(){
        this.termsPromise().then(() => {
            this._handleNext()
        })
    }

    termsPromise(){
        const {isMonitorAccepted, isSentryAccepted} = this.state;
        return new Promise((resolve, reject) => {
            this.props.actions.acceptTerms(
                                isMonitorAccepted, 
                                isSentryAccepted, 
                                resolve, 
                                reject)
        });
    }

    _handleLeave(){
        //TO DO close app
        app.quit()
    }

    _closeInfo(){
        this.setState({
            closeInformationBand: true
        })
    }

    _handlePrint(){
        //TO DO print pdf
        someAsyncFunction((template) => {

            Handlebars.registerHelper("qrcode", (data) => {
                var typeNumber = 4;
                var errorCorrectionLevel = 'L';
                var qr = qrcode(typeNumber, errorCorrectionLevel);
                qr.addData(data);
                qr.make();
                return qr.createSvgTag(4, 0);
            });

            var compiledTemplate = Handlebars.compile(template);
            var temp = compiledTemplate({
                message: this.state.printInfo
            });
            html2pdf(temp, {
                margin:       0,
                filename:     'password.pdf',
                image:        { type: 'jpeg', quality: 1 },
                html2canvas:  { dpi: 192, letterRendering: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            });

            printPage(temp);

            this.setState({
                printInfo: ""
            })
        });

        this.setState({
            isPrinted: true
        })
    }

    _handleNextPrint(){
        if(!this.state.isPrinted && !this.state.isSkippingPrint){
            this.setState({
                isSkippingPrint: true
            })
        } else {
           this._handleNext()
        }
    }

    _handleLoadingIndicator(_isLoading){
        if(this.state.loadingIndicator !== _isLoading)
            this.setState({
                loadingIndicator: _isLoading
            })
    }

    _isInfoBandShown(_connectionProblem, _closeInformationBand){
        if(_connectionProblem && 
                (_connectionProblem.issue === "PORT" ||
                 _connectionProblem.issue === "WEBSOCKET") && 
                !_closeInformationBand)
            return <div className={`information-band__onboarding show`}>
                        <div className="content-information">
                            <span className="icon-warning"/>
                            {_connectionProblem.issue === "PORT" ? 
                                <span>It looks like you don't have ports forwarded. Follow <a href="https://golem.network/documentation/09-common-issues-troubleshooting/port-forwarding-connection-errors/#getting-started">these steps.</a></span>
                                :
                                <span>Interface communication problem with Golem. Please restart.</span>
                            }
                        </div>
                        <span className="icon-close" onClick={::this._closeInfo}/>
                    </div>
    }

    _initControl(_step){
        const {passwordModal, isConnected} = this.props
        const {loadingIndicator, isAcceptLocked, isTermsDeclined, isPrinted, isPasswordValid} = this.state
        if(_step === steps.WELCOME || _step === steps.STEP4){
            return <div>
                <button className="btn btn--primary" 
                        onClick={::this._handleNext} 
                        disabled={!isConnected}>
                            {isConnected ? "Get Started" : "Connecting..."}
                </button>
            </div>
        }
        else if(_step === steps.TERMS){
            if(isTermsDeclined){
                return <div>
                    <span className="btn--cancel" onClick={::this._handleTermsBack}>Go Back</span>
                    <button className="btn btn--primary" 
                            onClick={::this._handleLeave}>
                                See you soon
                    </button>
                </div>
            }
            return <div>
                    <span className="btn--cancel" onClick={::this._handleDecline}>Decline</span>
                    <button className="btn btn--primary" 
                            onClick={::this._handleTermsAccept} 
                            disabled={isAcceptLocked}>
                                Accept
                    </button>
                </div>
        }
        else if(_step === steps.CHAININFO || _step === steps.TYPE){
            return <div>
                <button className="btn btn--primary" onClick={::this._handleNext}>Got It</button>
            </div>
        }
        else if(_step === steps.REGISTER){
            return <div>
                {(passwordModal && passwordModal.status) ? 
                <button type="submit" 
                        form="passwordForm" 
                        className={`btn btn--primary ${loadingIndicator && 'btn--loading'}`} 
                        disabled={loadingIndicator || (passwordModal.register && !isPasswordValid)}> 
                            {loadingIndicator ? 'Signing in' : (passwordModal.register ? "Register": "Login")}
                            {loadingIndicator && <span className="jumping-dots">
                                                  <span className="dot-1">.</span>
                                                  <span className="dot-2">.</span>
                                                  <span className="dot-3">.</span>
                                                </span> }
                </button>
                :
                <button className="btn btn--primary" 
                        onClick={::this._handleNext}>
                            Take me in!
                </button>
            }

            </div>
        }
        else if(_step === steps.PRINT){
            return <div>
                    <button className="btn btn--outline btn--print" 
                            onClick={::this._handlePrint} 
                            >{ !isPrinted ? "Print" : "Print again"}
                    </button>
                    <br/>
                    <br/>
                    <button className="btn btn--primary btn--print" 
                            onClick={::this._handleNextPrint}>
                                Next
                    </button>
                </div>
        } else if(_step > steps.STEP1){
            return <div>
                        <span 
                            className="icon-arrow-left-small" 
                            onClick={::this._handlePrev} 
                            aria-label="Prev" 
                            tabIndex="0"/>
                        <span>{_step - 6} of 4</span>
                        <span
                            className="icon-arrow-right-small" 
                            onClick={::this._handleNext} 
                            aria-label="Next" 
                            tabIndex="0"/>
                   </div>
        } else {
            return <div>
                        <span>{_step - 6} of 4</span>
                        <span
                            className="icon-arrow-right-small"
                            aria-label="Next"
                            onClick={e => {
                                this.step2.activityFormButton.click()
                            }}
                            tabIndex="0"/>
                   </div>
        }

    }


    render() {
        const {currentStep, isNext, closeInformationBand} = this.state;
        const {connectionProblem} = this.props
        return (
            <div className="content__onboarding">
                <CSSTransitionGroup
                  transitionName={`${isNext ? "pageSwap" : "pageSwapBack"}`}
                  transitionEnterTimeout={600}
                  transitionLeaveTimeout={600}>
                    {::this.shownStep(currentStep)}
                </CSSTransitionGroup>
                <div ref="stepControl" className="step-control__onboarding">
                    {::this._initControl(currentStep)}
                </div>
                {this._isInfoBandShown(connectionProblem, closeInformationBand)}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardIndex);
