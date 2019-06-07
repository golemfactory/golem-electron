import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import map from 'lodash/map';
import filter from 'lodash/filter';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../../actions';
import ConditionalRender from '../../hoc/ConditionalRender';
import GroupedStatus from './GroupedStatus';
import SubtaskList from './SubtaskList';
import BlockNodeModal from '../modal/BlockNodeModal';
import { taskStatus } from '../../../constants/statusDicts';

import isEqual from 'lodash/isEqual';
import every from 'lodash/every';
import some from 'lodash/some';
import size from 'lodash/size';

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
            subtask2block: null
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
    }

    componentWillUpdate(nextProps, nextState) {
        if (!isEqual(nextState.checkedItems, this.state.checkedItems)) {
            const isAllChecked =
                every(nextState.checkedItems, item => item === true) &&
                size(nextState.checkedItems) === size(nextProps.fragments);

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
            this.liveSubList && clearInterval(this.liveSubList);
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
        const keyList = map(
            fragments,
            item => item[item.length - 1] && item[item.length - 1].subtask_id
        );
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
            subtask2block: subtask
        });
    }

    _closeBlockNodeModal = () => {
        this.setState({ blockNodeModal: false });
    };

    _blockNode = () => {
        let node_id = subtask2block.node_id;
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
            subtask2block
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
                {blockNodeModal &&
                    ReactDOM.createPortal(
                        <BlockNodeModal
                            cancelAction={this._closeBlockNodeModal}
                            blockAction={this._blockNode}
                            nodeBlocked={nodeBlocked}
                            errMsg={errMsg}
                            subtask2block={subtask2block}
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
    Waiting: { name: 'subtask-awaiting', color: 'icon--color-yellow' },
    Timeout: { name: 'timeout', color: 'icon--color-red' },
    Failed: { name: 'failure', color: 'icon--color-red' },
    Finished: { name: 'finished', color: 'icon--color-green' },
    Negotiating: { name: 'subtasks-negotiations', color: 'icon--color-yellow' },
    Verifying: { name: 'subtask-verifying', color: 'icon--color-gray' },
    Downloading: { name: 'download', color: 'icon--color-blue' },
    Restarted: { name: 'refresh', color: 'icon--color-blue' }
};
