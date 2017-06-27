import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
            currentStep: 1
        }
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
            step = <Step1/>
            break;
        case 2:
            step = <Step2/>
            break;
        case 3:
            step = <Step3/>
            break;
        case 4:
            step = <Step4/>
            break;
        case 5:
            step = <Step5/>
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
        const {currentStep} = this.state
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
                {::this.shownStep(currentStep)}
                <div className="step-control__onboarding">
                   <div>
                        {currentStep < 5 ? <span>{currentStep} of 5</span> : <span>Get Started</span>}
                        <span className="icon-arrow-right-white" onClick={::this._handleNext} aria-label="Next" tabIndex="0"/>
                   </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardIndex);
