import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/are-you-sure';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class DeleteModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.closeModal()
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleDelete() {
        const {deleteCallback, deleteId} = this.props
        deleteCallback(deleteId)
        this.props.closeModal()
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal container__delete-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions}/>
                    </div>
                    <span>Are you sure  you want to delete this task? You can’t undo this.</span>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--warning" onClick={::this._handleDelete} autoFocus>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}
