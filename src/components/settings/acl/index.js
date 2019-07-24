import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NodeTable from './NodeTable';

import * as Actions from './../../../actions';
import ConditionalRender from '../../hoc/ConditionalRender';

import map from 'lodash/map';
import size from 'lodash/size';
import some from 'lodash/some';
import every from 'lodash/every';
import isEqual from 'lodash/isEqual';

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mockNodeList = {
    test: {
        subtask_id: 'subtask 1',
        node_id: 'node 1',
        node_name: 'node name'
    },
    test1: {
        subtask_id: 'subtask 2',
        node_id: 'node 2',
        node_name: 'node name2'
    },
    test2: {
        subtask_id: 'subtask 3',
        node_id: 'node 3',
        node_name: 'node name3'
    }
};

export class ACL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedItems: {},
            isAllChecked: false,
            isAnyChecked: false,
            blockNodeModal: false,
            nodeBlocked: false,
            errMsg: null,
            subtask2block: null,
            aclRestrictedMode: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (!isEqual(nextState.checkedItems, this.state.checkedItems)) {
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
    }

    _handleACLCheckbox = e =>
        this.setState({ aclRestrictedMode: e.target.checked });

    _toggleAll = e => {};

    _unlockNodes = e => {};

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
        const keyList = map(mockNodeList, item => item.node_id);
        this._toggleItems(keyList, true);
    };

    render() {
        const {
            aclRestrictedMode,
            checkedItems,
            isAllChecked,
            isAnyChecked
        } = this.state;
        return (
            <div className="content__acl">
                <div className="switch-box">
                    <span
                        className={`switch-label switch-label--left ${
                            !aclRestrictedMode ? 'active' : ''
                        }`}>
                        Open mode
                    </span>
                    <label className="switch">
                        <input
                            ref="concentRef"
                            type="checkbox"
                            aria-label="Task Based Concent Checkbox"
                            tabIndex="0"
                            checked={aclRestrictedMode}
                            onChange={this._handleACLCheckbox}
                        />
                        <div className="switch-slider round" />
                    </label>
                    <span
                        className={`switch-label switch-label--right ${
                            aclRestrictedMode ? 'active' : ''
                        }`}>
                        Restricted mode
                    </span>
                </div>
                <div className="description">
                    <span>
                        <b>With Open mode</b> (blacklist) you are connected to
                        all nodes in the network. This mode allowes you to block
                        specific nodes and exclude them from interacting with
                        you.
                    </span>
                    <br />
                    <span>
                        <b>Restricted mode</b> (whitelist) you create your own
                        trusted network only with those nodes that you specify.
                    </span>
                </div>
                <div className="acl__action">
                    <ConditionalRender showIf={size(mockNodeList) > 0}>
                        <span
                            onClick={this._toggleAll}
                            className="acl__action-item">
                            {isAllChecked ? 'Deselect All' : 'Select All'} Nodes
                        </span>
                    </ConditionalRender>
                    <ConditionalRender showIf={isAnyChecked}>
                        <span
                            onClick={this._unlockNodes}
                            className="acl__action-item">
                            {aclRestrictedMode ? 'Remove' : 'Unlock'} Selected
                        </span>
                    </ConditionalRender>
                    <span
                        onClick={this._unlockNodes}
                        className="acl__action-item acl__action__add-node">
                        <span className="icon-add" />
                        Add Node
                    </span>
                </div>
                <ConditionalRender showIf={size(mockNodeList) > 0}>
                    <NodeTable
                        list={mockNodeList}
                        checkedItems={checkedItems}
                        toggleItems={this._toggleItems}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={size(mockNodeList) < 1}>
                    <div className="no-data">No available data.</div>
                </ConditionalRender>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ACL);
