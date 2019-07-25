import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NodeTable from './NodeTable';

import * as Actions from './../../../actions';
import ConditionalRender from '../../hoc/ConditionalRender';

import map from 'lodash/map';
import size from 'lodash/size';
import some from 'lodash/some';
import someFP from 'lodash/fp/some';
import every from 'lodash/every';
import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/fp/includes';

const WAIT_INTERVAL = 500;

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    knownPeers: state.acl.knownPeers
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const includesValue = val => someFP(includes(val));

export class SelectNodePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedItems: {},
            isAnyChecked: false,
            blockNodeModal: false,
            nodeBlocked: false,
            errMsg: null,
            subtask2block: null,
            filteredList: props.knownPeers
        };
    }

    componentWillUnmount() {
        this.interactionTimer && clearTimeout(this.interactionTimer);
    }

    componentWillUpdate(nextProps, nextState) {
        if (!isEqual(nextState.checkedItems, this.state.checkedItems)) {
            const isAnyChecked = some(
                nextState.checkedItems,
                item => item === true
            );

            if (nextState.isAnyChecked !== isAnyChecked) {
                this.setState({
                    isAnyChecked
                });
            }
        }
    }

    _blockNodes = e => {};

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

    _filterList = e => {
        this.interactionTimer && clearTimeout(this.interactionTimer);
        const { knownPeers } = this.props
        if(!e.target.value) {
            this.setState({ filteredList: knownPeers });
            return;
        }

        const filteredList = pickBy(
            knownPeers,
            includesValue(e.target.value)
        );

        this.interactionTimer = setTimeout(() => {
            this.setState({ filteredList });
        }, WAIT_INTERVAL);
    };

    render() {
        const { checkedItems, isAnyChecked, filteredList } = this.state;
        const { addNode, knownPeers } = this.props;
        return (
            <Fragment>
                <div className="description">
                    <span>
                        Add to the blacklist any node from the all known seeds
                        list. Known seeds are all nodes that you have interacted
                        with in the past.
                    </span>
                </div>
                <div>
                    <input
                        type="text"
                        className="input__search-node"
                        placeholder="Search node..."
                        onChange={this._filterList}
                    />
                </div>
                <div className="acl__action">
                    <ConditionalRender showIf={isAnyChecked}>
                        <span
                            onClick={this._blockNodes}
                            className="acl__action-item">
                            Block Selected
                        </span>
                    </ConditionalRender>
                    <span
                        onClick={addNode}
                        className="acl__action-item acl__action__add-node">
                        <span
                            className="icon-back"
                            style={{
                                transform: 'rotate(90deg)',
                                marginBottom: '2px'
                            }}
                        />
                        Back
                    </span>
                </div>
                <ConditionalRender showIf={size(knownPeers) > 0}>
                    <NodeTable
                        list={filteredList}
                        checkedItems={checkedItems}
                        toggleItems={this._toggleItems}
                        isBlockTable={true}
                    />
                </ConditionalRender>
                <ConditionalRender showIf={size(filteredList) < 1}>
                    <div className="no-data">No available data.</div>
                </ConditionalRender>
            </Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectNodePanel);
