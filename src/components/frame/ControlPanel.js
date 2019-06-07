import React from 'react';
import { viewer, imageInfo } from './ImageZoom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Tooltip from '@tippy.js/react';

import * as Actions from '../../actions';

/*############# HELPER FUNCTIONS ############# */

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const mapStateToProps = state => ({
    zoomRatio: state.input.zoomRatio,
    details: state.details.detail
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class ControlPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            previousFrame,
            nextFrame,
            showSubtask,
            zoomRatio,
            details,
            frameIndex
        } = this.props;
        let index = frameIndex + 1; //index gap
        if (!isNumeric(frameIndex) || frameIndex > 999) {
            index = 0;
        }
        return (
            <div className="container__control-panel">
                <Tooltip
                    content={<p>Previous Frame</p>}
                    placement="bottom"
                    trigger="mouseenter">
                    <span
                        className="icon-arrow-left"
                        role="button"
                        aria-label="Previous Frame"
                        tabIndex="0"
                        onClick={previousFrame}
                    />
                </Tooltip>

                <span className="preview-count__control-panel">
                    {parseInt(index)} of{' '}
                    {details.options && details.options.frame_count}
                </span>
                <Tooltip
                    content={<p>Next Frame</p>}
                    placement="bottom"
                    trigger="mouseenter">
                    <span
                        className="icon-arrow-right"
                        role="button"
                        aria-label="Next Frame"
                        tabIndex="0"
                        onClick={nextFrame}
                    />
                </Tooltip>
                <Tooltip
                    content={<p>Zoom Out</p>}
                    placement="bottom"
                    trigger="mouseenter">
                    <span
                        className="icon-zoom-out"
                        id="zoom-out"
                        role="button"
                        aria-label="Zoom out"
                        tabIndex="0"
                    />
                </Tooltip>

                <span className="zoom-home-button" id="reset">
                    {zoomRatio && zoomRatio.toFixed(2)}%
                </span>
                <Tooltip
                    content={<p>Zoom In</p>}
                    placement="bottom"
                    trigger="mouseenter">
                    <span
                        className="icon-zoom-in"
                        id="zoom-in"
                        role="button"
                        aria-label="Zoom In"
                        tabIndex="0"
                    />
                </Tooltip>
                <Tooltip
                    content={<p>Show Subtasks</p>}
                    placement="bottom"
                    trigger="mouseenter">
                    <span
                        className="icon-show-subtasks"
                        onClick={showSubtask}
                        role="button"
                        aria-label="Show SubTask"
                        tabIndex="0"
                    />
                </Tooltip>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlPanel);
