import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

import * as Actions from '../../actions'

import RadialProgress from './../RadialProgress'
import PlaceHolderAvatar from './../../assets/img/avatar.svg'

const {clipboard } = window.electron

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
            nodeIdCopied: false,
            editMode: false,
            nodeName: null
        }
    }

    componentWillUnmount() {
        this.copyTimeout && clearTimeout(this.copyTimeout)
    }

    _setNodeName(e) {
        this.setState({
            nodeName: e.target.value
        })
    }

    _toggleEditMode(e){
        this.setState({
            editMode: !this.state.editMode
        }, () => {
            let {editMode, nodeName} = this.state;
            if(!!nodeName) nodeName = nodeName.trim() //space character
            if(!!nodeName && !editMode && nodeName != this.props.nodeName)
                this.props.actions.updateNodeName(nodeName)
        })
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
        const {nodeIdCopied, editMode} = this.state
        return (
            <div className="section__personal" id="personal">
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
                    <form ref={node => this.form = node} 
                        className="user-name__form" 
                        onSubmit={::this._toggleEditMode}>
                        { editMode
                        ?
                        <input 
                        pattern="[a-zA-Z0-9-]+"
                        title="Please write with English charaters and numbers"
                        type="text" 
                        defaultValue={nodeName} 
                        onChange={::this._setNodeName} onKeyDown={(event) => {
                            event.keyCode === 13 && this.form.dispatchEvent(new Event("submit"));
                        }}
                        maxLength={16}
                        autoFocus required/>
                        :
                        <span className="user-name__personal">{nodeName ? nodeName : 'Anonymous Golem'}</span>
                        }
                        <ReactTooltip overlayClassName="black" className="tooltip__edit-mode" placement="top" trigger={['hover']} overlay={<p>Edit</p>} mouseEnterDelay={1} align={{
                    offset: [0, -5],
                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                            <span className={`toggle__edit-mode ${editMode ? "icon-checkmark" : "icon-pencil"}`} onClick={() => this.form.dispatchEvent(new Event("submit"))}/>
                        </ReactTooltip>
                        <p/>
                    </form>
                    <ReactTooltip overlayClassName="black" placement="bottom" trigger={['hover']} overlay={<p>{nodeIdCopied ? 'Copied Succesfully!' : 'Click to copy'}</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="user-id__personal" onClick={this._handleCopyToClipboard.bind(this, nodeId)}>{ nodeId ? nodeId.replace(new RegExp("^(.{0,4}).*(.{4})$", "im"), "$1...$2") : ' will be here'}<span className={nodeIdCopied ? 'icon-confirmed-empty' : undefined}/></span>
                    </ReactTooltip>
                    <span className="backup-info__personal"><a href="https://github.com/golemfactory/golem/wiki/FAQ#backing-up-your-golem-app">
                        <u>Learn more how to <strong>backup Golem</strong></u></a></span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)