import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../../actions';
import ConditionalRender from '../../hoc/ConditionalRender';
import GroupedStatus from './GroupedStatus';
import SubtaskList from './SubtaskList';
import BlockNodeModal from '../modal/BlockNodeModal';
import { taskStatus } from '../../../constants/statusDicts';

import every from 'lodash/every';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import size from 'lodash/size';
import some from 'lodash/some';
import without from 'lodash/without';

const mapStateToProps = state => ({
    frameCount: state.preview.ps.frameCount,
    fragments: state.details.fragments[0] || {}
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Details extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkedItems: {},
            isAllChecked: false,
            isAnyChecked: false,
            blockNodeModal: false,
            nodeBlocked: false,
            errMsg: null,
            node2block: null
        };

        this._showBlockNodeModal = this._showBlockNodeModal.bind(this);
        this._closeBlockNodeModal = this._closeBlockNodeModal.bind(this);
    }

    componentWillMount() {
        const { actions, item, updateIf } = this.props;
        let interval = () => {
            actions.getFragments(item.id);
            return interval;
        };
        if (updateIf) this.liveSubList = setInterval(interval(), 2000);
        else actions.getFragments(item.id);
    }

    componentWillUnmount() {
        this.liveSubList && clearInterval(this.liveSubList);
        this.props.actions.clearFragments();
    }

    componentWillUpdate(nextProps, nextState) {
        if (!isEqual(nextState.checkedItems, this.state.checkedItems)) {
            const checkableFragments = filter(nextProps.fragments, item => {
                return item[0]?.status && this._checkRestartCondition(item[0]);
            }).filter(Boolean);
            const isAllChecked =
                every(nextState.checkedItems, item => item === true) &&
                size(nextState.checkedItems) === size(checkableFragments);

            const isAnyChecked = some(
                nextState.checkedItems,
                item => item === true
            );

            if (nextState.isAllChecked !== isAllChecked) {
                this.setState({
                    isAllChecked
                });
            }

            if (nextState.isAnyChecked !== isAnyChecked) {
                this.setState({
                    isAnyChecked
                });
            }
        }

        if (this.liveSubList && !nextProps.updateIf) {
            nextProps.actions.getFragments(nextProps.item.id);
            this.liveSubList && clearInterval(this.liveSubList);
            this.liveSubList = null;
        }
    }

    _toggleItems = (keys, val = null) => {
        const tempObj = { ...this.state.checkedItems };
        keys.forEach(
            key =>
                !!key &&
                (tempObj[key] =
                    val !== null ? !this.state.isAllChecked : !tempObj[key])
        );
        this.setState({
            checkedItems: tempObj
        });
    };

    _toggleAll = () => {
        const { fragments } = this.props;
        const keyList = map(fragments, item => {
            const subtask = item[item.length - 1];
            return (
                subtask?.status !== taskStatus.RESTART && subtask?.subtask_id
            );
        });
        this._toggleItems(keyList, true);
    };

    _restartSubtasks = () => {
        const { item } = this.props;

        if (!this._checkRestartCondition(item)) {
            return;
        }

        const restartList = map(
            this.state.checkedItems,
            (item, key) => !!item && key
        ).filter(Boolean);

        this.props.restartSubtasksModalHandler({
            ...item,
            subtask_ids: restartList
        });
    };

    _restartSubtask = id => {
        const { item } = this.props;

        if (!this._checkRestartCondition(item) || !id) {
            return;
        }

        this.props.restartSubtasksModalHandler({
            ...item,
            subtask_ids: [id]
        });
    };

    _lockScroll(isLocked) {
        this.props.overflowRef.style.setProperty(
            'overflow-y',
            isLocked ? 'hidden' : 'overlay',
            'important'
        );
    }

    _showBlockNodeModal(subtask) {
        this.setState({
            blockNodeModal: true,
            nodeBlocked: false,
            errMsg: null,
            node2block: subtask
        });
    }

    _closeBlockNodeModal = () => {
        this.setState({ blockNodeModal: false });
    };

    _blockNode = () => {
        let node_id = node2block.node_id;
        new Promise((resolve, reject) => {
            actions.blockNode(node_id, resolve, reject);
        }).then(([result, msg]) => {
            this.setState({
                nodeBlocked: result,
                errMsg: msg
            });
        });
    };

    _checkRestartCondition(item) {
        return !(
            item.status === taskStatus.TIMEOUT ||
            item.status === taskStatus.RESTART ||
            item.status === taskStatus.WAITING
        );
    }

    render() {
        const { item, fragments } = this.props;
        const {
            checkedItems,
            isAllChecked,
            isAnyChecked,
            blockNodeModal,
            errMsg,
            nodeBlocked,
            node2block
        } = this.state;
        return (
            <div className="details__section">
                <ConditionalRender showIf={fragments}>
                    <GroupedStatus subtasksList={fragments} />
                    <ConditionalRender
                        showIf={this._checkRestartCondition(item)}>
                        <div className="details__subtask-action">
                            <span onClick={this._toggleAll}>
                                {isAllChecked ? 'Deselect All' : 'Select All'}{' '}
                                Subtasks
                            </span>
                            {isAnyChecked && (
                                <span onClick={this._restartSubtasks}>
                                    Restart Selected
                                </span>
                            )}
                        </div>
                    </ConditionalRender>
                    <SubtaskList
                        lockCheckbox={!this._checkRestartCondition(item)}
                        list={fragments}
                        checkedItems={checkedItems}
                        toggleItems={this._toggleItems}
                        showBlockNodeModal={this._showBlockNodeModal}
                        restartSubtask={this._restartSubtask}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={isEmpty(fragments)}>
                    <div className="details__loading">
                        <span>
                            Fetching subtask information
                            <span className="jumping-dots">
                                <span className="dot-1">.</span>
                                <span className="dot-2">.</span>
                                <span className="dot-3">.</span>
                            </span>
                        </span>
                    </div>
                </ConditionalRender>
                {blockNodeModal &&
                    ReactDOM.createPortal(
                        <BlockNodeModal
                            cancelAction={this._closeBlockNodeModal}
                            blockAction={this._blockNode}
                            nodeBlocked={nodeBlocked}
                            errMsg={errMsg}
                            node2block={node2block}
                        />,
                        document.getElementById('modalPortal')
                    )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Details);

export const ICONS = {
    'Not Started': { name: 'subtask-awaiting', color: 'icon--color-gray' },
    Cancelled: { name: 'subtasks-failure', color: 'icon--color-red' },
    Failure: { name: 'failure', color: 'icon--color-red' },
    Finished: { name: 'finished', color: 'icon--color-green' },
    Starting: { name: 'subtasks-negotiations', color: 'icon--color-yellow' },
    Verifying: { name: 'subtask-verifying', color: 'icon--color-blue' },
    Downloading: { name: 'download', color: 'icon--color-blue' },
    Restart: { name: 'refresh', color: 'icon--color-gray' }
};
