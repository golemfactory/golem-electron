import React from "react";
import Lottie from "react-lottie";

import animData from "./../../../assets/anims/task-settings";

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default class DefaultSettingsModal extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.closeModal("defaultSettingsModal");

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _applyPreset = () => this.props.applyPreset();

    render() {
        const { type } = this.props;
        return (
            <div className="container__modal default-settings-modal__container">
                <div className="content__modal">
                    <div className="default-settings-modal__section-image">
                        <Lottie options={defaultOptions} />
                    </div>
                    <span>
                        Would you like to use default <b>resolution</b> and{" "}
                        <b>sample per pixel</b> parameters from the file?
                    </span>
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}
                        >
                            Cancel
                        </span>
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._applyPreset}
                            autoFocus
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
