import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Actions from "../../../actions";

import ControlPanel from "./ControlPanel";
import ImageZoom from "./ImageZoom";
import SubTask from "./SubTask";

const CLOSE_BTN_PATH = "/preview/all";

let tmpIndex = 0;

const mapStateToProps = state => ({
    isSubtaskShown: state.single.isSubtaskShown,
    borderList: state.single.borderList,
    details: state.details.detail,
    subtasksList: state.single.subtasksList,
    previewList: state.single.previewList,
    taskId: state.task.taskId,
    zoomRatio: state.input.zoomRatio,
    frameIndex: state.single.frameIndex,
    frameID: state.single.frameId,
    isDeveloperMode: state.input.developerMode
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Single extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ratio: 0,
            offset: {},
            previewLink:
                props.previewList[
                    props.previewList.size < 2 ? 1 : props.frameID
                ]
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            previewLink:
                nextProps.previewList[
                    nextProps.previewList.size < 2 ? 1 : nextProps.frameID
                ]
        });
    }

    componentWillUnmount() {
        const { isSubtaskShown, actions } = this.props;
        !!isSubtaskShown && actions.setSubtasksVisibility();
    }

    /**
     * [_previousFrame func. changes frame screen to the previous one]
     */
    _previousFrame = () => {
        const { previewList, frameID, frameIndex, actions } = this.props;
        if (frameIndex > 0) {
            actions.previousFrame();
            this.setState({
                previewLink: previewList[previewList.size < 2 ? 1 : frameID]
            });
        }
    };

    /**
     * [_nextFrame func. changes frame screen to the next one]
     */
    _nextFrame = () => {
        const {
            details,
            previewList,
            frameID,
            frameIndex,
            actions
        } = this.props;

        if (!!details.options) {
            if (frameIndex + 1 < details.options.frame_count) {
                actions.nextFrame();
                this.setState({
                    previewLink: previewList[previewList.size < 2 ? 1 : frameID]
                });
            }
        }
    };
    /**
     * [_showSubtask func. will draw svg paths over the image to show subtask of render.]
     * @return  nothing
     */
    _showSubtask(id) {
        this.props.actions.setSubtasksVisibility(id);
    }

    /**
     * [_handleClose function for close single frame componenet]
     * @return nothing
     */
    _handleClose = () => window.routerHistory.push(CLOSE_BTN_PATH);
    /**
     * [_handleRestartSubtask func. triggers restart subtask event]
     * @param  {Number} id [Id of subtask]
     */
    _handleRestartSubtask = id => this.props.actions.restartSubtask(id);

    /**
     * [_setClientInfo func. will update position of the subtask borders]
     * @param {Number} options.x [Width of the container]
     * @param {[type]} options.y [Height of the container]
     * @param {Object} _         [Center coordinates of the container]
     * @param {Object} bounds    [Width and height information of the content]
     */
    _setClientInfo = ({ x, y }, _, bounds) => {
        let contentSize = bounds._contentSize;
        let containerRatio = x / y;
        let imageRatio = contentSize.x / contentSize.y;
        let offset = {};

        if (imageRatio < containerRatio) {
            let ratio = y / contentSize.y;
            let resizedPartX = contentSize.x * ratio;
            offset = {
                direction: "x",
                value: Math.trunc(Math.abs(x - resizedPartX) / 2)
            };
        } else {
            let ratio = x / contentSize.x;
            let resizedPartY = contentSize.y * ratio;
            offset = {
                direction: "y",
                value: Math.trunc(Math.abs(y - resizedPartY) / 2)
            };
        }

        let ratio = this.props.zoomRatio / 100 - 0.028;

        this.setState({
            ratio,
            offset
        });
    };

    // <span className="button__subtask" onClick={this._handleClose} onKeyDown={(event) => {
    //             event.keyCode === 13 && this._handleClose.call(this)
    //         }} role="button" tabIndex="0" aria-label="Close Single Preview"><span className="icon-close"/></span>

    render() {
        const {
            taskId,
            frameID,
            frameIndex,
            preview,
            actions,
            isSubtaskShown,
            borderList,
            details,
            subtasksList,
            previewList,
            isDeveloperMode
        } = this.props;
        const { ratio, offset, previewLink } = this.state;
        return (
            <div className="section__frame">
                {details && details.options && details.options.frame_count > 1 && (
                    <span
                        className="button__subtask"
                        onClick={this._handleClose}
                        onKeyDown={event => {
                            event.keyCode === 13 && this._handleClose();
                        }}
                        role="button"
                        tabIndex="0"
                        aria-label="Close Single Preview">
                        <span className="icon-close" />
                    </span>
                )}
                <div className="section__image" ref="containerImage">
                    {previewLink && (
                        <ImageZoom
                            image={`file://${previewLink}`}
                            fetchClientInfo={this._setClientInfo}
                            isSubtaskShown={isSubtaskShown}
                            setSubtasksVisibility={
                                actions.setSubtasksVisibility
                            }
                        />
                    )}
                    {isSubtaskShown && (
                        <SubTask
                            data={borderList}
                            ratio={ratio}
                            subtaskList={subtasksList}
                            taskDetails={details}
                            restartSubtask={this._handleRestartSubtask}
                            offset={offset}
                            isDeveloperMode={isDeveloperMode}
                        />
                    )}
                </div>
                <ControlPanel
                    previousFrame={this._previousFrame}
                    nextFrame={this._nextFrame}
                    showSubtask={this._showSubtask.bind(this, frameID)}
                    frameIndex={frameIndex}
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Single);
