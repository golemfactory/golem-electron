import React from "react";
import ReactDOM from "react-dom";
import { findDOMNode } from "react-dom";
import { Link } from "react-router-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Actions from "../../actions";
import blender_logo from "./../../assets/img/blender_logo.png";
import { convertSecsToHMS, timeStampToHR } from "./../../utils/time";

import InsufficientAmountModal from "./modal/InsufficientAmountModal";
import TaskItem from "./TaskItem";

const mapStateToProps = state => ({
    taskList: state.realTime.taskList,
    isEngineOn: state.info.isEngineOn,
    connectedPeers: state.realTime.connectedPeers,
    psEnabled: state.preview.ps.enabled,
    psId: state.preview.ps.id
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const status = Object.freeze({
    WAITINGFORPEER: "Waiting for peer",
    NOTREADY: "Not started",
    READY: "Ready",
    WAITING: "Waiting",
    COMPUTING: "Computing",
    FINISHED: "Finished",
    TIMEOUT: "Timeout",
    RESTART: "Restart"
});

function shouldPSEnabled(_item) {
    return (
        _item.status == status.COMPUTING ||
        _item.status == status.FINISHED ||
        (_item.status == status.TIMEOUT && _item.progress > 0) ||
        (_item.status == status.RESTART && _item.progress > 0)
    );
}

/**
 * { Class for Table Component in Blender Component }
 *
 * @class      Table (name)
 */
export class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            insufficientAmountModal: {
                result: false,
                message: null,
                restartData: []
            }
        };

        this._handleRestartSubtasksModal = this._handleRestartSubtasksModal.bind(
            this
        );
    }

    componentWillUpdate(nextProps, nextState) {
        //# avoid from updating state on render cycle, previewLock mechanism moved here
        if (nextProps.previewId !== this.props.previewId)
            this.selectedItem = nextProps.taskList.filter(
                item => item.id === nextProps.previewId
            )[0];

        if (
            this.selectedItem &&
            (nextProps.psEnabled !== shouldPSEnabled(this.selectedItem) ||
                nextProps.previewId !== this.props.psId)
        )
            this.props.actions.updatePreviewLock({
                id: this.selectedItem.id,
                frameCount: this.selectedItem.options.frame_count,
                enabled: shouldPSEnabled(this.selectedItem)
            });
    }

    /**
     * [_navigateTo func. signifies selected navigation item]
     * @param  {Event}  evt
     */
    _navigateTo = evt => {
        let taskItems = document.getElementsByClassName("task-item");
        [].map.call(taskItems, item => {
            item.classList.remove("active");
        });

        evt && evt.currentTarget.classList.add("active");
    };

    /**
     * [_handleRowClick func. sends information of the clicked task as callback]
     * @param  {Event}      event
     * @param  {Object}     item    [Clicked task object]
     * @param  {Number}     Index   [Index of selected task]
     * @return {Boolean}
     */
    _handleRowClick = (event, item, index) => {
        const { id, preview, options } = item;

        this._navigateTo(event);
        this.props.previewHandler({
            id: id,
            src: preview
        });

        return true;
    };

    /**
     * [_handleDeleteModal sends information of the clicked task as callback]
     * @param  {Any}        id      [Id of the selected task]
     */
    _handleDeleteModal = id =>
        this.props.deleteModalHandler(id, this._handleDeleteTask);

    /**
     * [_handleDeleteTask func. deletes selected task]
     * @param  {Any}        id      [Id of the selected task]
     */
    _handleDeleteTask = id => {
        const { actions, previewHandler } = this.props;
        //console.log("DELETED_TASK", id)
        actions.deleteTask(id);

        previewHandler({
            id: null,
            src: null
        });

        this._navigateTo(null);

        actions.updatePreviewLock({
            id: null,
            frameCount: null,
            enabled: false
        });
    };

    /**
     * [_handleRestartModal sends information of the clicked task as callback]
     * @param  {Any}        id      [Id of the selected task]
     */
    _handleRestartModal(item) {
        this.props.restartModalHandler(item, this._handleRestart);
    }

    /**
     * [_handleRestartModal sends information of the clicked task as callback]
     * @param  {Any}        id      [Id of the selected task]
     */
    _handleRestartSubtasksModal(list) {
        this.props.restartModalHandler(list, this._handleRestart, true);
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
                    const message = _result[1] || _result;
                    this.setState({
                        insufficientAmountModal: {
                            result: true,
                            message,
                            restartData: [id, isPartial]
                        }
                    });
                }
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

    _closeModal = () => {
        this.setState({
            insufficientAmountModal: {
                result: false,
                message: null
            }
        });
    };

    /**
     * {listTasks function}
     * @param  {Array}    data    [JSON array of task list]
     * @return {Object}           [DOM of task list]
     *
     * @description [React-Spring]  https://github.com/drcmda/react-spring
     * React spring provides animation ability to elements.
     *
     */
    listTasks(data) {
        const { toggleWalletTray } = this.props;
        const listItems = data.map((item, index) => (
            <TaskItem
                key={index.toString()}
                item={item}
                index={index}
                _handleRowClick={this._handleRowClick.bind(this)}
                _handleRestartModal={this._handleRestartModal.bind(this, item)}
                _handleRestartSubtasksModal={this._handleRestartSubtasksModal}
                _handleDeleteModal={this._handleDeleteModal.bind(this, item.id)}
                _toggleWalletTray={toggleWalletTray}
            />
        ));

        return <div className="task-list">{data.length > 0 && listItems}</div>;
    }

    render() {
        const { taskList } = this.props;
        const { insufficientAmountModal } = this.state;
        return (
            <div role="list">
                {taskList && this.listTasks(taskList)}
                {insufficientAmountModal?.result &&
                    ReactDOM.createPortal(
                        <InsufficientAmountModal
                            closeModal={this._closeModal}
                            createTaskConditionally={this._handleRestart.bind(
                                this,
                                ...insufficientAmountModal?.restartData
                            )}
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
)(Table);
