import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import * as Actions from '../../actions'
import Onboarding from './../onboarding';

import Welcome from './steps/Welcome'
import Terms from './steps/Terms'
import Type from './steps/Type'
import Register from './steps/Register'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
//import Step6 from './steps/Step6'

const mapStateToProps = state => ({
    passwordModal: state.realTime.passwordModal
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
            loadingIndicator: false
        }
    }

    componentDidMount() {
        this._keypressListener = event => {
            if(event.key === "Enter" && this.state.currentStep !== 4){
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
            if(nextState.currentStep > 5 && nextState.currentStep < 8)
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

    /**
     * [shownStep func. will redirect user to relevant Step]
     * @param  {Number}     id      [Id of the step]
     * @return {DOM}                [Step element]
     */
    shownStep(id) {
        const {passwordModal} = this.props
        let step;
        let key = Symbol(id).toString();
        switch (id) {
        case 1:
            step = <Welcome key={key}/>
            break;
        case 2:
            step = <Terms key={key}/>
            break;
        case 3:
            step = <Type key={key}/>
            break;
        case 4:
            step = <Register key={key} passwordModal={passwordModal}/>
            break;
        case 5:
            step = <Step2 setNodeName={::this._setNodeName} key={key}/>
            break;
        case 6:
            step = <Step3 key={key}/>
            break;
        case 7:
            step = <Step4 key={key}/>
            break;
        case 8:
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
        if(currentStep > 5){
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
        const {currentStep, nodeName} = this.state
        if (currentStep === 6) {
            const queuedTask = {
                action: "updateNodeName",
                arguments: [nodeName]
            }
            this.props.actions.addQueue(queuedTask)
        }
        if (currentStep < 8) {
            this.setState({
                currentStep: currentStep + 1,
                isNext: true
            })
        } else {
            const {actions} = this.props
            actions.setOnboard(true)
        }
    }

    _initControl(_step){
        const {passwordModal} = this.props
        const {loadingIndicator} = this.state
        if(_step === 1 || _step === 8){
            return <div>
                <button className="btn btn--primary" onClick={::this._handleNext}>Get Started</button>
            </div>
        }
        else if(_step === 2){
            return <div>
                <span className="btn--cancel" onClick={::this._handleNext}>Decline</span>
                <button className="btn btn--primary" onClick={::this._handleNext}>Accept</button>
            </div>
        }
        else if(_step === 3){
            return <div>
                <button className="btn btn--primary" onClick={::this._handleNext}>Got It</button>
            </div>
        }
        else if(_step === 4){
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
        else if(_step > 5){
            return <div>
                        <span className="icon-arrow-left-white" onClick={::this._handlePrev} aria-label="Prev" tabIndex="0"/>
                        <span>{_step - 4} of 4</span>
                        <span className="icon-arrow-right-white" onClick={::this._handleNext} aria-label="Next" tabIndex="0"/>
                   </div>
        } else {
            return <div>
                        <span>{_step - 4} of 4</span>
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
