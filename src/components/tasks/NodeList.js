import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Tooltip } from "react-tippy";

import BlockNodeModal from "./modal/BlockNodeModal";

const { clipboard } = window.electron;

function statusDot(status) {
    switch (status) {
        case "Starting":
            return "icon-status-dot--progress";

        case "Finished":
            return "icon-status-dot--done";

        case "Downloading":
            return "icon-status-dot--download";

        case "Failure":
            return "icon-status-dot--warning";
    }
}

class NodeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataCopied: false,
            blockNodeModal: false,
            nodeBlocked: false,
            errMsg: null,
            subtask2block: null
        };
    }

    componentWillUnmount() {
        this.copyTimeout && clearTimeout(this.copyTimeout);
    }

    _lockScroll(isLocked) {
        this.props.overflowRef.style.setProperty(
            "overflow-y",
            isLocked ? "hidden" : "overlay",
            "important"
        );
    }

    _countStatus = data => {
        function countElements(arr) {
            let a = [],
                b = [],
                prev;

            arr.sort();
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== prev) {
                    a.push(arr[i]);
                    b.push(1);
                } else {
                    b[b.length - 1]++;
                }
                prev = arr[i];
            }

            return [a, b];
        }

        const statusArray = data.map(item => item.status);
        const result = countElements(statusArray);
        if (result)
            return result[0].map((item, index) => (
                <span key={index.toString()} className="indicator__node-count">
                    <span className={`icon-status-dot ${statusDot(item)}`} />
                    {" " + result[1][index]}
                </span>
            ));
        return [];
    };

    _fillNodeInfo = data => {
        const { isDataCopied } = this.state;
        return data.map(
            (
                { subtask_id, status, node_name, node_id },
                index
            ) => (
                <tr key={index.toString()}>
                    <td>
                        <Tooltip
                            html={
                                <p>
                                    {isDataCopied
                                        ? "Copied Succesfully!"
                                        : "Click to copy"}
                                </p>
                            }
                            position="bottom"
                            trigger="mouseenter"
                            hideOnClick={false}>
                            <div
                                className="clipboard-subtask-item"
                                onClick={this._handleCopyToClipboard.bind(
                                    this,
                                    subtask_id
                                )}>
                                <span>{subtask_id}</span>
                            </div>
                        </Tooltip>
                    </td>
                    <td>
                        <Tooltip
                            html={<p>{status}</p>}
                            position="bottom"
                            trigger="mouseenter">
                            <span
                                className={`icon-status-dot ${statusDot(
                                    status
                                )}`}
                            />
                        </Tooltip>
                    </td>
                    <td>
                        <Tooltip
                            html={
                                <p>
                                    {isDataCopied
                                        ? "Copied Succesfully!"
                                        : "Click to copy"}
                                </p>
                            }
                            position="bottom-end"
                            trigger="mouseenter"
                            hideOnClick={false}>
                            <div
                                className="clipboard-subtask-item"
                                onClick={this._handleCopyToClipboard.bind(
                                    this,
                                    node_name
                                )}>
                                <span>{node_name || "Anonymous node"}</span>
                            </div>
                        </Tooltip>
                    </td>
                    <td>
                        <button
                            type="button"
                            className="btn btn--warning btn--small"
                            onClick={this._showBlockNodeModal.bind(this, {
                                node_name,
                                node_id
                            })}
                            disabled={!node_id}>
                            Block
                        </button>
                    </td>
                </tr>
            )
        );
    };

    _handleCopyToClipboard(data, evt) {
        if (data) {
            clipboard.writeText(data);
            this.setState(
                {
                    isDataCopied: true
                },
                () => {
                    this.copyTimeout = setTimeout(() => {
                        this.setState({
                            isDataCopied: false
                        });
                    }, 3000);
                }
            );
        }
    }

    _showBlockNodeModal(subtask) {
        this.setState(
            {
                blockNodeModal: true,
                nodeBlocked: false,
                errMsg: null,
                subtask2block: subtask
            },
            () => this._lockScroll(true)
        );
    }

    _closeBlockNodeModal = () => {
        this.setState({ blockNodeModal: false }, () => this._lockScroll(false));
    };

    _blockNode = () => {
        let node_id = this.state.subtask2block.node_id;
        new Promise((resolve, reject) => {
            this.props.actions.blockNode(node_id, resolve, reject);
        }).then(([result, msg]) => {
            this.setState({
                nodeBlocked: result,
                errMsg: msg
            });
        });
    };

    render() {
        const { subtasksList, hasSubtasksLoaded } = this.props;
        const {
            blockNodeModal,
            nodeBlocked,
            errMsg,
            subtask2block
        } = this.state;
        return (
            <div className="section-node-list__task-detail">
                <h4 className="experiment">Dev mode</h4>
                {hasSubtasksLoaded ? (
                    subtasksList && subtasksList.length > 0 ? (
                        [
                            <div key={"countSubtasks"}>
                                {this._countStatus(subtasksList)}
                            </div>,
                            <table key={"fillNode"}>
                                <thead>
                                    <tr>
                                        <th>Subtask</th>
                                        <th>State</th>
                                        <th>Node</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this._fillNodeInfo(subtasksList)}
                                </tbody>
                            </table>
                        ]
                    ) : (
                        <div className="no-node__task">
                            <span>There's no active node.</span>
                        </div>
                    )
                ) : (
                    <div className="no-node__task">
                        <span>
                            Loading nodes
                            <span className="jumping-dots">
                                <span className="dot-1">.</span>
                                <span className="dot-2">.</span>
                                <span className="dot-3">.</span>
                            </span>
                        </span>
                    </div>
                )}
                {blockNodeModal &&
                    ReactDOM.createPortal(
                        <BlockNodeModal
                            cancelAction={this._closeBlockNodeModal}
                            blockAction={this._blockNode}
                            nodeBlocked={nodeBlocked}
                            errMsg={errMsg}
                            subtask2block={subtask2block}
                        />,
                        document.getElementById("modalPortal")
                    )}
            </div>
        );
    }
}

export default NodeList;
