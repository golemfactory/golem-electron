import React from 'react';

import ControlPanel from './ControlPanel';
import AddNodePanel from './AddNodePanel';
import SelectNodePanel from './SelectNodePanel';
import ConditionalRender from '../../hoc/ConditionalRender';

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
                        addNode={this._addNode}
                        aclRestrictedMode={aclRestrictedMode}
                        handleACLCheckbox={this._handleACLCheckbox}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={addNodeModal && !aclRestrictedMode}>
                    <SelectNodePanel
                        addNode={this._addNode}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={addNodeModal && aclRestrictedMode}>
                    <AddNodePanel
                        addNode={this._addNode}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
            </div>
        );
    }
}
