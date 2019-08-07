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
     * [_handleCancel func. triggers graceful shutdown]
     */
    _handleQuit = () => {
        this.props.closeModal();
    };

    render() {
        return (
            <div className="container__modal container__file-check-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    <span>
                        <b>Your node is still working.</b><br/>
                        You can <b>close it safely</b> and let your node finish
                        its jobs in the background with a{' '}
                        <b>graceful shutdown.</b>
                        Or <b>force quit</b> (may affect your reputation)
                    </span>
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Force quit
                        </span>
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleQuit}
                            autoFocus>
                            Graceful shutdown
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
