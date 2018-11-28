import React from 'react';

export default class ConcentModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.closeModal(true) //isCancel = true
    }

    /**
     * [_handleApply func. send information as callback and close modal]
     */
    _handleApply() {
        const {toggleConcentCallback} = this.props
        const {toggleConcentLock} = this.state
        toggleConcentCallback(toggleConcentLock)
        this.props.closeModal()
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal container__concent-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-warning"/>
                    </div>
                    <span>Are you sure you don't want to use concent anymore?</span>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={::this._handleApply} autoFocus>Apply</button>
                    </div>
                </div>
            </div>
        );
    }
}
