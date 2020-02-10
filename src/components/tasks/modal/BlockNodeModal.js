import React, { Fragment } from 'react';
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

    _nodeName(node) {
        return node?.node_name || node?.name || 'Unknown';
    }

    _nodeId(node) {
        return (
            (node?.node_id || node?.key || node?.identity).substr(0, 24) + '…'
        );
    }

    _blockNodeModal(node, cancelAction, blockAction, unlockMode, aclMode) {
        return (
            <Fragment>
                <span>
                    Are you sure you want to {unlockMode ? 'remove' : 'block'}{' '}
                    the "<b>{this._nodeName(node)}</b>" node
                    {unlockMode
                        ? aclMode
                            ? ' from whitelist'
                            : ' from blacklist'
                        : ''}
                    ?
                    <span className="node_id_span">
                        {' '}
                        (node id: {this._nodeId(node)})
                    </span>
                </span>
                <div className="action__modal">
                    <span className="btn--cancel" onClick={cancelAction}>
                        Cancel
                    </span>
                    <button
                        type="button"
                        className="btn--primary"
                        onClick={blockAction}
                        autoFocus>
                        {unlockMode ? 'Remove' : 'Block'}
                    </button>
                </div>
            </Fragment>
        );
    }

    _errorModal(errMsg, cancelAction) {
        return (
            <Fragment>
                <div className="exist-message">
                    <span>Hey! It seems that Node ID</span>
                    <br/>
                    <span className="node_id_error">
                        {this._nodeId({node_id: errMsg})}
                    </span>
                    <br/>
                    <span>is already in your list.</span>
                </div>
                <div className="action__modal">
                    <button className="btn--primary" onClick={cancelAction}>
                        OK
                    </button>
                </div>
            </Fragment>
        );
    }

    _confirmationModal(node, cancelAction, unlockMode) {
        return (
            <Fragment>
                <span>
                    The "<b>{this._nodeName(node)}</b>" node is{' '}
                    {unlockMode ? 'removed from' : 'added to'} the list.
                </span>
                <div className="action__modal">
                    <button
                        type="button"
                        className="btn--primary"
                        onClick={cancelAction}
                        autoFocus>
                        OK!
                    </button>
                </div>
            </Fragment>
        );
    }

    render() {
        const {
            cancelAction,
            blockAction,
            nodeBlocked,
            errMsg,
            node2block,
            unlockMode = false,
            aclMode = false
        } = this.props;
        return (
            <div className="container__modal container__block-node-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions} />
                    </div>
                    {nodeBlocked
                        ? this._confirmationModal(
                              node2block,
                              cancelAction,
                              unlockMode
                          )
                        : errMsg
                        ? this._errorModal(errMsg, cancelAction)
                        : this._blockNodeModal(
                              node2block,
                              cancelAction,
                              blockAction,
                              unlockMode,
                              aclMode
                          )}
                </div>
            </div>
        );
    }
}
//<span className={`${nodeBlocked ? "icon-checkmark" : "icon-blocked"}`}/>
