import React from 'react';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'

const mapStateToProps = state => ({
    connectionProblem: state.info.connectionProblem
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

const DOCLINK = "http://docs.golem.network"
export class ConnectionModal extends React.Component {


    constructor(props) {
        super(props);
        this._handleCancel = ::this._handleCancel
    }

    clickOutside(parent, event) {
        var isClickInside = (parent.contains(event.target) && !parent.isEqualNode(event.target));
        // console.log(parent, event.target, parent.contains(event.target), !parent.isEqualNode(event.target))
        if (!isClickInside) {
            //the click was outside the parent, do something
            this.props.actions.skipPortError()
            this._handleCancel()
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


    render() {
        const {connectionProblem} = this.props
        return (
            <div ref="modalContent" className="container__modal container__connection-modal">
                <div className="content__modal">
                    <div className="container-icon">
                        <span className="icon-warning"/>
                    </div>
                    <span>Golem is having trouble connecting. <br/>You may need to check your {connectionProblem.issue}. <br/>Please check the <a href={DOCLINK}>docs</a> for help.</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionModal)