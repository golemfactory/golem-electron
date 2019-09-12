import React from "react";
import Lottie from "react-lottie";

import animData from "./../../../assets/anims/are-you-sure";

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default class ResolutionChangeModal extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => {
        this.props.applyPreset(this.props.info, false);
        this.props.closeModal("resolutionChangeModal");
    };

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _applyPreset = () => {
        this.props.applyPreset(this.props.info);
        this.props.closeModal("resolutionChangeModal");
    };

    render() {
        const { type } = this.props;
        return (
            <div className="container__modal default-settings-modal__container">
                <div className="content__modal">
                    <div className="default-settings-modal__section-image resolution-change-img">
                        <Lottie options={defaultOptions} />
                    </div>
                    <span>
                        This action will change your default <b>resolution</b> and{" "}
                        <b>sample per pixel</b> parameters, would
                        like to apply?
                    </span>
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Keep
                        </span>
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._applyPreset}
                            autoFocus>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
