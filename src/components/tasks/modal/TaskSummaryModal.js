import React from 'react';

export default class TaskSummaryModal extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.closeModal()

    _handleApply = e => {}

    render() {
        const {status} = this.props
        return (
            <div className="task-summary-modal__container">
                <div className="task-summary-modal__content">
                    <div>
                        <span className="icon-progress-clockwise"/>
                    </div>
                    <div>
                        <div>
                            <div>
                                <span className="title">Resolution:</span>
                                <span className="value">123x123</span>
                            </div>
                            <div>
                                <span className="title">Frames:</span>
                                <span className="value">1-2</span>
                            </div>
                            <div>
                                <span className="title">Samples:</span>
                                <span className="value">300</span>
                            </div>
                            <div>
                                <span className="title">Format:</span>
                                <span className="value">300</span>
                            </div>
                            <div>
                                <span className="title">Task Timeout:</span>
                                <span className="value">0d 23h 00m</span>
                            </div>
                            <div>
                                <span className="title">Subtask Amount:</span>
                                <span className="value">22</span>
                            </div>
                            <div>
                                <span className="title">Subtask Timeout:</span>
                                <span className="value">0d 2d 00m</span>
                            </div>
                            <div>
                                <span className="title">Render on:</span>
                                <span className="value">CPU</span>
                            </div>
                            <div>
                                <span className="title">Minimum provider score:</span>
                                <span className="value">231</span>
                            </div>
                            <div>
                                <span className="title">Total:</span>
                                <span className="value">0.3 GNT</span>
                            </div>
                            <div>
                                <span className="title">Tx fee lock:</span>
                                <span className="value">0.003 ETH</span>
                            </div>
                        </div>
                    </div>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={this._handleApply} autoFocus>Start Task</button>
                    </div>
                </div>
            </div>
        );
    }
}
