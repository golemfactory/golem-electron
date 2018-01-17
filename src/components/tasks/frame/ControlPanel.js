import React from 'react';
import { viewer, imageInfo } from './ImageZoom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ReactTooltip from 'rc-tooltip'

import * as Actions from '../../../actions'


/*############# HELPER FUNCTIONS ############# */


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


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


    render() {
        const {previousFrame, nextFrame, showSubtask, zoomRatio, details, frameIndex} = this.props
        let index = frameIndex + 1 //index gap
        if (!isNumeric(frameIndex) || frameIndex > 999) {
            index = 0;
        }
        return (
            <div className="container__control-panel">
                <ReactTooltip overlayClassName="black" placement="top" trigger={['hover']} overlay={<p>Previous Frame</p>} mouseEnterDelay={1} align={{
                    offset: [0, -3],
                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-arrow-left-white" role="button" aria-label="Previous Frame" tabIndex="0" onClick={previousFrame}/>
                </ReactTooltip>
                
                <span className="preview-count__control-panel">{parseInt(index)} of {details.options && details.options.frame_count}</span>
                <ReactTooltip overlayClassName="black" placement="top" trigger={['hover']} overlay={<p>Next Frame</p>} mouseEnterDelay={1} align={{
                    offset: [0, -3],
                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-arrow-right-white" role="button" aria-label="Next Frame" tabIndex="0" onClick={nextFrame}/>
                </ReactTooltip>
                <ReactTooltip overlayClassName="black" placement="top" trigger={['hover']} overlay={<p>Zoom Out</p>} mouseEnterDelay={1} align={{
                    offset: [0, -10],
                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-zoom-out" id="zoom-out" role="button" aria-label="Zoom out" tabIndex="0"/>
                </ReactTooltip>
                
                <span className="zoom-home-button" id="reset">{zoomRatio && zoomRatio.toFixed(2)}%</span>

                <ReactTooltip overlayClassName="black" placement="top" trigger={['hover']} overlay={<p>Zoom In</p>} mouseEnterDelay={1} align={{
                    offset: [0, -10],
                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-zoom-in" id="zoom-in" role="button" aria-label="Zoom In" tabIndex="0"/>
                </ReactTooltip>
                <ReactTooltip overlayClassName="black" placement="top" trigger={['hover']} overlay={<p>Show Subtasks</p>} mouseEnterDelay={1} align={{
                    offset: [0, -10],
                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-show-subtasks" onClick={showSubtask} role="button" aria-label="Show SubTask" tabIndex="0"/>
                </ReactTooltip>
                
                
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
