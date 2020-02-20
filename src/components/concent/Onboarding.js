import React from 'react';
import { Transition, animated } from 'react-spring/renderprops.cjs';

import Welcome from './steps/Welcome';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';

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

    componentDidMount() {
        this._keydownListener = event => {
            //Right Arrow & Enter keycode
            if (event.keyCode === 39 || event.keyCode === 13) {
                this.state.currentStep === 5
                    ? this._handleDone.call(this)
                    : this._handleNext.call(this);
            }

            //Left Arrow & ESC keycode
            if (event.keyCode === 37 || event.keyCode === 27) {
                this.state.currentStep !== 0
                    ? this._handlePrev.call(this)
                    : this._handleCancel.call(this);
            }
        };
        document.addEventListener('keydown', this._keydownListener);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this._keydownListener);
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
        <Step4 key="step4" />,
        <Step5 key="step5" />
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
                    {currentStep === 0 || currentStep === 5 ? (
                        <div>
                            <span
                                className="btn--cancel"
                                onClick={
                                    currentStep === 5
                                        ? this._handlePrev
                                        : this._handleCancel
                                }>
                                {currentStep === 5 ? 'Back' : 'Skip'}
                            </span>
                            <button
                                className="btn btn--primary"
                                onClick={
                                    currentStep === 5
                                        ? this._handleDone
                                        : this._handleNext
                                }>
                                {currentStep === 5 ? 'Got it' : 'Learn more'}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <span
                                className="icon-arrow-left"
                                onClick={this._handlePrev}
                                aria-label="Prev"
                                tabIndex="0"
                            />
                            <span className="page-indicator">
                                {currentStep + 1} of 6
                            </span>
                            <span
                                className="icon-arrow-right"
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
