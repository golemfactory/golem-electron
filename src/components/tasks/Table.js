import React from 'react';
import { findDOMNode } from 'react-dom'
import { Link } from 'react-router'
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Motion, spring } from 'react-motion';

import * as Actions from '../../actions'
import blender_logo from './../../assets/img/blender_logo.png'
import convertSecsToHMS from './../../utils/secsToHMS'


const mapStateToProps = state => ({
    taskList: state.realTime.taskList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

/**
 * { Class for Table Component in Blender Component }
 *
 * @class      Table (name)
 */
export class Table extends React.Component {

    constructor(props) {
        super(props);
    }

    _handleRowClick(event, item, index) {
        console.log(event, item, index)
        return true
    }

    _handleDeleteModal() {
        this.props.deleteModalHandler()
    }

    /**
     * {listTasks function}
     * @param  {Array}    data    [JSON array of task list]
     * @return {Object}           [DOM of task list]
     *
     * @description [React-Motion]  https://github.com/chenglou/react-motion
     * React motion provides animation ability to elements.
     * Variable which will change with a rule, defining as a default style prop.
     * Result we want to get is defining as style prop with spring helper
     * {spring}
     *     @param {int}     stiffness   (optional)
     *     @param {int}     damping     (optional)
     *     @param {float}   precision   (optional)
     */
    listTasks(data) {
        const listItems = data.map((item, index) => <Motion key={index.toString()} defaultStyle={{
                progress: 0
            }} style={{
                progress: spring(item.progress, {
                    stiffness: 50,
                    damping: 7
                })
            }} role="listItem" tabIndex="-1">
            {value => <div className="wrapper-task-item"><div className="task-item" style={{
                    background: item.progress < 100 ? `linear-gradient(90deg, #E3F3FF ${value.progress}%, transparent ${value.progress}%)` : 'transparent'
                }}>
                <div className="info__task-item" onClick = { e => this._handleRowClick(e, item, index)} tabIndex="0" aria-label="Task Preview">
                    <div>
                        <span className="task-icon icon-blender">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                        </span>
                    </div>
                    <div>
                        <h4>{item.name}</h4>
                        <span className={`duration ${item.progress < 100 ? 'duration--active' : 'duration--done'}`}>{convertSecsToHMS(item.duration)} {item.progress < 100 ? 'Duration' : ' | 3.15PM Yesterday'} </span>
                    </div>
                </div>
                <div>
                    <ReactTooltip placement="bottom" trigger={['hover']} overlay={<p>Delete</p>} mouseEnterDelay={1} align={{
                    offset: [0, 10],
                }} transitionName="rc-tooltip-zoom" arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-trash" tabIndex="0" aria-label="Open Delete Task Popup" onClick={this._handleDeleteModal.bind(this, item.id)}></span>
                    </ReactTooltip>
                    <Link to={`/task/${item.id}`} tabIndex="0" aria-label="Task Details"><span className="icon-arrow-right"></span></Link>
                </div>
            </div></div>}
            </Motion>
        );

        return (
            <div className="task-list">{data.length > 0 && listItems}</div>
        )
    }

    render() {
        const {taskList} = this.props
        return (
            <div role="list">
                {taskList && this.listTasks(taskList)}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)