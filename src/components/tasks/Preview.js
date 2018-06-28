import React from 'react';
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'

import golemIcon from '../../assets/img/golem-white.svg'


const mapStateToProps = state => ({
    taskList: state.realTime.taskList,
    frameCount: state.preview.ps.frameCount
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Preview extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            previewSRC: null
        }
    }

    _handleExpand(id, frameCount) {
        (id) && this.props.actions.setPreviewExpanded({
            isScreenOpen: true,
            id,
            frameCount
        })
    }

    render() {
        const {id, frameCount, src, taskList} = this.props
        let task = !!id && taskList.filter((item) => item.id === id)[0]
        let preview = !!task && task.preview
        const {previewSRC} = this.state

        return (
            <div className="section__preview-black">
                <div className="details__preview">
                    <button className="btn btn--details" onClick={this._handleExpand.bind(this, id, frameCount)}>Detail view</button>
                </div>
                <img className="preview__img" src={src ? `file://${preview}?${new Date().getTime()}` : 'error'} alt="Task Preview" ref={img => this.img = img} onError={
            (e) => {
                e.preventDefault(); return this.img.src = golemIcon
            }}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)