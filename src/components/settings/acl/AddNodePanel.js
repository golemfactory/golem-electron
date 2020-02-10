import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NodeTable from './NodeTable';

import * as Actions from './../../../actions';
import ConditionalRender from '../../hoc/ConditionalRender';

const { clipboard } = window.electron;

const WAIT_INTERVAL = 200;

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class AddNodePanel extends React.Component {
    state = {
        existError: false,
        node: null,
        lockAddButton: false
    };

    componentDidMount() {
        document.getElementById('addNode').addEventListener(
            'contextmenu',
            ev => {
                ev.preventDefault();
                ev.target.value = clipboard.readText();
                this._updateId.call(this, ev);
                return false;
            },
            false
        );
    }

    componentWillUnmount() {
        this.interactionTimer && clearTimeout(this.interactionTimer);
    }

    _handleInput = e => {
        e.persist();
        this._updateId.call(this, e);
    };

    _updateId = e => {
        this.interactionTimer && clearTimeout(this.interactionTimer);
        this.interactionTimer = setTimeout(() => {
            this.setState({ node: e.target.value });
        }, WAIT_INTERVAL);
    };

    _handleAdd = () => {
        this.setState(
            {
                lockAddButton: true
            },
            () => {
                this.trustNodes(this.state.node).then(([result, _]) => {
                    const [info, msg] = result;
                    if (info) this.props.addNodePanelToggle();
                    else
                        this.setState({
                            existError: true,
                            lockAddButton: false
                        });
                });
            }
        );
    };

    trustNodes = node =>
        new Promise((resolve, reject) =>
            this.props.actions.trustNodes(node, resolve, reject)
        );

    render() {
        const { existError, lockAddButton, node } = this.state;
        const { addNodePanelToggle } = this.props;
        return (
            <Fragment>
                <div className="description">
                    <span>
                        Create your own trusted network only with those nodes
                        that you specify.
                        <br />
                        You can add nodes by typing their node ID below.
                    </span>
                </div>
                <div className="input-field__add-node">
                    <label htmlFor="addNode">Node ID</label>
                    <input
                        id="addNode"
                        type="text"
                        className={`input__add-node ${
                            existError ? 'input--error' : ''
                        }`}
                        placeholder="Add node ID..."
                        onChange={this._handleInput}
                    />
                    {existError && (
                        <span className="exist-error">
                            This node is already exist in whitelist{' '}
                        </span>
                    )}
                </div>
                <div className="acl__action acl__action--center">
                    <span onClick={addNodePanelToggle}>Cancel</span>
                    <button
                        onClick={this._handleAdd}
                        className="btn btn--primary"
                        disabled={lockAddButton || !node}>
                        Add
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNodePanel);
