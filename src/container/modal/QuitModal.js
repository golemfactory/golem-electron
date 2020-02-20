import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../assets/anims/are-you-sure';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class QuitModal extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel func. closes modal]
     */
    _handleCancel = () => {
        this.props.closeModal();
    };

    /**
     * [_handleForceQuit func. triggers forced shutdown]
     */
    _handleForceQuit = () => {
        this.props.forceQuit();
    };

    /**
     * [_handleGracefulQuit func. triggers graceful shutdown]
     */
    _handleGracefulShutdown = () => {
        this.props.gracefulShutdown();
        this.props.closeModal();
    };

    render() {
        const { isGracefulShutdownEnabled } = this.props;
        return (
            <div className="container__modal container__quit-modal">
                <div className="content__modal">
                    <span className="icon-close" onClick={this._handleCancel} />
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    <span className="description">
                        <b>Your node is still working.</b>
                        <br />
                        You can <b>close it safely</b> and let your node
                        <br />
                        finish its jobs in the background
                        <br />
                        with a <b>graceful shutdown.</b>
                        <br />
                        Or <b>force quit</b> (may affect your reputation)
                    </span>
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleForceQuit}>
                            Force quit
                        </span>
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleGracefulShutdown}
                            disabled={isGracefulShutdownEnabled}
                            autoFocus>
                            Graceful shutdown
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
