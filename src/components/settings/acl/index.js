import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from './../../../actions';

import ControlPanel from './ControlPanel';
import AddNodePanel from './AddNodePanel';
import SelectNodePanel from './SelectNodePanel';
import ConditionalRender from '../../hoc/ConditionalRender';

const mapStateToProps = state => ({
    nodeListACL: state.acl.nodeListACL
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

function isRuleSwitchOn(props) {
    return props.nodeListACL?.default_rule !== 'allow';
}

export class ACL extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addNodeModal: false,
            aclRestrictedMode: isRuleSwitchOn(props)
        };
    }

    componentDidMount() {
        this.setState({
            aclRestrictedMode: isRuleSwitchOn(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.nodeListACL?.default_rule !==
            this.props.nodeListACL?.default_rule
        ) {
            this.setState({
                aclRestrictedMode: isRuleSwitchOn(nextProps)
            });
        }
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

    _addNodePanelToggle = e => {
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
                        addNodePanelToggle={this._addNodePanelToggle}
                        aclRestrictedMode={aclRestrictedMode}
                        handleACLCheckbox={this._handleACLCheckbox}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={addNodeModal && !aclRestrictedMode}>
                    <SelectNodePanel
                        addNodePanelToggle={this._addNodePanelToggle}
                        aclRestrictedMode={aclRestrictedMode}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={addNodeModal && aclRestrictedMode}>
                    <AddNodePanel
                        addNodePanelToggle={this._addNodePanelToggle}
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
