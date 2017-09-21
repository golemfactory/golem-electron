import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import * as Actions from '../../actions'
import Onboarding from './../onboarding';

import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
//import Step6 from './steps/Step6'

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

class OnboardIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            nodeName: null
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
        let step
        switch (id) {
        case 1:
            step = <Step1 key={0}/>
            break;
        case 2:
            step = <Step2 setNodeName={::this._setNodeName}key={1}/>
            break;
        case 3:
            step = <Step3 key={2}/>
            break;
        case 4:
            step = <Step4 key={3}/>
            break;
        case 5:
            step = <Step5 key={4}/>
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
        currentStep > 1 && this.setState({
            currentStep: currentStep - 1
        })
    }

    /**
     * [_handleNext will redirect user to next step]
     */
    _handleNext() {
        const {currentStep, nodeName} = this.state
        if (currentStep === 2) {
            this.props.actions.updateNodeName(nodeName)
        }
        if (currentStep < 5) {
            this.setState({
                currentStep: currentStep + 1
            })
        } else {
            const {actions} = this.props
            actions.setOnboard(false)
        }
    }


    render() {
        const {currentStep} = this.state;
        return (
            <div className="content__onboarding">
                <CSSTransitionGroup
                  transitionName="pageSwap"
                  transitionEnterTimeout={600}
                  transitionLeaveTimeout={600}>
                    {::this.shownStep(currentStep)}
                </CSSTransitionGroup>
                <div className="step-control__onboarding">
                {currentStep < 5 ?
                   <div>
                        <span>{currentStep} of 5</span>
                        <span className="icon-arrow-right-white" onClick={::this._handleNext} aria-label="Next" tabIndex="0"/>
                   </div>
                   :
                   <div>
                       <button className="btn btn--outline" onClick={::this._handleNext}>Get Started</button>
                   </div>
               }
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardIndex);
