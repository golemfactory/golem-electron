import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import * as Actions from '../../actions'
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

const mapStateToProps = state => ({
    passwordModal: state.realTime.passwordModal,
    isTermsAccepted: state.info.isTermsAccepted
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
            loadingIndicator: false,
            isAcceptLocked: true,
            isTermsDeclined: false,
            isPrinted: false,
            isSkippingPrint: false
        }
    }

    componentDidMount() {
        this._keypressListener = event => {
            if(event.key === "Enter" && this.state.currentStep !== steps.REGISTER){
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

    /**
     * [shownStep func. will redirect user to relevant Step]
     * @param  {Number}     id      [Id of the step]
     * @return {DOM}                [Step element]
     */
    shownStep(id) {
        const {passwordModal, actions} = this.props
        const { isTermsDeclined, isPrinted, isSkippingPrint } = this.state
        let step;
        let key = Symbol(id).toString();
        switch (id) {
        case steps.WELCOME:
            step = <Welcome key={key}/>
            break;
        case steps.CHAININFO:
            step = <ChainInfo/>
            break;
        case steps.TERMS:
            step = isTermsDeclined ? <Decline/> : <Terms key={key} handleLock={::this._handleLock}/> 
            break;
        case steps.TYPE:
            step = <Type key={key}/>
            break;
        case steps.REGISTER:
            step = <Register key={key} passwordModal={passwordModal} handleLoading={::this._handleLoadingIndicator}/>
            break;
        case steps.PRINT:
            step = <Print isPrinted={isPrinted} isSkippingPrint={isSkippingPrint}/>
            break;
        case steps.STEP1:
            step = <Step2 setNodeName={::this._setNodeName} key={key}/>
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
        const {currentStep, nodeName} = this.state 
        if (currentStep === steps.STEP2) {
            const queuedTask = {
                action: "updateNodeName",
                arguments: [nodeName]
            }
            actions.addQueue(queuedTask)
        }
        if (currentStep < steps.STEP4) {
            let nextStep = currentStep + 1;
            if((!passwordModal.register && 
                            currentStep === steps.REGISTER) ||
                (isTermsAccepted && 
                            currentStep === steps.CHAININFO)){
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
        return new Promise((resolve, reject) => {
            this.props.actions.acceptTerms(resolve, reject)
        });
    }

    _handleLeave(){
        //TO DO close app
    }

    _handlePrint(){
        //TO DO print pdf
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

    _initControl(_step){
        const {passwordModal} = this.props
        const {loadingIndicator, isAcceptLocked, isTermsDeclined, isPrinted} = this.state
        if(_step === steps.WELCOME || _step === steps.STEP4){
            return <div>
                <button className="btn btn--primary" onClick={::this._handleNext}>Get Started</button>
            </div>
        }
        else if(_step === steps.TERMS){
            if(isTermsDeclined){
                return <div>
                    <span className="btn--cancel" onClick={::this._handleTermsBack}>Go Back</span>
                    <button className="btn btn--primary" onClick={::this._handleLeave}>See you soon</button>
                </div>
            }
            return <div>
                    <span className="btn--cancel" onClick={::this._handleDecline}>Decline</span>
                    <button className="btn btn--primary" onClick={::this._handleTermsAccept} disabled={isAcceptLocked}>Accept</button>
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
                <button type="submit" form="passwordForm" className={`btn btn--primary ${loadingIndicator && 'btn--loading'}`} disabled={loadingIndicator}> {loadingIndicator ? 'Signing in' : (passwordModal.register ? "Register": "Login")}{loadingIndicator && <span className="jumping-dots">
                  <span className="dot-1">.</span>
                  <span className="dot-2">.</span>
                  <span className="dot-3">.</span>
                </span> }</button>
                :
                <button className="btn btn--primary" onClick={::this._handleNext}>Take me in!</button>
            }

            </div>
        }
        else if(_step === steps.PRINT){
            return <div>
                    <button className="btn btn--outline btn--print" onClick={::this._handlePrint}>{ !isPrinted ? "Print" : "Print again"}</button>
                    <br/>
                    <br/>
                    <button className="btn btn--primary btn--print" onClick={::this._handleNextPrint}>Next</button>
                </div>
        }
        else if(_step > steps.STEP1){
            return <div>
                        <span className="icon-arrow-left-white" onClick={::this._handlePrev} aria-label="Prev" tabIndex="0"/>
                        <span>{_step - 6} of 4</span>
                        <span className="icon-arrow-right-white" onClick={::this._handleNext} aria-label="Next" tabIndex="0"/>
                   </div>
        } else {
            return <div>
                        <span>{_step - 6} of 4</span>
                        <span className="icon-arrow-right-white" onClick={::this._handleNext} aria-label="Next" tabIndex="0"/>
                   </div>
        }

    }


    render() {
        const {currentStep, isNext} = this.state;
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
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardIndex);
