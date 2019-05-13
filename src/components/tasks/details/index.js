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
        const { actions, id, updateIf } = this.props;
        let interval = () => {
            actions.getFragments(id);
            return interval;
        };
        if (updateIf) this.liveSubList = setInterval(interval(), 2000);
        else actions.getFragments(id);
    }

    componentWillUnmount() {
        this.liveSubList && clearInterval(this.liveSubList);
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextState.checkedItems !== this.state.checkedItems &&
            size(
                filter(
                    nextProps.fragments,
                    item =>
                        item[item.length - 1] &&
                        item[item.length - 1].subtask_id
                )
            ) === size(nextState.checkedItems)
        ) {
            const isAllChecked = every(
                nextState.checkedItems,
                item => item === true
            );
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
        const { id, fragments } = this.props;
        const keyList = map(
            fragments,
            item => item[item.length - 1] && item[item.length - 1].subtask_id
        );
        this._toggleItems(keyList, true);
    };

    _lockScroll(isLocked) {
        this.props.overflowRef.style.setProperty(
            'overflow-y',
            isLocked ? 'hidden' : 'overlay',
            'important'
        );
    }

    _showBlockNodeModal(subtask) {
        this.setState(
            {
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

    render() {
        const { id, fragments } = this.props;
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
                    <div className="details__subtask-action">
                        <span onClick={this._toggleAll}>
                            {isAllChecked ? 'Deselect All' : 'Select All'}{' '}
                            Subtasks
                        </span>
                        {isAnyChecked && <span>Restart Selected</span>}
                    </div>
                    <SubtaskList
                        list={fragments}
                        checkedItems={checkedItems}
                        toggleItems={this._toggleItems}
                        showBlockNodeModal={this._showBlockNodeModal}
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
                    )
                }
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
