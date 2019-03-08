import React, {Fragment} from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/block-node';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class BlockNodeModal extends React.Component {


    constructor(props) {
        super(props);
    }

    _nodeName(subtask) {
        return subtask.node_name ? subtask.node_name : "Anonymous"
    }

    _nodeId(subtask) {
        return subtask.node_id.substr(0, 24) + "…"
    }

    _blockNodeModal(subtask, cancelAction, blockAction) {
        return <Fragment>
            <span>Are you sure you want to block the "
                <b>{this._nodeName(subtask)}</b>"
                node?
                <span className="node_id_span"> (node id: {this._nodeId(subtask)})</span>
            </span>
            <div className="action__modal">
                <span className="btn--cancel" onClick={cancelAction}>Cancel</span>
                <button type="button" className="btn--primary" onClick={blockAction} autoFocus>Block</button>
            </div>
         </Fragment>
    }

    _errorModal(errMsg, cancelAction) {
        return <Fragment>
            <span>
                {errMsg}
            </span>
            <div className="action__modal">
                <button className="btn--warning" onClick={cancelAction}>Cancel</button>
            </div>
        </Fragment>
    }

    _confirmationModal(subtask, cancelAction) {
        return <Fragment>
            <span>The "
                <b>{this._nodeName(subtask)}</b>"
                node was added to the blacklist.
            </span>
            <div className="action__modal">
                <button type="button" className="btn--primary" onClick={cancelAction} autoFocus>OK!</button>
            </div>
        </Fragment>
    }

    render() {
        const {cancelAction, blockAction, nodeBlocked, errMsg, subtask2block} = this.props
        return (
            <div className="container__modal container__block-node-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions}/>
                    </div>
                    { nodeBlocked
                        ? this._confirmationModal(subtask2block, cancelAction)
                        : errMsg
                            ? this._errorModal(errMsg, cancelAction)
                            : this._blockNodeModal(subtask2block, cancelAction, blockAction)
                    }
                </div>
            </div>
        );
    }
}
//<span className={`${nodeBlocked ? "icon-checkmark" : "icon-blocked"}`}/>

