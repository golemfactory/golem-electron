import React from "react";
import { Link } from "react-router";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Actions from "../../../actions";
import ConditionalRender from "../../hoc/ConditionalRender";
import GroupedStatus from "./GroupedStatus";
import SubtaskList from "./SubtaskList";

import every from "lodash/every";
import size from "lodash/size";

const mapStateToProps = state => ({
    frameCount: state.preview.ps.frameCount,
    subtasksList: state.single.subtasksList
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Details extends React.Component {
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

    render() {
        const { id, subtasksList } = this.props;
        const { checkedItems, isAllChecked } = this.state;
        return (
            <div className="details__section">
                <ConditionalRender showIf={subtasksList[id]}>
                    <GroupedStatus subtasksList={subtasksList[id]} />
                    <div className="details__subtask-action">
                        <span onClick={this._toggleAll}>
                            {isAllChecked ? "Deselect All" : "Select All"}
                        </span>
                        <span>Restart</span>
                    </div>
                    <SubtaskList
                        list={subtasksList[id]}
                        checkedItems={checkedItems}
                        toggleItems={this._toggleItems}
                    />
                </ConditionalRender>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Details);
