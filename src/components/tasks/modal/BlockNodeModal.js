import React from 'react';

export default class BlockNodeModal extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {
        const {cancelAction, blockAction, node2block} = this.props
        return (
            <div className="container__modal container__block-node-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-blocked"/>
                    </div>
                    <span>Are you sure you want to block "<b>{node2block}</b>" node?</span>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={cancelAction}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={blockAction} autoFocus>Block</button>
                    </div>
                </div>
            </div>
        );
    }
}
