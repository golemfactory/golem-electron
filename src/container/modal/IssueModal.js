import React from 'react';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'

const knownIssues = Object.freeze({
    PORT: "PORT",
    WEBSOCKET: "WEBSOCKET",
    UPDATE: "UPDATE"
})

const mapStateToProps = state => ({
    connectionProblem: state.info.connectionProblem,
    latestVersion: state.info.latestVersion
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

const DOCLINK = "http://docs.golem.network"
const UPDATELINK = "https://github.com/golemfactory/golem/releases"
export class IssueModal extends React.Component {


    constructor(props) {
        super(props);
        this._handleCancel = ::this._handleCancel
    }

    clickOutside(parent, event) {
        const {connectionProblem, latestVersion} = this.props
        if(connectionProblem.issue === knownIssues.PORT ||
            latestVersion.issue === knownIssues.UPDATE){
            var isClickInside = (parent.contains(event.target) && !parent.isEqualNode(event.target));
            if (!isClickInside) {
                //the click was outside the parent, do something
                if(connectionProblem.issue === knownIssues.PORT)
                    this.props.actions.skipPortError()
                else
                    this.props.actions.setUpdateSeen()
                this._handleCancel()
            }
        }
    }

    componentDidMount() {
        this._specifiedElement = this.refs.modalContent
        this._clickOutside = this.clickOutside.bind(this, this._specifiedElement)
        window.applicationSurface.addEventListener('click', this._clickOutside)
    }

    componentWillUnmount() {
        window.applicationSurface.removeEventListener('click', this._clickOutside)
    }

    _handleCancel() {
        this.props.closeModal()
    }

    showIssue(_report){
        switch(_report.issue){
            case knownIssues.PORT:
                return (<div className="content__modal">
                            <div className="container-icon">
                                <span className="icon-warning"/>
                            </div>
                            <span>Golem is having trouble connecting. <br/>You may need to check your router ports. <br/>Please check the <a href={DOCLINK}>docs</a> for help.</span>
                        </div>)
            case knownIssues.WEBSOCKET:
                return (<div className="content__modal">
                            <div className="container-icon">
                                <span className="icon-warning critical"/>
                            </div>
                            <span>Golem is having trouble connecting. <br/>You may need to restart the applicaton. <br/>Please check the <a href={DOCLINK}>docs</a> for help.</span>
                        </div>)
            case knownIssues.UPDATE:
                return (<div className="content__modal">
                            <div className="container-icon">
                                <span className="svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" id="firework" className="firework-icon injected-svg img-firework inject-svg" data-name="Firework" viewBox="0 0 157 156">
                                        <title>Firework</title>
                                        <path className="cls-3" d="M80.52,106.92a0.65,0.65,0,0,1-.65-0.65v-10a0.65,0.65,0,0,1,1.3,0v10A0.65,0.65,0,0,1,80.52,106.92Z"></path>
                                        <path className="cls-3" d="M97.72,100.91a0.65,0.65,0,0,1-.52-0.26l-6-8a0.65,0.65,0,0,1,1-.78l6,8A0.65,0.65,0,0,1,97.72,100.91Z"></path>
                                        <path className="cls-3" d="M108.32,85.95a0.61,0.61,0,0,1-.19,0l-9.55-3A0.65,0.65,0,1,1,99,81.69l9.55,3A0.65,0.65,0,0,1,108.32,85.95Z"></path>
                                        <path className="cls-3" d="M98.77,71a0.65,0.65,0,0,1-.2-1.27l9.55-3a0.65,0.65,0,1,1,.39,1.24L99,71A0.66,0.66,0,0,1,98.77,71Z"></path>
                                        <path className="cls-3" d="M91.7,61a0.65,0.65,0,0,1-.52-1l6-8a0.65,0.65,0,0,1,1,.78l-6,8A0.65,0.65,0,0,1,91.7,61Z"></path>
                                        <path className="cls-3" d="M80.52,57a0.65,0.65,0,0,1-.65-0.65v-10a0.65,0.65,0,0,1,1.3,0v10A0.65,0.65,0,0,1,80.52,57Z"></path>
                                        <path className="cls-3" d="M67.64,61a0.65,0.65,0,0,1-.52-0.26l-6-8a0.65,0.65,0,0,1,1-.78l6,8A0.65,0.65,0,0,1,67.64,61Z"></path>
                                        <path className="cls-3" d="M60.57,71a0.66,0.66,0,0,1-.2,0l-9.55-3a0.65,0.65,0,1,1,.39-1.24l9.55,3A0.65,0.65,0,0,1,60.57,71Z"></path>
                                        <path className="cls-3" d="M51,85.95a0.65,0.65,0,0,1-.19-1.27l9.55-3a0.65,0.65,0,1,1,.39,1.24l-9.55,3A0.61,0.61,0,0,1,51,85.95Z"></path>
                                        <path className="cls-3" d="M61.62,100.91a0.65,0.65,0,0,1-.52-1l6-8a0.65,0.65,0,0,1,1,.78l-6,8A0.65,0.65,0,0,1,61.62,100.91Z"></path>

                                        <path className="cls-2" d="M80.52,126.88a0.65,0.65,0,0,1-.65-0.65v-10a0.65,0.65,0,0,1,1.3,0v10A0.65,0.65,0,0,1,80.52,126.88Z"></path>
                                        <path className="cls-2" d="M109.74,116.86a0.65,0.65,0,0,1-.52-0.26l-6-8a0.65,0.65,0,0,1,1-.78l6,8A0.65,0.65,0,0,1,109.74,116.86Z"></path>
                                        <path className="cls-2" d="M127.42,91.92a0.61,0.61,0,0,1-.19,0l-9.55-3a0.65,0.65,0,1,1,.39-1.24l9.55,3A0.65,0.65,0,0,1,127.42,91.92Z"></path>
                                        <path className="cls-2" d="M117.86,65a0.65,0.65,0,0,1-.2-1.27l9.55-3a0.65,0.65,0,1,1,.39,1.24l-9.55,3A0.66,0.66,0,0,1,117.86,65Z"></path>
                                        <path className="cls-2" d="M103.73,45.08a0.65,0.65,0,0,1-.52-1l6-8a0.65,0.65,0,0,1,1,.78l-6,8A0.65,0.65,0,0,1,103.73,45.08Z"></path>
                                        <path className="cls-2" d="M80.52,37.07a0.65,0.65,0,0,1-.65-0.65v-10a0.65,0.65,0,0,1,1.3,0v10A0.65,0.65,0,0,1,80.52,37.07Z"></path>
                                        <path className="cls-2" d="M55.61,45.08a0.65,0.65,0,0,1-.52-0.26l-6-8a0.65,0.65,0,0,1,1-.78l6,8A0.65,0.65,0,0,1,55.61,45.08Z"></path>
                                        <path className="cls-2" d="M41.47,65a0.62,0.62,0,0,1-.2,0l-9.55-3a0.65,0.65,0,1,1,.39-1.24l9.55,3A0.65,0.65,0,0,1,41.47,65Z"></path>
                                        <path className="cls-2" d="M31.92,91.93a0.65,0.65,0,0,1-.19-1.27l9.55-3a0.65,0.65,0,1,1,.39,1.24l-9.55,3A0.61,0.61,0,0,1,31.92,91.93Z"></path>
                                        <path className="cls-2" d="M49.59,116.86a0.65,0.65,0,0,1-.52-1l6-8a0.65,0.65,0,0,1,1,.78l-6,8A0.65,0.65,0,0,1,49.59,116.86Z"></path>

                                        <path className="cls-1" d="M80.52,146.83a0.65,0.65,0,0,1-.65-0.65v-10a0.65,0.65,0,0,1,1.3,0v10A0.65,0.65,0,0,1,80.52,146.83Z"></path>
                                        <path className="cls-1" d="M121.77,132.82a0.65,0.65,0,0,1-.52-0.26l-6-8a0.65,0.65,0,0,1,1-.78l6,8A0.65,0.65,0,0,1,121.77,132.82Z"></path>
                                        <path className="cls-1" d="M146.52,97.9a0.61,0.61,0,0,1-.19,0l-9.55-3a0.65,0.65,0,1,1,.39-1.24l9.55,3A0.65,0.65,0,0,1,146.52,97.9Z"></path>
                                        <path className="cls-1" d="M137,59a0.65,0.65,0,0,1-.2-1.27l9.55-3A0.65,0.65,0,1,1,146.7,56l-9.55,3A0.66,0.66,0,0,1,137,59Z"></path>
                                        <path className="cls-1" d="M115.76,29.12a0.65,0.65,0,0,1-.52-1l6-8a0.65,0.65,0,0,1,1,.78l-6,8A0.65,0.65,0,0,1,115.76,29.12Z"></path>
                                        <path className="cls-1" d="M80.52,17.11a0.65,0.65,0,0,1-.65-0.65v-10a0.65,0.65,0,0,1,1.3,0v10A0.65,0.65,0,0,1,80.52,17.11Z"></path>
                                        <path className="cls-1" d="M22.37,59a0.62,0.62,0,0,1-.2,0l-9.55-3A0.65,0.65,0,1,1,13,54.77l9.55,3A0.65,0.65,0,0,1,22.37,59Z"></path>
                                        <path className="cls-1" d="M12.82,97.9a0.65,0.65,0,0,1-.19-1.27l9.55-3a0.65,0.65,0,1,1,.39,1.24l-9.55,3A0.61,0.61,0,0,1,12.82,97.9Z"></path>
                                        <path className="cls-1" d="M43.58,29.12a0.65,0.65,0,0,1-.52-0.26l-6-8a0.65,0.65,0,0,1,1-.78l6,8A0.65,0.65,0,0,1,43.58,29.12Z"></path>
                                        <path className="cls-1" d="M37.56,132.82a0.65,0.65,0,0,1-.52-1l6-8a0.65,0.65,0,0,1,.91-0.13,0.65,0.65,0,0,1,.13.91l-6,8A0.65,0.65,0,0,1,37.56,132.82Z"></path>
                                    </svg>
                                </span>
                            </div>
                            <span>Golem has new version! <br/>To benefit all new and cool features, <br/>please update your Golem <a href={UPDATELINK}>here</a>.</span>
                        </div>)
        }
    }


    render() {
        const {connectionProblem, latestVersion} = this.props
        return (
            <div ref="modalContent" className="container__modal container__issue-modal">
                {this.showIssue(connectionProblem.issue ? connectionProblem : latestVersion)}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueModal)
