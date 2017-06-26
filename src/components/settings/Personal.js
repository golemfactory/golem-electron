import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {clipboard} = window.require('electron')
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

import * as Actions from '../../actions'

import RadialProgress from './../RadialProgress'
import PlaceHolderAvatar from './../../assets/img/avatar.svg'

const mapStateToProps = state => ({
    charts: state.profile.charts,
    avatar: state.profile.avatar,
    nodeName: state.profile.nodeName,
    nodeId: state.info.networkInfo.key,
    providerTrust: state.profile.networkProviderTrust,
    requestorTrust: state.profile.networkRequestorTrust
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})
//<p/><span className="icon-question-mark"/> Deleted
export class Personal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            nodeIdCopied: false
        }
    }

    componentWillUnmount() {
        this.copyTimeout && clearTimeout(this.copyTimeout)
    }

    /**
     * [_handleCopyToClipboard funcs.  copies node id to the clipboard]
     * @param  {String}     nodeId      [NodeId of the user]
     * @param  {Event}      evt         [Clicked event]
     */
    _handleCopyToClipboard(nodeId, evt) {
        if (nodeId) {
            clipboard.writeText(nodeId)
            this.setState({
                nodeIdCopied: true
            }, () => {
                this.copyTimeout = setTimeout(() => {
                    this.setState({
                        nodeIdCopied: false
                    })
                }, 5000)
            })
        }
    }

    // <RadialProgress pct={requestorTrust} warn={false}/>
    // <span>Requestor</span>
    // <RadialProgress pct={providerTrust} warn={false}/>
    // <span>Provider</span>
    render() {
        const {avatar, charts, nodeName, nodeId, requestorTrust, providerTrust} = this.props
        const {nodeIdCopied} = this.state
        return (
            <div className="section__personal">
                <div className="indicator-panel__personal">
                    <div className="indicator__personal">
                    </div>
                    <div>
                        <img className="image__personal" src={avatar || PlaceHolderAvatar} alt="avatar"/>
                    </div>
                    <div className="indicator__personal">
                    </div>
                </div>
                <div>
                    <span className="user-name__personal">{nodeName ? nodeName : 'Anonymous Golem'}</span><p/>
                    <ReactTooltip placement="bottom" trigger={['hover']} overlay={<p>{nodeIdCopied ? 'Copied Succesfully!' : 'Click to copy'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="user-id__personal" onClick={this._handleCopyToClipboard.bind(this, nodeId)}>{ nodeId ? nodeId.replace(new RegExp("^(.{0,4}).*(.{4})$", "im"), "$1...$2") : ' will be here'}<span className={nodeIdCopied && 'icon-confirmed-empty'}/></span>
                    </ReactTooltip>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)