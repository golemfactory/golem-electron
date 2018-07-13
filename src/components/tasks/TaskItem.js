import React from 'react';
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {Tooltip} from 'react-tippy';

import { Motion, spring } from 'react-motion';
import { convertSecsToHMS, timeStampToHR } from './../../utils/secsToHMS'

import * as Actions from '../../actions'

import Preview from './Preview'

const status = Object.freeze({
    WAITINGFORPEER: 'Waiting for peer',
    NOTREADY: 'Not started',
    READY: 'Ready',
    WAITING: 'Waiting',
    COMPUTING: 'Computing',
    FINISHED: 'Finished',
    TIMEOUT: 'Timeout',
    RESTART: 'Restart'
})

const ETH_DENOM = 10 ** 18;

const mapStateToProps = state => ({
    psId: state.preview.ps.id,
    subtasksList: state.single.subtasksList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class TaskItem extends React.Component {


    constructor(props) {
        super(props);

        this._fetchStatus = ::this._fetchStatus

        this.state = {
            toggledPreviewList: []
        }
    }

    componentDidMount() {
        const {actions, item} = this.props
        let interval = ()=> {
                actions.fetchSubtasksList(item.id)
                return interval
            }
            this.liveSubList = setInterval(interval(), 5000)
    }

    componentWillUnmount() {
        this.liveSubList && clearInterval(this.liveSubList)
    }

    _togglePreview({id}){
        const prevList = this.state.toggledPreviewList
        const prevToggle = this.state.toggledPreviewList[id];

        prevList[id] = !prevToggle
        this.props._toggleWalletTray(!prevToggle)

        this.setState({
            toggledPreviewList: prevList
        })
    }

    /**
     * [_fetchStatus func. populate status of the task]
     * @param  {Object}     item    [Task item]
     * @return {DOM}                [Element of the status]
     */
    _fetchStatus(item) {
    	const {options} = item
        const {subtasksList} = this.props

        switch (item.status) {
        case status.TIMEOUT:
            return <div>
            	<span>Task time: 1d 4h 22m</span>
            	<span> | </span>
            	<span className="duration--timeout">Timed out: </span>
            	<span>{timeStampToHR(item.last_updated)}</span>
            </div>

        case status.NOTREADY:
            return <div>
                <span>Duration: {convertSecsToHMS(item.duration)}</span>
                <span> | </span>
                <span className="duration--preparing">Preparing for computation... </span>
            </div>

        case status.WAITING:
            return <div>
                <span>Duration: {convertSecsToHMS(item.duration)}</span>
                <span> | </span>
                <span className="duration--preparing">Waiting for nodes... </span>
            </div>

        case status.RESTART:
            return <div>
                <span>Task time: 1d 4h 22m</span>
                <span> | </span>
                <span className="duration--restarted">Restarted </span>
            </div>

        case status.COMPUTING:
            return <div>
                <span>Duration: {convertSecsToHMS(item.duration)}</span>
                <span> | </span>
                <span className="duration--finished">Computing... </span>
                <span> | </span>
                <span>{subtasksList && subtasksList.length} Nodes</span>
            </div>

        default:
            return <div>
                <span>Task time: 1d 4h 22m</span>
                <span> | </span>
                <span className="duration--finished">Finished: </span>
                <span>{timeStampToHR(item.last_updated)}</span>
            </div>
        }
    }

    _fetchCost(item){
        const fixedTo = 4;
        return <span>{(item.cost && (item.cost / ETH_DENOM).toFixed(fixedTo)) || 
                      (item.estimated_cost / ETH_DENOM).toFixed(fixedTo)} GNT/
                     {item.fee && (item.fee / ETH_DENOM).toFixed(fixedTo) || 
                      (item.estimated_fee / ETH_DENOM).toFixed(fixedTo)} ETH</span>
    }

    render() {
    	const {item, index, _handleRowClick, _handleRestart, _handleDeleteModal, psId} = this.props
        const {toggledPreviewList} = this.state
        const {options} = item
        return (<Motion defaultStyle={{
                progress: 0
            }} style={{
                progress: spring(item.progress, {
                    stiffness: 50,
                    damping: 7
                })
            }} role="listItem" tabIndex="-1">
            {value => <div className="wrapper-task-item">
                <div className="task-item" style={{
                    background: item.progress < 1 ? `linear-gradient(90deg, #E3F3FF ${value.progress * 100}%, transparent ${value.progress * 100}%)` : 'transparent'
                }} onClick = { e => _handleRowClick(e, item, index)} >
                    <div className="info__task-item" tabIndex="0" aria-label="Task Preview">
                        <div>
                            <span className={`task-icon icon-${item.type.toLowerCase()}`}>
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                            </span>
                        </div>
                        <div>
                            <h4>{item.name}</h4>
                            <div className="duration">
                                {this._fetchStatus(item)}
                                <div className="info__task">
                                    <div>
                                        <span>Frames: {(options && options.frames) || 0}</span>
                                        <span> | </span>
                                        <span> Resolution: {(options && options.resolution.join("x")) || 0}</span>
                                        <span> | </span>
                                        <span>Cost: {this._fetchCost(item)}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Subtasks: {item.subtasks || 0}</span>
                                        <span> | </span>
                                        <span> Task timeout: {item.timeout}</span>
                                        <span> | </span>
                                        <span> Subtask timeout: {item.subtask_timeout}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="control-panel__task">
                        <Tooltip
                          html={<p>Preview</p>}
                          position="right"
                          trigger="mouseenter">
                            <span className="icon-eye" tabIndex="0" aria-label="Preview" onClick={this._togglePreview.bind(this, item)}></span>
                        </Tooltip>
                        <Tooltip
                          html={<p>Task Details</p>}
                          position="right"
                          trigger="mouseenter">
                            <Link to={`/task/${item && item.id}`} tabIndex="0" aria-label="Task Details"><span className="icon-info-small"></span></Link>
                        </Tooltip>
                        <Tooltip
                          html={<p>Restart</p>}
                          position="right"
                          trigger="mouseenter">
                            <span className="icon-reload" tabIndex="0" aria-label="Restart Task" onClick={_handleRestart}></span>
                        </Tooltip>
                        <Tooltip
                          html={<p>Delete</p>}
                          position="right"
                          trigger="mouseenter">
                            <span className="icon-trash" tabIndex="0" aria-label="Open Delete Task Popup" onClick={_handleDeleteModal}></span>
                        </Tooltip>
                    </div>
                </div>
                { (item.id === psId && toggledPreviewList[psId]) && <Preview id={item.id} src={item.preview}/>}
            </div>}
            </Motion>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem)