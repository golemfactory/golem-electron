import React from 'react';
import Tooltip from '@tippy.js/react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions';

import BlockNodeModal from '../tasks/modal/BlockNodeModal';
import { convertSecsToHMS, timeStampToHR } from './../../utils/time';

const { ipcRenderer, clipboard } = window.electron;

const UNDONE = 0;
const PROGRESS = 1;
const DONE = 2;

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

/*################### HELPER FUNCTIONS #######################*/

/**
 * Function fetches selected nth items(columns) of 2D Array
 * @param  {Array}      arr     [2D Array]
 * @param  {Number}     n       [(n)th column number]
 * @return {Array}              [Array of (n)th column]
 */
const arrayColumn = (arr, n) => arr.map(x => x[n]);

/**
 *  Function will flat given n times nested array and convert to the SVG points array
 *  @see https://jsfiddle.net/mk8jx9wb/
 */
function convertToSVGPoints(arr, offset) {
    if (offset)
        arr = arr.map(item => {
            item[offset.index] = item[offset.index] + (offset.value + 1);
            return item;
        });
    arr.push(arr[0]);
    return []
        .concat(...arr)
        .toString()
        .replace(/(,[^,]*),/g, '$1 ');
}

/**
 * [tooltipOffset func. finding max right and bottom points of the polyline]
 * @param  {[Array]}    arr    [Array of the path item]
 * @return {[Array]}            [Array for the max right point and max bottom point]
 *
 * @description This function will be modified for the non-square shapes
 */
function tooltipOffset(arr, isDirTop) {
    const horizontalPoints = arrayColumn(arr, 0);
    const maxHorizontalLength = Math.max(...horizontalPoints);
    const minHorizontalLength = Math.min(...horizontalPoints);

    const verticalPoints = arrayColumn(arr, 1);
    const maxVerticalLength = Math.max(...verticalPoints);
    const minVerticalLength = Math.min(...verticalPoints);

    /**
     * @FIXME
     *
     * if we gonna draw shape always thro edge to other edge we can keep lat 0
     * but if we gonna draw more than one shape between two side edges we need to calculate
     * distance between absolute center and center of shape in this parameter.
     *
     * @example
     *
     * +) center of screen & center of shape
     * ---------------------
     * = distance between is 0
     *
     * |#################################|
     * |                                 |
     * |                +                |
     * |                                 |
     * |#################################|
     *
     * @example
     *
     * p) center of screen
     * q) center of shape
     * --------------------
     * =  q - p is the offset ± is depend on direction
     *
     * |#################################|
     * |         #                       |
     * |    p    #      q                |
     * |         #                       |
     * |#################################|
     */

    const lat = 0;
    let lng = (maxVerticalLength - minVerticalLength) / 2;

    if (!isDirTop)
        // <-- if direction is 'bottom' we will calculate lng coordinate as minus to center tooltip into the shape.
        lng = -1 * lng;

    return [lat, lng];
}

const subTaskData = {
    key: '0',
    data: {
        status: 0,
        duration: 1206
    }
};

const statusDict = Object.freeze({
    STARTING: 'Starting',
    DOWNLOADING: 'Downloading',
    FINISHED: 'Finished',
    FAILURE: 'Failure',
    RESENT: 'Failed - Resent',
    TIMEOUT: 'Timeout',
    RESTARTED: 'Restart'
});

let statusClassDict = {
    'Not started': 'frame--undone',
    Computing: 'frame--progress',
    Finished: 'frame--done',
    Aborted: 'frame--error'
};

