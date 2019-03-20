import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/Concent01';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class TaskSummaryModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.closeModal("taskSummaryModal")

    _handleApply = e => this.props._handleStartTaskButton()

    render() {
        const {status, resolution, frames, samples, format, task_timeout, subtasks_count, subtask_timeout, render_on, bid} = this.props
        return (
            <div className="container__modal task-summary-modal__container">
                <div className="content__modal task-summary-modal__content">
                    <div className="task-summary-modal__section-image">
                        <Lottie options={defaultOptions}/>
                    </div>
                    <div className="summary__title">Confirm your task settings</div>
                    <div className="summary__list">
                        <div className="summary__item">
                            <span className="title">Resolution:</span>
                            <span className="value">{`${resolution[0]}x${resolution[1]}`}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Frames:</span>
                            <span className="value">{frames}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Samples:</span>
                            <span className="value">{samples}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Format:</span>
                            <span className="value">{format}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Task Timeout:</span>
                            <span className="value">{task_timeout}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Subtask Amount:</span>
                            <span className="value">{subtasks_count}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Subtask Timeout:</span>
                            <span className="value">{subtask_timeout}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Render on:</span>
                            <span className="value">{render_on}</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Minimum provider score:</span>
                            <span className="value">231</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Total:</span>
                            <span className="value">{bid} GNT</span>
                        </div>
                        <div className="summary__item">
                            <span className="title">Tx fee lock:</span>
                            <span className="value">0.003 ETH</span>
                        </div>
                    </div>
                    <div className="task-summary-modal__action">
                        <span className="btn--cancel" onClick={this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={this._handleApply} autoFocus>Start Task</button>
                    </div>
                </div>
            </div>
        );
    }
}
