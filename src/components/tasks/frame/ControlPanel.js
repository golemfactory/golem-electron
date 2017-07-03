import React from 'react';
import { viewer, imageInfo } from './ImageZoom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'


const mapStateToProps = state => ({
    zoomRatio: state.input.zoomRatio,
    details: state.details.detail
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    render() {
        const {previousFrame, nextFrame, showSubtask, zoomRatio, details} = this.props
        let {imgIndex} = this.props
        if (!this.isNumeric(imgIndex) || imgIndex > 999) {
            imgIndex = 0;
        }
        return (
            <div className="container__control-panel">
                <span className="icon-arrow-left-white" role="button" aria-label="Previous Frame" tabIndex="0" onClick={previousFrame}/>
                <span className="preview-count__control-panel">{parseInt(imgIndex) + 1} of {details.options && details.options.frame_count}</span>
                <span className="icon-arrow-right-white" role="button" aria-label="Next Frame" tabIndex="0" onClick={nextFrame}/>
                <span className="icon-zoom-out" id="zoom-out" role="button" aria-label="Zoom out" tabIndex="0"/>
                <span className="zoom-home-button" id="reset">{zoomRatio && zoomRatio.toFixed(2)}%</span>
                <span className="icon-zoom-in" id="zoom-in" role="button" aria-label="Zoom In" tabIndex="0"/>
                <span className="icon-show-subtasks" onClick={showSubtask} role="button" aria-label="Show SubTask" tabIndex="0"/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
