import React from 'react';

export default class ResolutionChangeModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.applyPreset(this.props.info, false)
        this.props.closeModal()
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _applyPreset() {
        this.props.applyPreset(this.props.info)
        this.props.closeModal()
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal container__default-settings-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-warning"/>
                    </div>
                    <span>This action will change your default resolution, would like to apply?</span>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Keep</span>
                        <button type="button" className="btn--primary" onClick={::this._applyPreset} autoFocus>Apply</button>
                    </div>
                </div>
            </div>
        );
    }
}
