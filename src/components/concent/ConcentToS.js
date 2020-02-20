import React from "react";

export default class ConcentToS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAcceptLocked: true
        };
    }

    _handleLock = _lock => {
        if (this.state.isAcceptLocked !== _lock)
            this.setState({
                isAcceptLocked: _lock
            });
    };

    _handleScroll = e => {
        if (e.target.scrollTop) {
            const _ratio = e.target.scrollTop / (e.target.scrollHeight - 380); // 380 is the offset
            document.getElementById("blurTop").style.opacity = _ratio;
            document.getElementById("blurBottom").style.opacity = 1 - _ratio;

            if (e.target.scrollTop > e.target.scrollHeight - (e.target.scrollTop / 10)) {
                this._handleLock(false);
            } else {
                this._handleLock(true);
            }
        }
    };

    _handleCancel = () => {
        this.props.actions.toggleConcent(false, true);
    };

    _handleApply = () => {
        this._acceptConcentTermsAsync()
            .then(() => this.props.actions.toggleConcent(true, true))
            .catch(err =>
                console.error("Couldn't accept the terms, reason:", err)
            );
    };

    _acceptConcentTermsAsync = () => {
        return new Promise((resolve, reject) => {
            this.props.actions.acceptConcentTerms(resolve, reject);
        });
    };

    render() {
        const { isAcceptLocked } = this.state;
        const { concentTerms } = this.props;
        return (
            <div className="container__concent-tos">
                <div className="desc__concent-tos">
                    <div
                        className="container__concent-tos"
                        onScroll={this._handleScroll}>
                        <div id="blurTop" className="blur blur--top" />
                        <div
                            dangerouslySetInnerHTML={{ __html: concentTerms }}
                        />
                        <div id="blurBottom" className="blur blur--bottom" />
                    </div>
                    <span className="info__concent-tos">
                        By clicking Accept, you confirm that you have read and
                        agree to the{" "}
                        <strong>user interaction guidelines</strong>,{" "}
                        <strong>disclaimer</strong> and{" "}
                        <a href="https://golem.network/privacy">
                            privacy policy
                        </a>
                        .
                    </span>
                    <div className="action-container__concent-tos">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Cancel
                        </span>
                        <button
                            className="btn btn--primary"
                            onClick={this._handleApply}
                            disabled={isAcceptLocked}>
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
