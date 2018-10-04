import React from 'react';
import { viewer, imageInfo } from './ImageZoom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {Tooltip} from 'react-tippy';

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
                <Tooltip
                    html={<p>Previous Frame</p>}
                    position="bottom"
                    trigger="mouseenter">
                        <span className="icon-arrow-left-small" role="button" aria-label="Previous Frame" tabIndex="0" onClick={previousFrame}/>
                </Tooltip>
                
                <span className="preview-count__control-panel">{parseInt(index)} of {details.options && details.options.frame_count}</span>
                <Tooltip
                    html={<p>Next Frame</p>}
                    position="bottom"
                    trigger="mouseenter">
                        <span className="icon-arrow-right-small" role="button" aria-label="Next Frame" tabIndex="0" onClick={nextFrame}/>
                </Tooltip>
                <Tooltip
                    html={<p>Zoom Out</p>}
                    position="bottom"
                    trigger="mouseenter">
                        <span className="icon-zoom-out" id="zoom-out" role="button" aria-label="Zoom out" tabIndex="0"/>
                </Tooltip>
                
                <span className="zoom-home-button" id="reset">{zoomRatio && zoomRatio.toFixed(2)}%</span>
                <Tooltip
                    html={<p>Zoom In</p>}
                    position="bottom"
                    trigger="mouseenter">
                        <span className="icon-zoom-in" id="zoom-in" role="button" aria-label="Zoom In" tabIndex="0"/>
                </Tooltip>
                <Tooltip
                    html={<p>Show Subtasks</p>}
                    position="bottom"
                    trigger="mouseenter">
                        <span className="icon-show-subtasks" onClick={showSubtask} role="button" aria-label="Show SubTask" tabIndex="0"/>
                </Tooltip>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
