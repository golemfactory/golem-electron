import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {clipboard} = window.require('electron')
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

import * as Actions from './../../actions'

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    peerInfo: state.realTime.peerInfo
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Peers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDataCopied: false
        }
    }

    _handleCopyToClipboard(data, evt) {
        if (data) {
            clipboard.writeText(data)
            this.setState({
                isDataCopied: true
            }, () => {
                this.copyTimeout = setTimeout(() => {
                    this.setState({
                        isDataCopied: false
                    })
                }, 3000)
            })
        }
    }

    _fillNodeInfo(peerInfo){
        const {isDataCopied} = this.state
        return peerInfo.map(({address, port, node_name}, index) => <tr key={index.toString()}>
                <td>
                    <ReactTooltip placement="bottom" trigger={['hover']} overlay={<p>{isDataCopied ? 'Copied Succesfully!' : 'Click to copy <Adress:Port>'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <div className="clipboard-subtask-id" onClick={this._handleCopyToClipboard.bind(this, `${address}:${port}`)}>
                            <span>{address}</span>
                        </div>
                    </ReactTooltip>
                </td>
                <td>
                    <span>{port}</span>
                </td>
                <td>
                    <ReactTooltip placement="bottom" trigger={['hover']} overlay={<p>{isDataCopied ? 'Copied Succesfully!' : 'Click to copy'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <div className="clipboard-subtask-id" onClick={this._handleCopyToClipboard.bind(this, node_name)}>
                            <span>{node_name || "Anonymous node"}</span>
                        </div>
                    </ReactTooltip>
                </td>
            </tr>)
    }

    render() {
        const {isEngineOn, peerInfo} = this.props
        return (
            <div className="content__peers">
            { peerInfo.length > 0 ?
                <div className="node-info__peers">
                    <table>
                        <thead>
                            <tr>
                              <th>Address</th>
                              <th>Port</th>
                              <th>Node Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {::this._fillNodeInfo(peerInfo)}
                        </tbody>
                    </table>
                </div>
                :
                <div className="no-node__peers">
                    <span>There's no active node.</span>
                </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Peers)
