import React from "react";
import Lottie from "react-lottie";

import termsIcon from "./../../../assets/img/terms.svg";
import animData from "./../../../assets/anims/onboarding/terms.json";

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default class Terms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAcceptLocked: true
        };
    }

    _handleScroll = e => {
        if (e.target.scrollTop) {
            const _ratio = e.target.scrollTop / (e.target.scrollHeight - 220); // 220 is the offset
            document.getElementById("blurTop").style.opacity = _ratio;
            document.getElementById("blurBottom").style.opacity = 1 - _ratio;

            // scrollHeight - clientHeight = total length of scroll, equals to scrollTop when scroll is at bottom
            const isTermsLocked =
                e.target.scrollTop >
                e.target.scrollHeight - (e.target.clientHeight + 51);
            this.props.handleLock(!isTermsLocked);
        }
    };

    render() {
        const { isAcceptLocked } = this.state;
        const { terms, isSentryAccepted, isMonitorAccepted } = this.props;
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta terms-image">
                    <Lottie options={defaultOptions} />
                </div>
                <div className="desc__onboarding">
                    <div
                        className="container__terms"
                        onScroll={this._handleScroll}>
                        <div id="blurTop" className="blur blur--top" />
                        <div dangerouslySetInnerHTML={{ __html: terms }} />
                        <div id="blurBottom" className="blur blur--bottom" />
                    </div>
                    <span className="info__terms">
                        By clicking Accept, you confirm that you have read and
                        agree to the{" "}
                        <strong>user interaction guidelines</strong>,{" "}
                        <strong>disclaimer</strong> and{" "}
                        <a href="https://golem.network/privacy">
                            privacy policy
                        </a>
                        .
                    </span>
                    <div
                        className="radio-item"
                        onChange={this.props.handleSentryRadio}>
                        <input
                            id="optIn1"
                            type="checkbox"
                            name="optIn1"
                            checked={isSentryAccepted}
                            readOnly
                            required
                        />
                        <label htmlFor="optIn1" className="radio-label-left">
                            I want to help Golem by sending my logs.
                        </label>
                    </div>
                    <div
                        className="radio-item"
                        onChange={this.props.handleMonitorRadio}>
                        <input
                            id="optIn2"
                            type="checkbox"
                            name="optIn2"
                            checked={isMonitorAccepted}
                            readOnly
                            required
                        />
                        <label htmlFor="optIn2" className="radio-label-left">
                            I want to help Golem by sending my statistics.
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}
