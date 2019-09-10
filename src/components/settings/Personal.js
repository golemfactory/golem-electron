import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import qrcode from 'qrcode-generator';

import Tooltip from '@tippy.js/react';

import * as Actions from "../../actions";

import RadialProgress from "./../RadialProgress";
import blockies from "./../../utils/blockies";
import PlaceHolderAvatar from "./../../assets/img/avatar.svg";

const { clipboard } = window.electron;

const mapStateToProps = state => ({
    charts: state.profile.charts,
    avatar: state.profile.avatar,
    nodeName: state.profile.nodeName,
    nodeId: state.info.networkInfo.key,
    publicKey: state.account.publicKey,
    providerTrust: state.profile.networkProviderTrust,
    requestorTrust: state.profile.networkRequestorTrust
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});
//<p/><span className="icon-question-mark"/> Deleted
export class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeIdCopied: false,
            editMode: false,
            expandPersonal: false,
            nodeName: null
        };
    }

    componentDidMount() {
        this.props.nodeId && this.createQRCode(this.props.publicKey)
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.publicKey !== this.props.publicKey) {
            this.createQRCode(nextProps.publicKey)
        }
    }

    componentWillUnmount() {
        this.copyTimeout && clearTimeout(this.copyTimeout);
    }

    _setNodeName = e => this.setState({ nodeName: e.target.value });

    _toggleEditMode = e => {
        this.setState(
            {
                editMode: !this.state.editMode
            },
            () => {
                let { editMode, nodeName } = this.state;
                if (!!nodeName) nodeName = nodeName.trim(); //space character
                if (!!nodeName && !editMode && nodeName != this.props.nodeName)
                    this.props.actions.updateNodeName(nodeName);
            }
        );
    };

    /**
     * [_handleCopyToClipboard funcs.  copies node id to the clipboard]
     * @param  {String}     nodeId      [NodeId of the user]
     * @param  {Event}      evt         [Clicked event]
     */
    _handleCopyToClipboard(nodeId, evt) {
        if (nodeId) {
            clipboard.writeText(nodeId);
            this.setState(
                {
                    nodeIdCopied: true
                },
                () => {
                    this.copyTimeout = setTimeout(() => {
                        this.setState({
                            nodeIdCopied: false
                        });
                    }, 5000);
                }
            );
        }
    }

    /**
     * [checkInputValidity func. checks if given input valid]
     * @param  {Event}  e
     */
    checkInputValidity(e) {
        e.target.checkValidity();
        if (e.target.validity.valid) e.target.classList.remove("invalid");
        else e.target.classList.add("invalid");
        return e.target.validity.valid;
    }

    createQRCode(data){
        const wrapper= document.createElement('div');
        const qrCodeDOM = document.getElementById('qrCode')
        const typeNumber = 0;
        const errorCorrectionLevel = 'L';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(data);
        qr.make();
        wrapper.innerHTML = qr.createImgTag();
        const element = wrapper.firstChild;
        element.classList.add("personal__qrcode");
        qrCodeDOM.insertBefore(element, qrCodeDOM.firstChild);
    }

    _toggleExpand = e => this.setState( prevState => ({ expandPersonal: !prevState.expandPersonal}))

    render() {
        const {
            avatar,
            charts,
            nodeName,
            nodeId,
            requestorTrust,
            providerTrust,
            publicKey
        } = this.props;
        const { nodeIdCopied, editMode, expandPersonal } = this.state;
        const avatarImg = blockies
            .createBlockie({
                seed: publicKey.toLowerCase(),
                size: 8,
                scale: 16
            })
            .toDataURL();
        return (
            <div className={`section__personal ${expandPersonal ? 'expanded' : ''}`} id="personal">
                <div className="personal__indicator-panel">
                    <span className="icon-close" onClick={this._toggleExpand}/>
                    <div className="avatar-container" onClick={this._toggleExpand}>
                        <div className="image-holder">
                            <img
                                className="personal__image"
                                src={avatarImg}
                                alt="avatar"
                            />
                            <div className="personal__image--border" />
                        </div>
                    </div>
                    <div className="personal__information-panel">
                        <form
                            ref={node => (this.form = node)}
                            className="user-name__form"
                            onSubmit={this._toggleEditMode}>
                            {editMode ? (
                                <input
                                    className="input__node-name"
                                    pattern="^\S+(?: \S+)*$"
                                    title="Please write with English charaters and numbers"
                                    type="text"
                                    defaultValue={nodeName}
                                    onChange={this._setNodeName}
                                    onKeyDown={event => {
                                        if (
                                            this.checkInputValidity(event) &&
                                            event.keyCode === 13
                                        )
                                            this.form.dispatchEvent(
                                                new Event("submit")
                                            );
                                    }}
                                    maxLength={16}
                                    autoFocus
                                    required
                                />
                            ) : (
                                <span className="personal__user-name">
                                    {nodeName ? nodeName : "Anonymous Golem"}
                                </span>
                            )}
                            <Tooltip
                                content={<p>Edit</p>}
                                placement="bottom"
                                trigger="mouseenter">
                                <span
                                    className={`toggle__edit-mode ${
                                        editMode ? "icon-confirmation" : "icon-pencil"
                                    }`}
                                    onClick={() =>
                                        this.form.dispatchEvent(new Event("submit"))
                                    }
                                />
                            </Tooltip>
                            <p />
                        </form>
                        <Tooltip
                            content={
                                <p>
                                    {nodeIdCopied
                                        ? "Copied Succesfully!"
                                        : "Click to copy"}
                                </p>
                            }
                            placement="bottom"
                            trigger="mouseenter"
                            hideOnClick={false}>
                            <span
                                className="personal__user-id"
                                onClick={this._handleCopyToClipboard.bind(
                                    this,
                                    nodeId
                                )}>
                                {nodeId
                                    ? nodeId.replace(
                                          new RegExp("^(.{0,4}).*(.{4})$", "im"),
                                          "$1...$2"
                                      )
                                    : " will be here"}
                                <span
                                    className={
                                        nodeIdCopied
                                            ? "icon-confirmed-empty"
                                            : undefined
                                    }
                                />
                            </span>
                        </Tooltip>
                    </div>
                    <div className="qrcode-container" onClick={this._toggleExpand}>
                        <div id="qrCode" className="qr-holder">
                            <div className="personal__qrcode--border" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Personal);

// <RadialProgress pct={requestorTrust} warn={false}/>
// <span>Requestor</span>
// <RadialProgress pct={providerTrust} warn={false}/>
// <span>Provider</span>