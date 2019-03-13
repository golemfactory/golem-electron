import React from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Tooltip } from "react-tippy";

import map from "lodash/fp/map";

import { Spring, config } from "react-spring";
import { convertSecsToHMS, timeStampToHR } from "./../../utils/secsToHMS";
import { taskStatus } from "./../../constants/statusDicts";

import * as Actions from "../../actions";

import Preview from "./Preview";
import Details from "./Details";
import ConditionalRender from "../hoc/ConditionalRender";

const ETH_DENOM = 10 ** 18;

const mapStateToProps = state => ({
    psId: state.preview.ps.id,
    nodeNumbers: state.details.nodeNumber
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class TaskItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toggledList: []
        };
    }

    componentDidMount() {
        const { actions, item } = this.props;
        let interval = () => {
            actions.fetchHealthyNodeNumber(item.id);
            return interval;
        };

        this.liveSubList = setInterval(interval(), 5000);
    }

    componentWillUnmount() {
        this.liveSubList && clearInterval(this.liveSubList);
    }

    _toggle(id, evt, toggledAttribute) {
        const prevList = this.state.toggledList;
        const prevToggle = this.state.toggledList[id]
            ? this.state.toggledList[id][toggledAttribute]
            : false;

        if (prevList[id]) {
            prevList[id] = map(prevList[id], item => false);
        } else {
            prevList[id] = {};
        }

        prevList[id][toggledAttribute] = !prevToggle;

        this.setState({
            toggledList: prevList
        });
    }

    _togglePreview({ id }, evt) {
        this._toggle(id, evt, "preview");
    }

    _toggleDetail({ id }, evt) {
        this._toggle(id, evt, "detail");
    }

    /**
     * [_fetchStatus func. populate status of the task]
     * @param  {Object}     item    [Task item]
     * @return {DOM}                [Element of the status]
     */
    _fetchStatus = item => {
        const { options } = item;
        const { nodeNumbers } = this.props;

        switch (item.status) {
            case taskStatus.TIMEOUT:
                return (
                    <div>
                        <span>
                            Task time:{" "}
                            {timeStampToHR(
                                item.last_updated - item.time_started,
                                true
                            )}
                        </span>
                        <span className="bumper"> | </span>
                        <span className="duration--timeout">Timed out: </span>
                        <span>{timeStampToHR(item.last_updated)}</span>
                    </div>
                );

            case taskStatus.NOTREADY:
                return (
                    <div>
                        <span>Duration: {convertSecsToHMS(item.duration)}</span>
                        <span className="bumper"> | </span>
                        <span className="duration--preparing">
                            Preparing for computation...{" "}
                        </span>
                    </div>
                );

            case taskStatus.WAITING:
                return (
                    <div>
                        <span>Duration: {convertSecsToHMS(item.duration)}</span>
                        <span className="bumper"> | </span>
                        <span className="duration--preparing">
                            Waiting for computation...{" "}
                        </span>
                    </div>
                );

            case taskStatus.RESTART:
                return (
                    <div>
                        <span>
                            Task time:{" "}
                            {timeStampToHR(
                                item.last_updated - item.time_started,
                                true
                            )}
                        </span>
                        <span className="bumper"> | </span>
                        <span className="duration--restarted">Restarted</span>
                    </div>
                );

            case taskStatus.COMPUTING:
                return (
                    <div>
                        <span>Duration: {convertSecsToHMS(item.duration)}</span>
                        <span className="bumper"> | </span>
                        <span className="duration--computing">
                            Computing...{" "}
                        </span>
                        <span className="bumper"> | </span>
                        <span>{nodeNumbers && nodeNumbers[item.id]} Nodes</span>
                    </div>
                );

            default:
                return (
                    <div>
                        <span>
                            Task time:{" "}
                            {timeStampToHR(
                                item.last_updated - item.time_started,
                                true
                            )}
                        </span>
                        <span className="bumper"> | </span>
                        <span className="duration--finished">Finished: </span>
                        <span>{timeStampToHR(item.last_updated)}</span>
                    </div>
                );
        }
    };

    _fetchCost(item) {
        const fixedTo = 4;
        return (
            <span>
                {(item.cost && (item.cost / ETH_DENOM).toFixed(fixedTo)) ||
                    (item.estimated_cost / ETH_DENOM).toFixed(fixedTo)}{" "}
                GNT/
                {(item.fee && (item.fee / ETH_DENOM).toFixed(fixedTo)) ||
                    (item.estimated_fee / ETH_DENOM).toFixed(fixedTo)}{" "}
                ETH
            </span>
        );
    }

    render() {
        const {
            item,
            index,
            _handleRowClick,
            _handleRestartModal,
            _handleDeleteModal,
            psId
        } = this.props;
        const { toggledList } = this.state;
        const { options } = item;
        return (
            <Spring
                from={{
                    progress: 0
                }}
                to={{
                    progress: item.progress
                }}
                config={{
                    tension: 0,
                    friction: 2,
                    restDisplacementThreshold: 0.1
                }}
                role="listItem"
                tabIndex="-1"
            >
                {value => (
                    <div className="wrapper-task-item">
                        <div
                            className="task-item"
                            style={{
                                background:
                                    item.progress < 1
                                        ? `linear-gradient(90deg, #E3F3FF ${value.progress *
                                              100}%, transparent ${value.progress *
                                              100}%)`
                                        : "transparent"
                            }}
                            onClick={e => _handleRowClick(e, item, index)}
                        >
                            <div
                                className="info__task-item"
                                tabIndex="0"
                                aria-label="Task Preview"
                            >
                                <div>
                                    <span
                                        className={`task-icon icon-${item.type.toLowerCase()}`}
                                    >
                                        <span className="path1" />
                                        <span className="path2" />
                                        <span className="path3" />
                                        <span className="path4" />
                                    </span>
                                </div>
                                <div className="task-item__main">
                                    <h4>{item.name}</h4>
                                    <div className="duration">
                                        {this._fetchStatus(item)}
                                        <div className="info__task">
                                            <div>
                                                <span>
                                                    Frames:{" "}
                                                    {(options &&
                                                        options.frame_count) ||
                                                        0}
                                                </span>
                                                <span className="bumper">
                                                    {" "}
                                                    |{" "}
                                                </span>
                                                <span>
                                                    {" "}
                                                    Resolution:{" "}
                                                    {(options &&
                                                        options.resolution.join(
                                                            "x"
                                                        )) ||
                                                        0}
                                                </span>
                                                <span className="bumper">
                                                    {" "}
                                                    |{" "}
                                                </span>
                                                <span>
                                                    Cost:{" "}
                                                    {this._fetchCost(item)}
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                                    Subtasks:{" "}
                                                    {item.subtasks_count || 0}
                                                </span>
                                                <span className="bumper">
                                                    {" "}
                                                    |{" "}
                                                </span>
                                                <span>
                                                    {" "}
                                                    Task timeout: {item.timeout}
                                                </span>
                                                <span className="bumper">
                                                    {" "}
                                                    |{" "}
                                                </span>
                                                <span>
                                                    {" "}
                                                    Subtask timeout:{" "}
                                                    {item.subtask_timeout}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="control-panel__task"
                                            ref={node =>
                                                (this.controlPanelRef = node)
                                            }
                                        >
                                            <Tooltip
                                                html={<p>Preview</p>}
                                                position="bottom"
                                                trigger="mouseenter"
                                            >
                                                <span
                                                    className="icon-trash"
                                                    tabIndex="0"
                                                    aria-label="Preview"
                                                    onClick={this._togglePreview.bind(
                                                        this,
                                                        item
                                                    )}
                                                >
                                                    <span className="info-label">
                                                        Preview
                                                    </span>
                                                </span>
                                            </Tooltip>
                                            <Tooltip
                                                html={<p>Task Details</p>}
                                                position="bottom"
                                                trigger="mouseenter"
                                                className="task-details-icon"
                                            >
                                                <span
                                                    className="icon-trash"
                                                    tabIndex="0"
                                                    aria-label="Task Details"
                                                    onClick={this._toggleDetail.bind(
                                                        this,
                                                        item
                                                    )}
                                                >
                                                    <span className="info-label">
                                                        Details
                                                    </span>
                                                </span>
                                            </Tooltip>
                                            <Tooltip
                                                html={<p>Restart</p>}
                                                position="bottom"
                                                trigger="mouseenter"
                                            >
                                                <span
                                                    className="icon-progress-clockwise"
                                                    tabIndex="0"
                                                    aria-label="Restart Task"
                                                    onClick={
                                                        item.status !==
                                                        taskStatus.RESTART
                                                            ? _handleRestartModal
                                                            : undefined
                                                    }
                                                    disabled={
                                                        !(
                                                            item.status !==
                                                            taskStatus.RESTART
                                                        )
                                                    }
                                                >
                                                    <span className="info-label">
                                                        Restart
                                                    </span>
                                                </span>
                                            </Tooltip>
                                            <Tooltip
                                                html={<p>Output</p>}
                                                position="bottom"
                                                trigger="mouseenter"
                                            >
                                                <span
                                                    className="icon-trash"
                                                    tabIndex="0"
                                                    aria-label="Open Delete Task Popup"
                                                    onClick={_handleDeleteModal}
                                                >
                                                    <span className="info-label">
                                                        Output
                                                    </span>
                                                </span>
                                            </Tooltip>
                                            <Tooltip
                                                html={<p>Delete</p>}
                                                position="bottom"
                                                trigger="mouseenter"
                                            >
                                                <span
                                                    className="icon-trash"
                                                    tabIndex="0"
                                                    aria-label="Open Delete Task Popup"
                                                    onClick={_handleDeleteModal}
                                                >
                                                    <span className="info-label">
                                                        Delete
                                                    </span>
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ConditionalRender
                            showIf={
                                item.id === psId &&
                                toggledList[psId] &&
                                toggledList[psId].preview
                            }
                        >
                            <Preview
                                id={item.id}
                                src={item.preview}
                                progress={item.progress}
                            />
                        </ConditionalRender>
                        <ConditionalRender
                            showIf={
                                item.id === psId &&
                                toggledList[psId] &&
                                toggledList[psId].detail
                            }
                        >
                            <Details id={item.id} />
                        </ConditionalRender>
                    </div>
                )}
            </Spring>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskItem);
