import React from "react";
import { CSSTransitionGroup } from "react-transition-group";

import Welcome from "./steps/Welcome";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

const steps = Object.freeze({
    WELCOME: 1,
    STEP1: 2,
    STEP2: 3,
    STEP3: 4,
    STEP4: 5
});

export default class ConcentOnboarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            isNext: false
        };
    }

    _handleCancel = () => {
        this.props.handleOnboardingDone();
    };

    _handlePrev = () => {
        this.setState({
            currentStep: this.state.currentStep - 1,
            isNext: false
        });
    };

    _handleNext = () => {
        this.setState({
            currentStep: this.state.currentStep + 1,
            isNext: true
        });
    };

    _handleDone = () => {
        this.props.handleOnboardingDone();
    };

    shownStep = id => {
        switch (id) {
            case steps.WELCOME:
                return <Welcome key="welcome" />;
            case steps.STEP1:
                return <Step1 key="step1" />;
            case steps.STEP2:
                return <Step2 key="step2" />;
            case steps.STEP3:
                return <Step3 key="step3" />;
            case steps.STEP4:
                return <Step4 key="step4" />;
        }
    };

    render() {
        const { currentStep, isNext } = this.state;
        return (
            <div className="concent-onboarding__content">
                <div className="concent-onboarding__steps">
                    <CSSTransitionGroup
                        transitionName={`${
                            isNext ? "pageSwap" : "pageSwapBack"
                        }`}
                        transitionEnterTimeout={600}
                        transitionLeaveTimeout={600}>
                        {this.shownStep(currentStep)}
                    </CSSTransitionGroup>
                </div>
                <div className="concent-onboarding__action-container">
                    {currentStep === 1 || currentStep === 5 ? (
                        <div>
                            <span
                                className="btn--cancel"
                                onClick={
                                    currentStep === 5
                                        ? this._handlePrev
                                        : this._handleCancel
                                }>
                                {currentStep === 5 ? "Back" : "Skip"}
                            </span>
                            <button
                                className="btn btn--primary"
                                onClick={
                                    currentStep === 5
                                        ? this._handleDone
                                        : this._handleNext
                                }>
                                {currentStep === 5 ? "Got it" : "Learn more"}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <span
                                className="icon-arrow-left-small"
                                onClick={this._handlePrev}
                                aria-label="Prev"
                                tabIndex="0"
                            />
                            <span className="page-indicator">
                                {currentStep - 1} of 4
                            </span>
                            <span
                                className="icon-arrow-right-small"
                                onClick={this._handleNext}
                                aria-label="Next"
                                tabIndex="0"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
