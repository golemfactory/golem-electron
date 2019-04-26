import React from 'react';
import { Transition, animated } from 'react-spring/renderprops.cjs';

import Welcome from './steps/Welcome';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';

export default class ConcentOnboarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            isNext: true
        };

        this.enterStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate3d(100%,0,0)'
        };
        this.leaveStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate3d(-100%,0,0)'
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

    shownStep = [
        <Welcome key="welcome" />,
        <Step1 key="step1" />,
        <Step2 key="step2" />,
        <Step3 key="step3" />,
        <Step4 key="step4" />
    ];

    render() {
        const { currentStep, isNext } = this.state;
        return (
            <div className="concent-onboarding__content">
                <div className="concent-onboarding__steps">
                    <Transition
                        native
                        reset
                        unique
                        items={currentStep}
                        from={isNext ? this.enterStyle : this.leaveStyle}
                        enter={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transform: 'translate3d(0%,0,0)'
                        }}
                        leave={isNext ? this.leaveStyle : this.enterStyle}>
                        {index => style => (
                            <animated.div style={{ ...style }}>
                                {this.shownStep[index]}
                            </animated.div>
                        )}
                    </Transition>
                </div>
                <div className="concent-onboarding__action-container">
                    {currentStep === 0 || currentStep === 4 ? (
                        <div>
                            <span
                                className="btn--cancel"
                                onClick={
                                    currentStep === 4
                                        ? this._handlePrev
                                        : this._handleCancel
                                }>
                                {currentStep === 4 ? 'Back' : 'Skip'}
                            </span>
                            <button
                                className="btn btn--primary"
                                onClick={
                                    currentStep === 4
                                        ? this._handleDone
                                        : this._handleNext
                                }>
                                {currentStep === 4 ? 'Got it' : 'Learn more'}
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
                                {currentStep + 1} of 4
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
