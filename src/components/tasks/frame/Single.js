import React from 'react';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'

import ControlPanel from './ControlPanel'
import ImageZoom from './ImageZoom'
import SubTask from './SubTask'

const path = [
    [
        [1, 1],
        [1, 149],
        [99, 149],
        [99, 74],
        [751, 74],
        [751, 1],
        [1, 1]
    ],
    [
        [1, 151],
        [1, 299],
        [751, 299],
        [751, 76],
        [101, 76],
        [101, 151],
        [1, 151]
    ],
    [
        [1, 301],
        [1, 390],
        [199, 390],
        [199, 301],
        [1, 301]
    ],
    [
        [201, 301],
        [201, 390],
        [399, 390],
        [399, 301],
        [201, 301]
    ],
    [
        [401, 301],
        [401, 390],
        [751, 390],
        [751, 301],
        [401, 301]
    ]
]
const CLOSE_BTN_PATH = '/preview/complete';

let tmpIndex = 0

const mapStateToProps = state => ({
    isSubtaskShown: state.single.isSubtaskShown,
    borderList: state.single.borderList,
    details: state.details.detail
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Single extends React.Component {

    constructor(props) {
        super(props);
        this._showSubtask = ::this._showSubtask
    }

    componentDidMount() {
        console.log(this.props.id)
    }
    /**
     * [_showSubtask func. will draw svg paths over the image to show subtask of render.]
     * @return  nothing
     */
    _showSubtask() {
        this.props.actions.setSubtasksVisibility()
    }

    /**
     * [_handleClose function for close single frame componenet]
     * @return nothing
     */
    _handleClose() {
        hashHistory.push(CLOSE_BTN_PATH)
    }

    render() {
        const {id, preview, actions, isSubtaskShown, borderList, details} = this.props
        console.log("isSubtaskShown", isSubtaskShown);
        console.log("id", id);
        console.log("details.preview", encodeURI(details.preview));
        return (
            <div className="section__frame">
                <span className="button__subtask" onClick={::this._handleClose} onKeyDown={(event) => {
                event.keyCode === 13 && this._handleClose.call(this)
            }} role="button" tabIndex="0" aria-label="Close Single Preview"><span className="icon-cross"/></span>
                <div className="section__image" ref="containerImage">
                    {details.preview && <ImageZoom image={`file://${details.preview}`} />}
                    {isSubtaskShown && <SubTask data={borderList}/>}
                </div>
                <ControlPanel showSubtask={this._showSubtask} imgIndex={id}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Single)
