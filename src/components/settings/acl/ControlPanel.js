import React, { Fragment } from 'react';
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
    nodeListACL: state.acl.nodeListACL
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class ControlPanel extends React.Component {
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

    _handleACLCheckbox = e => this.props.handleACLCheckbox(e.target.checked);

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
        const { list } = this.props;
        const keyList = map(list, item => item.node_id);
        this._toggleItems(keyList, true);
    };

    render() {
        const { checkedItems, isAllChecked, isAnyChecked } = this.state;
        const { list, addNode, aclRestrictedMode, nodeListACL } = this.props;
        const { rules = [] } = nodeListACL;
        return (
            <Fragment>
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
                    <ConditionalRender showIf={size(rules) > 0}>
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
                        onClick={addNode}
                        className="acl__action-item acl__action__add-node">
                        <span className="icon-add" />
                        Add Node
                    </span>
                </div>
                <ConditionalRender showIf={size(rules) > 0}>
                    <NodeTable
                        list={rules}
                        checkedItems={checkedItems}
                        toggleItems={this._toggleItems}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={size(rules) < 1}>
                    <div className="no-data">No available data.</div>
                </ConditionalRender>
            </Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlPanel);
