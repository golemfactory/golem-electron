import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from '@tippy.js/react';
import { Transition, animated, config } from 'react-spring/renderprops.cjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import RestartModal from '../tasks/modal/restartModal';
import InsufficientAmountModal from '../tasks/modal/InsufficientAmountModal';

import { timeStampToHR } from './../../utils/time';

const statusDict = Object.freeze({
    NOTREADY: 'not started',
    READY: 'ready',
    WAITING: 'waiting',
    COMPUTING: 'computing',
    FINISHED: 'finished',
    TIMEOUT: 'timeout',
    RESTART: 'restart',
    FAILURE: 'failure'
});

const routesDict = Object.freeze({
    COMPLETE: 'complete',
    ALL: 'all',
    SINGLE: 'single'
});

const statusClassDict = Object.freeze({
    notStarted: 'frame--undone',
    computing: 'frame--progress',
    finished: 'frame--done',
    aborted: 'frame--error',
    sending: 'frame--progress',
    waiting: 'frame--progress',
    timeout: 'frame--error',
    restarted: 'frame--undone'
});

/*################### HELPER FUNCTIONS #################*/

function sortById(a, b) {
    return a.data.id - b.data.id;
}

const mapStateToProps = state => ({
    borderList: state.single.borderList,
    details: state.details.detail,
    frameList: state.all.frameList,
    isMainNet: state.info.isMainNet
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class All extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            restartModal: false,
            restartCallback: null,
            restartProps: null,
            insufficientAmountModal: {
                result: false,
                message: null,
                restartData: []
            }
        };
    }

    /**
     * [_handleClick func. will redirect related single frame]
     * @param       {[type]} item          [clicked item]
     * @param       {[type]} index         [index of clicked item]
     * @return nothing
     */
    _handleClick(item, index) {
        const { setFrameId, setFrameIndex } = this.props.actions;
        if (
            item.status !== statusDict.NOTREADY &&
            this.props.details.status !== statusDict.WAITING
        ) {
            setFrameId(item.id);
            setFrameIndex(index);
            window.routerHistory.push(`/preview/${routesDict.SINGLE}/`);
        }
    }

    /**
     * [_handleRestartModal func. makes  restart modal visible]
     * @param  {[type]} restartId       [Id of selected task]
     * @param  {[type]} restartCallback
     */
    _handleRestartModal = (item, restartCallback, isSubtask) => {
        this.setState({
            restartModal: true,
            restartProps: {
                item,
                restartCallback,
                isSubtask
            }
        });
    };

    _handleResubmitModal(_, frameID) {
        new Promise((resolve, reject) => {
            this.props.actions.getSubtasksBorder(frameID, resolve, reject);
        }).then(borderList => {
            let item = this.props.details;
            item.subtask_ids = Object.keys(borderList);
            this._handleRestartModal(item, this._handleRestart, true);
        });
    }

    /**
     * [_handleDeleteModal sends information of the clicked task as callback]
     * @param  {Any}        id              [Id of the selected task]
     * @param  {Boolean}    isPartial       [Restart task partially for timed out subtasks]
     */
    _handleRestart = (id, isPartial, isConcentOn, subtaskList) => {
        this._restartAsync(id, isPartial, isConcentOn, subtaskList).then(
            _result => {
                const isResultObject =
                    !(_result instanceof Array) &&
                    _result instanceof Object &&
                    _result !== null;
                if (_result && (!!_result[1] || isResultObject)) {
                    const message = Array.isArray(_result)
                        ? _result[1]
                        : _result;
                    this.setState({
                        insufficientAmountModal: {
                            result: true,
                            message,
                            restartData: [id, isPartial]
                        }
                    });
                }

                this._closeModal('restartModal');
            }
        );
    };

    _restartAsync(id, isPartial, isConcentOn, subtaskList) {
        return new Promise((resolve, reject) => {
            this.props.actions.restartTask(
                { id, isPartial, isConcentOn, subtaskList },
                resolve,
                reject
            );
        });
    }

    /**
     * [_closeModal funcs. closes modals.]
     */
    _closeModal = modal => {
        this.setState({
            [modal]: false
        });
    };

    /**
     * [getDefaultStyles func. actual animation-related logic]
     * @return  {Array}    [default style list of the animated item]
     */
    getDefaultStyles() {
        return {
            width: 0,
            opacity: 0
        };
    }

    /**
     * [getStyles func. updated style list]
     * @return {Array} [style list of the animated item]
     */
    getStyles() {
        const { show, frameList } = this.props;
        return frameList
            .filter((item, index) => {
                return show == routesDict.COMPLETE
                    ? item[1][0] === statusDict.FINISHED
                    : true;
            })
            .map((item, i) => {
                return {
                    key: item[0].toString(),
                    data: {
                        id: item[0],
                        status: item[1][0],
                        created: item[1][1]
                    }
                };
            })
            .sort(sortById);
    }

    /**
     * [willEnter func. DOM elements enter animation]
     * @return {Object} [Style object]
     */
    willEnter() {
        return {
            width: 71.6,
            opacity: 1
        };
    }

    /**
     * [willLeave DOM elements leave animation]
     * @return {Object} [Style object]
     */
    willLeave() {
        return {
            width: 0,
            opacity: 0
        };
    }

    _getIndexById(_id) {
        const { frameList } = this.props;
        return frameList.findIndex(obj => obj[0] === _id);
    }
    // show == 'complete' &&
    render() {
        const { show, details, frameList, borderList, isMainNet } = this.props;
        const { restartModal, restartProps, insufficientAmountModal } = this.state;
        const animatedList = this.getStyles();
        return (
            <div>
                <div className="container__all-frame">
                    <Transition
                        native
                        items={animatedList}
                        keys={item => item.key}
                        from={this.getDefaultStyles}
                        enter={this.willEnter}
                        leave={this.willLeave}>
                        {({ key, data }, index) => props => {
                            return (
                                <animated.div
                                    style={props}
                                    key={index.toString()}
                                    className="item__all-frame"
                                    children={
                                        <Tooltip
                                            content={
                                                <div className="content__tooltip">
                                                    {data.status ===
                                                        statusDict.FINISHED && (
                                                        <p className="status__tooltip">
                                                            Completed
                                                        </p>
                                                    )}
                                                    <p
                                                        className={`time__tooltip ${data.status ===
                                                            statusDict.FINISHED &&
                                                            'time__tooltip--done'}`}>
                                                        {data.created
                                                            ? timeStampToHR(
                                                                  data.created
                                                              )
                                                            : 'Not started'}
                                                    </p>
                                                    <button
                                                        className="btn btn--primary"
                                                        onClick={this._handleResubmitModal.bind(
                                                            this,
                                                            data,
                                                            data.id
                                                        )}
                                                        disabled={
                                                            data.status ===
                                                                statusDict.NOTREADY ||
                                                            data.status ===
                                                                statusDict.RESTART ||
                                                            details.status ===
                                                                statusDict.RESTART
                                                        }>
                                                        Resubmit
                                                    </button>
                                                </div>
                                            }
                                            placement="bottom"
                                            trigger="mouseenter"
                                            interactive={true}
                                            arrow={true}
                                            maxWidth="500"
                                            size="regular">
                                            <div
                                                className={`${
                                                    statusClassDict[data.status]
                                                }`}
                                                onClick={this._handleClick.bind(
                                                    this,
                                                    data,
                                                    this._getIndexById(data.id)
                                                )}
                                                onKeyDown={event => {
                                                    event.keyCode === 13 &&
                                                        this._handleClick.call(
                                                            this,
                                                            data,
                                                            index
                                                        );
                                                }}
                                                role="button"
                                                tabIndex="0"
                                                aria-label="Preview of Frame"
                                            />
                                        </Tooltip>
                                    }
                                />
                            );
                        }}
                    </Transition>
                </div>
                {restartModal &&
                    ReactDOM.createPortal(
                        <RestartModal
                            closeModal={this._closeModal}
                            {...restartProps}
                        />,
                        document.getElementById('modalPortal')
                    )}
                {insufficientAmountModal?.result &&
                    ReactDOM.createPortal(
                        <InsufficientAmountModal
                            previewWindow={true}
                            closeModal={this._closeModal}
                            createTaskConditionally={this._handleRestart.bind(
                                this,
                                ...insufficientAmountModal?.restartData
                            )}
                            isMainNet={isMainNet}
                            message={insufficientAmountModal?.message}
                        />,
                        document.getElementById("modalPortal")
                    )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(All);