export class SubTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subtaskIdCopied: {},
            isTaskSubmitted: {},
            blockNodeModal: false,
            nodeBlocked: false,
            errMsg: null,
            subtask2block: null
        };
        this.copyTimeoutList = [];
    }

    componentDidMount() {
        const { data, ratio, subtaskList, offset } = this.props;
    }

    componentWillUnmount() {
        this.resubmitTimeout && clearTimeout(this.resubmitTimeout);
        this.copyTimeoutList.map(item => clearTimeout(item));
    }

    _handleResubmit(_id, isTimedOut) {
        const { data, ratio, subtaskList, taskDetails } = this.props;
        this.props.restartSubtask({
            id: _id,
            taskId: taskDetails.id,
            isTimedOut
        });
        this.setState(
            {
                isTaskSubmitted: { [_id]: true }
            },
            () => {
                this.resbumitTimeout = setTimeout(() => {
                    this.setState({
                        isTaskSubmitted: { [_id]: false }
                    });
                }, 5000);
            }
        );
    }

    _handleOpenFile(path) {
        ipcRenderer.send('open-file', path);
    }

    _copySubtask(id) {
        if (this.copyTimeoutList[id]) return;
        clipboard.writeText(id);
        this.setState(
            prevState => ({
                subtaskIdCopied: { ...prevState.subtaskIdCopied, [id]: true }
            }),
            () => {
                this.copyTimeoutList[id] = setTimeout(() => {
                    this.setState(prevState => ({
                        subtaskIdCopied: {
                            ...prevState.subtaskIdCopied,
                            [id]: false
                        }
                    }));
                    clearTimeout(this.copyTimeoutList[id]);
                    this.copyTimeoutList[id] = null;
                }, 2000);
            }
        );
    }

    _showBlockNodeModal(subtask) {
        this.setState({
            blockNodeModal: true,
            nodeBlocked: false,
            errMsg: null,
            subtask2block: subtask
        });
    }

    _blockNode = () => {
        let node_id = this.state.subtask2block.node_id;
        new Promise((resolve, reject) => {
            this.props.actions.blockNode(node_id, resolve, reject);
        }).then(([result, msg]) => {
            this.setState({
                nodeBlocked: result,
                errMsg: msg
            });
        });
    };

    _closeBlockNodeModal = () => this.setState({ blockNodeModal: false });

    /**
     * @description This function will draw shapes with given corner points
     *
     * @param  isDevMode {Boolean}
     * @return {corner points of the drawings [Array]}
     */
    drawLine(isDevMode, _offset) {
        const { data, ratio, subtaskList, taskDetails } = this.props;
        var path = Object.keys(data).map(function(anchestorKey) {
            return {
                key: anchestorKey,
                value: Object.keys(data[anchestorKey]).map(function(parentKey) {
                    return Object.keys(data[anchestorKey][parentKey]).map(
                        function(childKey, index) {
                            return (
                                data[anchestorKey][parentKey][childKey] *
                                (ratio + 0.028)
                            ); // <--  Calculating border coordinates with given ratio
                        }
                    );
                })
            };
        });

        function _taskStatus(status) {
            switch (status) {
                case statusDict.FINISHED:
                    return <p className="status__tooltip">Completed</p>;

                case statusDict.DOWNLOADING:
                    return <p className="status__tooltip">Downloading</p>;

                case statusDict.STARTING:
                    return <p className="status__tooltip">Starting</p>;

                case statusDict.FAILURE:
                    return <p className="status__tooltip">Failed</p>;

                default:
                    return <p className="status__tooltip">Waiting</p>;
            }
        }

        function _counter(start) {
            return window.performance.now() - start;
        }

        return path
            .sort((a, b) => {
                const verticalPointA = arrayColumn(a.value, 1)[0];
                const verticalPointB = arrayColumn(b.value, 1)[0];
                return verticalPointA - verticalPointB;
            })
            .map((item, index) => {
                const subtask = subtaskList.filter(
                    sub => sub.subtask_id === item.key
                )[0];
                const isDirectionTop =
                    index + 1 > taskDetails.subtaskAmount / 2;
                return !!subtask ? (
                    <Tooltip
                        key={index.toString()}
                        content={
                            <div
                                className={`tooltip-frame ${
                                    isDevMode ? 'tooltip-dev' : ''
                                }`}>
                                <div className="content__tooltip">
                                    <div className="developer_view__tooltip">
                                        <div className="dev-tag__tooltip">
                                            {_taskStatus(subtask.status)}
                                            <p
                                                className={`time__tooltip ${
                                                    subtask.status ===
                                                    statusDict.FINISHED
                                                        ? 'time__tooltip--done'
                                                        : ''
                                                }`}>
                                                {timeStampToHR(
                                                    subtask.time_started
                                                )}
                                            </p>
                                            {isDevMode && (
                                                <p className="ip-info__tooltip">
                                                    {subtask.node_ip_address}
                                                </p>
                                            )}
                                            {isDevMode && (
                                                <p className="node-name__tooltip">
                                                    {subtask.node_name ||
                                                        'Anonymous'}
                                                </p>
                                            )}
                                            {isDevMode && (
                                                <p
                                                    className="subtask-id__tooltip"
                                                    style={{
                                                        color: this.state
                                                            .subtaskIdCopied[
                                                            subtask.subtask_id
                                                        ]
                                                            ? '#37c481'
                                                            : '#9b9b9b'
                                                    }}
                                                    onClick={this._copySubtask.bind(
                                                        this,
                                                        subtask.subtask_id
                                                    )}>
                                                    <b>
                                                        {this.state
                                                            .subtaskIdCopied[
                                                            subtask.subtask_id
                                                        ]
                                                            ? 'Subtask ID copied!'
                                                            : 'Click to copy Subtask ID!'}
                                                    </b>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {isDevMode && (
                                        <div className="logs_errors_btns__tooltip">
                                            <button
                                                type="button"
                                                onClick={this._handleOpenFile.bind(
                                                    this,
                                                    subtask.stdout
                                                )}
                                                disabled={!subtask.stdout}>
                                                Logs
                                            </button>
                                            <button
                                                type="button"
                                                onClick={this._handleOpenFile.bind(
                                                    this,
                                                    subtask.stderr
                                                )}
                                                disabled={!subtask.stderr}>
                                                Errors
                                            </button>
                                        </div>
                                    )}
                                    <div className="resubmit_block_btns__tooltip">
                                        <button
                                            type="button"
                                            onClick={this._handleResubmit.bind(
                                                this,
                                                subtask.subtask_id,
                                                taskDetails.status ===
                                                    statusDict.TIMEOUT ||
                                                    taskDetails.status ===
                                                        statusDict.FINISHED
                                            )}
                                            disabled={
                                                taskDetails.status ===
                                                    statusDict.RESTARTED ||
                                                taskDetails.status ===
                                                    statusDict.FAILURE ||
                                                subtask.status ===
                                                    statusDict.TIMEOUT ||
                                                this.state.isTaskSubmitted[
                                                    subtask.subtask_id
                                                ]
                                            }>
                                            {this.state.isTaskSubmitted[
                                                subtask.subtask_id
                                            ]
                                                ? 'Resubmitted!'
                                                : 'Resubmit'}
                                        </button>
                                        {isDevMode && (
                                            <button
                                                type="button"
                                                onClick={this._showBlockNodeModal.bind(
                                                    this,
                                                    subtask
                                                )}>
                                                Block node
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        }
                        placement={index < path.length / 2 ? 'bottom' : 'top'}
                        trigger="mouseenter"
                        interactive={true}
                        hideOnClick={false}
                        interactiveBorder="15"
                        duration={[null, 200]}
                        distance="-15"
                        arrow={true}>
                        <polyline
                            key={index.toString()}
                            fill="transparent"
                            stroke="black"
                            points={convertToSVGPoints(item.value, _offset)}
                        />
                    </Tooltip>
                ) : (
                    ''
                );
            });
    }

    render() {
        const {
            blockNodeModal,
            nodeBlocked,
            errMsg,
            subtask2block
        } = this.state;
        const { offset, isDeveloperMode } = this.props;
        let customStyle = {};
        if (offset.direction === 'y') {
            customStyle = {
                index: 1,
                value: offset.value
            };
        } else if (offset.direction === 'x') {
            customStyle = {
                index: 0,
                value: offset.value
            };
        }
        return (
            <div id="frameSVG">
                <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg">
                    {this.drawLine(isDeveloperMode, customStyle)}
                </svg>
                {blockNodeModal && (
                    <BlockNodeModal
                        cancelAction={this._closeBlockNodeModal}
                        blockAction={this._blockNode}
                        nodeBlocked={nodeBlocked}
                        errMsg={errMsg}
                        subtask2block={subtask2block}
                    />
                )}
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SubTask);
