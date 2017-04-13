import React from 'react';
import { findDOMNode } from 'react-dom'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Motion, spring } from 'react-motion';

import * as Actions from '../../actions'
import blender_logo from './../../assets/img/blender_logo.png'


const mapStateToProps = state => ({
    blender_data: state.realTime.blender
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

    /**
     * [convertSecsToHrsMinsSecs function to format seconds as hh:mm:ss]
     * @param  {int}        sec     [seconds]
     * @return {String}             [hh:mm:ss]
     */
    convertSecsToHrsMinsSecs(sec) {
        let minutes = Math.trunc(sec / 60);
        let seconds = sec % 60;
        let hours = Math.trunc(minutes / 60);

        minutes = minutes % 60;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return hours + ':' + minutes + ':' + seconds;
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
            }}>
            {value => <div className="wrapper-task-item"><div className="task-item" style={{
                    background: item.progress < 100 ? `linear-gradient(90deg, #E3F3FF ${value.progress}%, transparent ${value.progress}%)` : 'transparent'
                }}>
                <div className="info__task-item" onClick = { e => this._handleRowClick(e, item, index)} >
                    <div>
                        <span className="task-icon icon-blender">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                        </span>
                    </div>
                    <div>
                        <h4>{item.name}</h4>
                        <span className={`duration ${item.progress < 100 ? 'duration--active' : 'duration--done'}`}>{this.convertSecsToHrsMinsSecs(item.duration)} {item.progress < 100 ? 'Duration' : ' | 3.15PM Yesterday'} </span>
                    </div>
                </div>
                <div>
                    <span className="icon-trash"></span>
                    <Link to={`/task/${item.id}`}><span className="icon-arrow-right"></span></Link>
                </div>
            </div></div>}
            </Motion>
        );

        return (
            <div className="task-list">{data.length > 0 && listItems}</div>
        )
    }

    render() {
        const {blender_data} = this.props

        return (
            <div>
                {blender_data && this.listTasks(blender_data)}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)