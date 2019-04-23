import React from "react";

export default class InsufficientAmountModal extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.closeModal("insufficientAmountModal");

    _handleTopUp = () => window.routerHistory.push("/");

    _handleRetry = () => window.routerHistory.push("/tasks");

    render() {
        const { message } = this.props;
        return (
            <div className="container__modal container__task-error-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-warning" />
                    </div>
                    <span className="info">
                        You <strong>cannot</strong> send this task to the
                        network.
                    </span>
                    <pre className="message-from-server">{message}</pre>
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Cancel
                        </span>
                        {message.includes("Not enough") ? (
                            <button
                                type="button"
                                className="btn--primary"
                                onClick={this._handleTopUp}
                                autoFocus>
                                Top up
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn--primary"
                                onClick={this._handleRetry}
                                autoFocus>
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
