import React from 'react';
import uuid from 'uuid/v4';
import _ from 'lodash-es';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions';

const mapStateToProps = state => ({
    directoryTree: state.create.directoryTree
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

let NODE_DEEPNESS = 0;

export class MasterFilePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [props.directoryTree],
            filterByFileName: null,
            selectedMasterNode: null,
            taskName: null,
            type: props.match.params.type
        };
    }

    _handleNextButton = e => {
        e.preventDefault();
        this._nextStep = true;
        const { selectedMasterNode, taskName, type } = this.state;
        this.props.actions.createTask({
            main_scene_file: selectedMasterNode,
            taskName
        });
        window.routerHistory.push({
            pathname: `/add-task/type/${type || ''}`,
            query: { masterFile: true }
        });
    };

    _handleChange = nodes => this.setState({ nodes });

    _selectMasterFile = node => 
            this.setState({ 
                selectedMasterNode: node.absolutePath, 
                taskName: node.name 
            });

    _toggleExpandState = node => (node.state.expanded = !node.state.expanded);

    _filterableNodes = nodes => {
        const filterFor = this.state.filterByFileName;
        const _filterNodes = _nodes =>
            _nodes.filter(node => {
                if (node.isDir) {
                    node.children = _filterNodes(node.children);
                    return true;
                } else if (node.name.includes(filterFor)) return true;
            });
        const filteredNodes = !!filterFor
            ? _filterNodes(_.cloneDeep(nodes))
            : nodes;
        return (
            <div className="directory-nodes__container" key="filteredContent">
                <div>
                    <input
                        className="directory-nodes__filter-input"
                        placeholder="Search..."
                        onChange={e => {
                            this.setState({
                                filterByFileName: e.target.value
                            });
                        }}
                    />
                </div>
                <div className="directory-tree">
                    {filteredNodes &&
                        this._loadNodes(filteredNodes, NODE_DEEPNESS)}
                </div>
            </div>
        );
    };

    _loadNodes = (nodes, deepness) => {
        return nodes.map(node => {
            return (
                <div
                    style={{ marginLeft: deepness ? 20 : 0 }}
                    key={node.id}
                    className="directory-nodes__item">
                    {node.isDir ? (
                        <span
                            className={`icon-arrow-${
                                node.state.expanded ? 'down' : 'right'
                            }`}
                            onClick={e => {
                                node.state.expanded = !node.state.expanded;
                                this.setState({
                                    // TODO find healty way to update state
                                    test: null
                                });
                            }}>
                            <span className="icon-folder" />
                        </span>
                    ) : (
                        <span
                            className={
                                node.ext == this.state.type
                                    ? 'icon-blender'
                                    : 'icon-file'
                            }
                        >
                            <span className="path1"/>
                            <span className="path2"/>
                            <span className="path3"/>
                            <span className="path4"/>
                        </span>
                    )}
                    {node.isDir ? (
                        <span> {node.name} </span>
                    ) : (
                        <span>
                            <input
                                type="radio"
                                name="masterFile"
                                className="master-file-picker__radio"
                                id={`btnControl-${node.id}`}
                            />
                            <label
                                className="btn"
                                htmlFor={`btnControl-${node.id}`}
                                onClick={this._selectMasterFile.bind(
                                    null,
                                    node
                                )}>
                                {node.name}
                            </label>
                        </span>
                    )}
                    {node.isDir &&
                        node.state.expanded &&
                        this._loadNodes(node.children, deepness + 1)}
                </div>
            );
        });
    };

    render() {
        const { nodes, selectedMasterNode } = this.state;
        return (
            <form
                className="master-file-picker__content"
                onSubmit={this._handleNextButton}>
                <div className="master-file-picker__container">
                    {this._filterableNodes(nodes)}
                </div>
                <div className="master-file-picker__container-action">
                    <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                        <span>Cancel</span>
                    </Link>
                    <button
                        ref="nextButton"
                        type="submit"
                        className="btn--primary"
                        disabled={!selectedMasterNode}>
                        Next
                    </button>
                </div>
            </form>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MasterFilePicker);
