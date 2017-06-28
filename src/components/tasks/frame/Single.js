import React from 'react';
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'

import ControlPanel from './ControlPanel'
import ImageZoom from './ImageZoom'
import SubTask from './SubTask'

const CLOSE_BTN_PATH = '/preview/complete';

let tmpIndex = 0


const mapStateToProps = state => ({
    isSubtaskShown: state.single.isSubtaskShown,
    borderList: state.single.borderList,
    details: state.details.detail,
    subtasksList: state.single.subtasksList,
    previewList: state.single.previewList,
    taskId: state.task.taskId
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
        console.log(this.props.taskId)
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

    _handleRestartSubtask(id) {
        this.props.actions.restartSubtask(id)
    }


    render() {
        const {id, taskId, preview, actions, isSubtaskShown, borderList, details, subtasksList, previewList} = this.props
        console.log("isSubtaskShown", isSubtaskShown);
        console.log("id", id);
        console.log("details", details);
        let previewLink = previewList[id]
        return (
            <div className="section__frame">
                <span className="button__subtask" onClick={::this._handleClose} onKeyDown={(event) => {
                event.keyCode === 13 && this._handleClose.call(this)
            }} role="button" tabIndex="0" aria-label="Close Single Preview"><span className="icon-cross"/></span>
                <div className="section__image" ref="containerImage">
                    {previewLink && <ImageZoom image={`file://${previewLink}`} />}
                    {isSubtaskShown && <SubTask data={borderList} ratio={(details && details.options) && (details.options.resolution[1] / details.options.resolution[0])} subtaskList={subtasksList} restartSubtask={::this._handleRestartSubtask}/>}
                </div>
                <ControlPanel showSubtask={this._showSubtask} imgIndex={id}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Single)
