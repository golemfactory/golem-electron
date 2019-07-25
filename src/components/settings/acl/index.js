import React from 'react';

import ControlPanel from './ControlPanel';
import AddNodePanel from './AddNodePanel';
import SelectNodePanel from './SelectNodePanel';
import ConditionalRender from '../../hoc/ConditionalRender';

const mockNodeList = {
    test: {
        subtask_id: 'subtask 1',
        node_id: 'node 1',
        node_name: 'node name',
        ip_address: 'test1',
        port: '40102'
    },
    test1: {
        subtask_id: 'subtask 2',
        node_id: 'node 2',
        node_name: 'node name2',
        ip_address: 'test2',
        port: '40103'
    },
    test2: {
        subtask_id: 'subtask 3',
        node_id: 'node 3',
        node_name: 'node name3',
        ip_address: 'test3',
        port: '40104'
    },
    test3: {
        subtask_id: 'subtask 4',
        node_id: 'node 4',
        node_name: 'node name4',
        ip_address: 'test4',
        port: '40105'
    },
    test4: {
        subtask_id: 'subtask 5',
        node_id: 'node 5',
        node_name: 'node name5',
        ip_address: 'test5',
        port: '40106'
    },
    test5: {
        subtask_id: 'subtask 6',
        node_id: 'node 6',
        node_name: 'node name6',
        ip_address: 'test6',
        port: '40107'
    },
    test6: {
        subtask_id: 'subtask 7',
        node_id: 'node 7',
        node_name: 'node name7',
        ip_address: 'test7',
        port: '40108'
    },
    test7: {
        subtask_id: 'subtask 8',
        node_id: 'node 8',
        node_name: 'node name8',
        ip_address: 'test8',
        port: '40109'
    }
};

export default class ACL extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addNodeModal: false,
            aclRestrictedMode: false
        };
    }

    _handleACLCheckbox = value => {
        new Promise((resolve, reject) => {
            this.props.actions.setACLMode(
                [!!value ? 'deny' : 'allow', []],
                resolve,
                reject
            );
        }).then(result => {
            this.setState({ aclRestrictedMode: value });
        });
    };

    _addNode = e => {
        this.setState(prevState => ({
            addNodeModal: !prevState.addNodeModal
        }));
    };

    render() {
        const { addNodeModal, aclRestrictedMode } = this.state;
        return (
            <div className="content__acl">
                <ConditionalRender showIf={!addNodeModal}>
                    <ControlPanel
                        list={mockNodeList}
                        addNode={this._addNode}
                        aclRestrictedMode={aclRestrictedMode}
                        handleACLCheckbox={this._handleACLCheckbox}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={addNodeModal && !aclRestrictedMode}>
                    <SelectNodePanel
                        list={mockNodeList}
                        addNode={this._addNode}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={addNodeModal && aclRestrictedMode}>
                    <AddNodePanel
                        list={mockNodeList}
                        addNode={this._addNode}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
            </div>
        );
    }
}
