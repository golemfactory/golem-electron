import React from 'react';

export default class DefaultSettingsModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.closeModal('defaultSettingsModal')
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _applyPreset() {
        this.props.applyPreset()
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal container__default-settings-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-settings"/>
                    </div>
                    <span>Would you like to use default resolution from the file?</span>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={::this._applyPreset} autoFocus>Apply</button>
                    </div>
                </div>
            </div>
        );
    }
}
