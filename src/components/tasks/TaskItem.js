import React from 'react';
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

import { Motion, spring } from 'react-motion';
import { convertSecsToHMS, timeStampToHR } from './../../utils/secsToHMS'

import * as Actions from '../../actions'

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

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class TaskItem extends React.Component {


    constructor(props) {
        super(props);

        this._fetchStatus = ::this._fetchStatus
    }

    /**
     * [_fetchStatus func. populate status of the task]
     * @param  {Object}     item    [Task item]
     * @return {DOM}                [Element of the status]
     */
    _fetchStatus(item) {
    	const {options} = item

        switch (item.status) {
        case status.TIMEOUT:
            return <div className="duration">
            	<span>Task time: 1d 4h 22m</span>
            	<span> | </span>
            	<span className="duration--timeout">Timed out: </span>
            	<span>Date mockup</span>
            	<div className="info__task">
            		<div>
            			<span>Frames: {(options && options.frames) || 0}</span>
            			<span> | </span>
            			<span> Resolution: {(options && options.resolution.join("x")) || 0}</span>
            			<span> | </span>
            			<span>Locked: 30 GNT/0.0002 ETH</span>
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

        case status.NOTREADY:
            return <span className="duration duration--preparing">Preparing...</span>

        case status.WAITING:
            return <span className="duration duration--preparing">Waiting...</span>

        case status.RESTART:
            return <span className="duration duration--done">Restarted</span>

        case status.COMPUTING:
            return <span className="duration duration--active">{convertSecsToHMS(item.duration)} Duration</span>

        default:
            return <span className="duration duration--finished">{timeStampToHR(item.time_started)} | {item.status}</span>
        }
    }

    render() {
    	const {item, index, _handleRowClick, _handleRestart, _handleDeleteModal} = this.props
        return (
        	<Motion defaultStyle={{
                progress: 0
            }} style={{
                progress: spring(item.progress, {
                    stiffness: 50,
                    damping: 7
                })
            }} role="listItem" tabIndex="-1">
            {value => <div className="wrapper-task-item"><div className="task-item" style={{
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
                        {this._fetchStatus(item)}
                    </div>
                </div>
                <div className="control-panel__task">
                	<ReactTooltip overlayClassName="black" placement="right" trigger={['hover']} overlay={<p>Preview</p>} mouseEnterDelay={.5} align={{
	                    offset: [10, 0],
	                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-eye" tabIndex="0" aria-label="Preview" onClick={_handleDeleteModal}></span>
                    </ReactTooltip>
                    <Link to={`/task/${item.id}`} tabIndex="0" aria-label="Task Details"><span className="icon-arrow-right"></span></Link>
                    {item.status == status.TIMEOUT &&
	                <ReactTooltip overlayClassName="black" placement="right" trigger={['hover']} overlay={<p>Restart</p>} mouseEnterDelay={.5} align={{
	                    offset: [10, 0],
	                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-reload" tabIndex="0" aria-label="Restart Task" onClick={_handleRestart}></span>
                    </ReactTooltip> }
                    <ReactTooltip overlayClassName="black" placement="right" trigger={['hover']} overlay={<p>Delete</p>} mouseEnterDelay={.5} align={{
                    offset: [10, 0],
                }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                        <span className="icon-trash" tabIndex="0" aria-label="Open Delete Task Popup" onClick={_handleDeleteModal}></span>
                    </ReactTooltip>
                </div>
            </div></div>}
            </Motion>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskItem)