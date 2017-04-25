import React from 'react';
import { viewer, imageInfo } from './ImageZoom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'


const mapStateToProps = state => ({
    zoomRatio: state.input.zoomRatio
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {showSubtask, imgIndex, zoomRatio} = this.props
        return (
            <div className="container__control-panel">
                <span className="icon-arrow-left-white" role="button" aria-label="Previous Frame" tabIndex="0"/>
                <span>{parseInt(imgIndex) + 1} of 250</span>
                <span className="icon-arrow-right-white" role="button" aria-label="Next Frame" tabIndex="0"/>
                <span className="icon-zoom-out" id="zoom-out" role="button" aria-label="Zoom out" tabIndex="0"/>
                <span id="reset">{zoomRatio && zoomRatio.toFixed(2)}%</span>
                <span className="icon-zoom-in" id="zoom-in" role="button" aria-label="Zoom In" tabIndex="0"/>
                <span className="icon-show-subtasks" onClick={showSubtask} role="button" aria-label="Show SubTask" tabIndex="0"/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
