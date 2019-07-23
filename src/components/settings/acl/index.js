import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NodeTable from './NodeTable';

import * as Actions from './../../../actions';
import ConditionalRender from '../../hoc/ConditionalRender';

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

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

    _handleACLCheckbox = e => this.setState({aclRestrictedMode: e.target.checked});

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

    render() {
        const { aclRestrictedMode, checkedItems } = this.state;
        return (
            <div className="content__acl">
                {false && <div className="no-data">No available data.</div>}
                <div className="switch-box">
                    <span className={`switch-label switch-label--left ${!aclRestrictedMode ? 'active' : ''}`}>
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
                    <span className={`switch-label switch-label--right ${aclRestrictedMode ? 'active' : ''}`}>
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
                    <span
                        onClick={this._toggleAll}
                        className="acl__action-item">
                        {false ? 'Deselect All' : 'Select All'} Nodes
                    </span>
                    {true && (
                        <span
                            onClick={this._unlockNodes}
                            className="acl__action-item">
                            {aclRestrictedMode ? "Remove" : "Unlock"} Selected
                        </span>
                    )}
                    <span
                        onClick={this._unlockNodes}
                        className="acl__action-item acl__action__add-node">
                        <span className="icon-add" />
                        Add Node
                    </span>
                </div>
                <ConditionalRender showIf={true}>
                    <NodeTable
                        list={{
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
                        }}
                        checkedItems={checkedItems}
                        toggleItems={this._toggleItems}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ACL);
