import React from "react";
import { Link } from "react-router";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Actions from "../../actions";
import ConditionalRender from "../hoc/ConditionalRender";

import flow from "lodash/fp/flow";
import groupBy from "lodash/fp/groupBy";
import every from "lodash/every";
import size from "lodash/size";
const map = require("lodash/fp/map").convert({ cap: false });

const mapStateToProps = state => ({
    frameCount: state.preview.ps.frameCount,
    subtasksList: state.single.subtasksList
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedItems: {},
            isAllChecked: false
        };
    }

    componentDidMount() {
        let interval = () => {
            this.props.actions.fetchSubtasksList(this.props.id);
            return interval;
        };
        this.liveSubList = setInterval(interval(), 2000);
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextState.checkedItems !== this.state.checkedItems &&
            nextProps.subtasksList[nextProps.id].length ===
                size(nextState.checkedItems)
        ) {
            const isAllChecked = every(
                nextState.checkedItems,
                item => item === true
            );
            if (nextState.checkedItems !== isAllChecked) {
                this.setState({
                    isAllChecked
                });
            }
        }
    }

    _toggleItems = (keys, val = null) => {
        const tempObj = { ...this.state.checkedItems };
        keys.forEach(
            key =>
                (tempObj[key] =
                    val !== null ? !this.state.isAllChecked : !tempObj[key])
        );
        this.setState({
            checkedItems: tempObj
        });
    };

    _toggleAll = () => {
        const { id, subtasksList } = this.props;
        const keyList = subtasksList[id].map(item => item.subtask_id);
        this._toggleItems(keyList, true);
    };

    _loadSubtaskList = (list = [], checkedItems) => (
        <div>
            {list.map((item, key) => (
                <div key={key} className="container-checkbox__details">
                    <div className="checkbox-item">
                        <input
                            id={`taskTypeRadio${key}`}
                            type="checkbox"
                            name="taskType"
                            value={item.subtask_id}
                            onChange={() =>
                                this._toggleItems.call(null, [item.subtask_id])
                            }
                            checked={
                                this.state.checkedItems[item.subtask_id] ||
                                false
                            }
                            readOnly
                            required
                        />
                        <label
                            htmlFor={`taskTypeRadio${key}`}
                            className="checkbox-label-left"
                        >
                            <b>Subtask number: </b> {key}
                            <span className="bumper" />
                            <b>Progress: </b> {item.progress * 100}%
                            <span className="bumper" />
                            <b>State: </b> {item.status}
                        </label>
                        <div className="checkbox-item__action">
                            <span className="icon-progress-clockwise" />
                            <span className="icon-arrow-down" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { id, subtasksList } = this.props;
        const { checkedItems, isAllChecked } = this.state;
        const groupedStatuses = flow([
            groupBy("status"),
            map((items, name) => {
                return { status: name, count: items.length };
            })
        ])(subtasksList[id]);
        return (
            <div className="details__section">
                <ConditionalRender showIf={subtasksList[id]}>
                    <div className="details__subtask-stats">
                        {groupedStatuses &&
                            groupedStatuses.map((item, key) => (
                                <span key={key}>
                                    {item.status}: {item.count}
                                </span>
                            ))}
                    </div>
                    <div className="details__subtask-action">
                        <span onClick={this._toggleAll}>
                            {isAllChecked ? "Deselect All" : "Select All"}
                        </span>
                        <span>Restart</span>
                    </div>
                    <ul>
                        {this._loadSubtaskList(subtasksList[id], checkedItems)}
                    </ul>
                </ConditionalRender>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Preview);
