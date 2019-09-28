import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NodeTable from './NodeTable';

import * as Actions from './../../../actions';
import ConditionalRender from '../../hoc/ConditionalRender';
import BlockNodeModal from './../../tasks/modal/BlockNodeModal';

import map from 'lodash/map';
import size from 'lodash/size';
import some from 'lodash/some';
import every from 'lodash/every';
import keyBy from 'lodash/keyBy';
import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import mapValues from 'lodash/mapValues';

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
            blockNodeModal: false,
            checkedItems: {},
            errMsg: null,
            isAllChecked: false,
            isAnyChecked: false,
            nodeBlocked: false,
            node2block: null
        };
    }

    componentDidMount() {
        this._fillCheckedItemsIfEmpty(this.props);
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            isEmpty(this.props.nodeListACL?.rules) &&
            !isEmpty(nextProps.nodeListACL?.rules)
        ) {
            this._fillCheckedItemsIfEmpty(nextProps);
        }
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

    _fillCheckedItemsIfEmpty = props => {
        const { rules } = props.nodeListACL;
        const checkedItems = mapValues(keyBy(rules, 'identity'), () => false);
        this.setState({ checkedItems });
    };

    _showBlockNodeModal = node =>
        this.setState({
            blockNodeModal: true,
            node2block: node,
            nodeBlocked: false
        });

    _closeBlockNodeModal = () =>
        this.setState({ blockNodeModal: false, node2block: null });

    _handleACLCheckbox = e => this.props.handleACLCheckbox(e.target.checked);

    _unlockNodes = () => {
        const selectedNodes = Object.keys(
            pickBy(this.state.checkedItems, item => !!item)
        );
        this._toggleLockNode(null, selectedNodes);
    };

    _blockNodes = () => {
        const selectedNodes = Object.keys(
            pickBy(this.state.checkedItems, item => !!item)
        );
        this._toggleLockNode(null, selectedNodes);
    };

    _toggleLockNode = (e, nodes) => {
        const node = nodes || this.state?.node2block?.identity;
        new Promise((resolve, reject) => {
            if (this.props.aclRestrictedMode)
                this.props.actions.blockNodes(node, resolve, reject);
            else this.props.actions.trustNodes(node, resolve, reject);
        })
            .then(() => {
                this.setState({
                    checkedItems: pickBy(
                        this.state.checkedItems,
                        item => !item
                    ),
                    nodeBlocked: true
                });
            })
            .catch(error => {
                this.setState({
                    nodeBlocked: false
                });
            });
    };

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
        const { nodeListACL } = this.props;
        const keyList = map(nodeListACL?.rules, item => item.identity);
        this._toggleItems(keyList, true);
    };

    render() {
        const {
            blockNodeModal,
            checkedItems,
            errMsg,
            isAllChecked,
            isAnyChecked,
            nodeBlocked,
            node2block
        } = this.state;
        const {
            list,
            addNodePanelToggle,
            aclRestrictedMode,
            nodeListACL
        } = this.props;
        const { rules = [] } = nodeListACL;
        return (
            <Fragment>
                <div className="description">
                    <span>
                        <b>With Open mode</b> (blacklist) you are connected to
                        all nodes in the network. This mode allowes you to block
                        specific nodes and exclude them from interacting with
                        you.
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
                    <ConditionalRender showIf={size(rules) > 0 && isAnyChecked}>
                        <span
                            onClick={
                                aclRestrictedMode
                                    ? this._blockNodes
                                    : this._unlockNodes
                            }
                            className="acl__action-item">
                            {aclRestrictedMode ? 'Remove' : 'Unlock'} Selected
                        </span>
                    </ConditionalRender>
                    <span
                        onClick={addNodePanelToggle}
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
                        showBlockNodeModal={this._showBlockNodeModal}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={size(rules) < 1}>
                    <div className="no-data">No available data.</div>
                </ConditionalRender>
                {blockNodeModal &&
                    ReactDOM.createPortal(
                        <BlockNodeModal
                            cancelAction={this._closeBlockNodeModal}
                            blockAction={this._toggleLockNode}
                            nodeBlocked={nodeBlocked}
                            unlockMode={true}
                            aclMode={aclRestrictedMode}
                            errMsg={errMsg}
                            node2block={node2block}
                        />,
                        document.getElementById('modalPortal')
                    )}
            </Fragment>
        );
    }
}


/*<div className="switch-box">
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

<br />
<span>
    <b>Restricted mode</b> (whitelist) you create your own
    trusted network only with those nodes that you specify.
</span>*/

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlPanel);
