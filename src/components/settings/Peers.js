import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const { clipboard } = window.electron;

import Tooltip from '@tippy.js/react';

import * as Actions from './../../actions';

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    peerInfo: state.realTime.peerInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Peers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataCopied: false
        };
    }

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

    _fillNodeInfo = peerInfo => {
        const { isDataCopied } = this.state;
        return peerInfo.map(({ address, port, node_name }, index) => (
            <tr key={index.toString()}>
                <td>
                    <Tooltip
                        content={
                            <p>
                                {isDataCopied
                                    ? 'Copied Successfully!'
                                    : 'Click to copy <Address:Port>'}
                            </p>
                        }
                        placement="bottom"
                        trigger="mouseenter"
                        hideOnClick={false}>
                        <div
                            className="clipboard-subtask-id"
                            onClick={this._handleCopyToClipboard.bind(
                                this,
                                `${address}:${port}`
                            )}>
                            <span>{address}</span>
                        </div>
                    </Tooltip>
                </td>
                <td>
                    <span>{port}</span>
                </td>
                <td>
                    <Tooltip
                        content={
                            <p>
                                {isDataCopied
                                    ? 'Copied Successfully!'
                                    : 'Click to copy'}
                            </p>
                        }
                        placement="bottom"
                        trigger="mouseenter"
                        hideOnClick={false}>
                        <div
                            className="clipboard-subtask-id"
                            onClick={this._handleCopyToClipboard.bind(
                                this,
                                node_name
                            )}>
                            <span>{node_name || 'Unknown node'}</span>
                        </div>
                    </Tooltip>
                </td>
            </tr>
        ));
    };

    render() {
        const { isEngineOn, peerInfo } = this.props;
        return (
            <div className="content__peers">
                {peerInfo && peerInfo.length > 0 ? (
                    <div className="node-info__peers">
                        <table>
                            <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Port</th>
                                    <th>Node Name</th>
                                </tr>
                            </thead>
                            <tbody>{this._fillNodeInfo(peerInfo)}</tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-node__peers">
                        <span>There's no active node.</span>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Peers);
