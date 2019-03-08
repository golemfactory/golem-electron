import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {Tooltip} from 'react-tippy';

import * as Actions from '../../actions'

import RadialProgress from './../RadialProgress'
import blockies from './../../utils/blockies'
import PlaceHolderAvatar from './../../assets/img/avatar.svg'

const {clipboard } = window.electron

const mapStateToProps = state => ({
    charts: state.profile.charts,
    avatar: state.profile.avatar,
    nodeName: state.profile.nodeName,
    nodeId: state.info.networkInfo.key,
    publicKey: state.account.publicKey,
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

    /**
     * [checkInputValidity func. checks if given input valid]
     * @param  {Event}  e
     */
    checkInputValidity(e) {
        e.target.checkValidity();
        if (e.target.validity.valid)
            e.target.classList.remove("invalid");
        else
            e.target.classList.add("invalid");
        return e.target.validity.valid
    }

    // <RadialProgress pct={requestorTrust} warn={false}/>
    // <span>Requestor</span>
    // <RadialProgress pct={providerTrust} warn={false}/>
    // <span>Provider</span>
    render() {
        const {avatar, charts, nodeName, nodeId, requestorTrust, providerTrust, publicKey} = this.props
        const {nodeIdCopied, editMode} = this.state
        const avatarImg = blockies.createBlockie({seed:publicKey.toLowerCase(),size:8,scale:16}).toDataURL();
        return (
            <div className="section__personal" id="personal">
                <div className="indicator-panel__personal">
                    <div className="indicator__personal">
                    </div>
                    <div className="avatar-container">
                        <img className="image__personal" src={avatarImg} alt="avatar"/>
                        <div className="image__personal--border"/>
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
                        pattern="^\S+(?: \S+)*$"
                        title="Please write with English charaters and numbers"
                        type="text" 
                        defaultValue={nodeName} 
                        onChange={::this._setNodeName} onKeyDown={(event) => {
                            if(this.checkInputValidity(event) && event.keyCode === 13)
                                this.form.dispatchEvent(new Event("submit"));
                        }}
                        maxLength={16}
                        autoFocus required/>
                        :
                        <span className="user-name__personal">{nodeName ? nodeName : 'Anonymous Golem'}</span>
                        }
                        <Tooltip
                          html={<p>Edit</p>}
                          position="bottom"
                          trigger="mouseenter">
                            <span className={`toggle__edit-mode ${editMode ? "icon-checkmark" : "icon-pencil"}`} onClick={() => this.form.dispatchEvent(new Event("submit"))}/>
                        </Tooltip>
                        <p/>
                    </form>
                    <Tooltip
                        html={<p>{nodeIdCopied ? 'Copied Succesfully!' : 'Click to copy'}</p>}
                        position="bottom"
                        trigger="mouseenter"
                        hideOnClick={false}>
                        <span className="user-id__personal" onClick={this._handleCopyToClipboard.bind(this, nodeId)}>{ nodeId ? nodeId.replace(new RegExp("^(.{0,4}).*(.{4})$", "im"), "$1...$2") : ' will be here'}<span className={nodeIdCopied ? 'icon-confirmed-empty' : undefined}/></span>
                    </Tooltip>
                    <span className="backup-info__personal"><a href="https://golem.network/documentation/11-backing-up-your-golem-app/">
                        <u>Learn more how to <strong>backup Golem</strong></u></a></span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)