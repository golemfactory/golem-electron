import React from 'react';
import { Link } from 'react-router'
import _ from 'lodash-es';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'
import ConditionalRender from '../hoc/ConditionalRender'

const mapStateToProps = state => ({
    frameCount: state.preview.ps.frameCount,
    subtasksList: state.single.subtasksList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Preview extends React.Component {


    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let interval = ()=> {
            this.props.actions.fetchSubtasksList(this.props.id)
            return interval
        }
        this.liveSubList = setInterval(interval(), 2000)
    }

    _loadSubtaskList = (list = []) => 
        <div>
            {
                list.map(( item, key ) => 
                    (
                        <div key={key} className="container-checkbox__details">
                            <div className="checkbox-item">
                                <input id={`taskTypeRadio${key}`} type="checkbox" name="taskType" value={key} readOnly required/>
                                <label htmlFor={`taskTypeRadio${key}`} className="checkbox-label-left"><b>Subtask number: </b> {key} | <b>Progress: </b>  {item.progress * 100}% | <b>State: </b> {item.status}</label>
                            </div>
                        </div>)
                    )
            }
        </div>

    render() {
        const {id, subtasksList} = this.props;
        const groupedStatuses = 
            _.chain(subtasksList[id])
            .groupBy('status')
            .map((items, name) => ({status: name, count: items.length}))
            .value();
        return (
            <div className="details__section">
                <ConditionalRender showIf={subtasksList[id]}>
                    <div className="details__subtask-stats">
                        {
                            groupedStatuses
                            .map( (item, key) => <span key={key}>{item.status}: {item.count}</span>)
                        }
                    </div>
                    <div className="details__subtask-action">
                        <span>Select All</span>
                        <span>Restart</span>
                    </div>
                    <ul>
                        {
                            this._loadSubtaskList(subtasksList[id])
                        }
                    </ul>
                </ConditionalRender>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)