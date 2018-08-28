import React from 'react';
import {taskStatus} from './../../../constants/statusDicts'

export default class RestartModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isTimedOutOnly: false
        }
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel() {
        this.props.closeModal()
    }

    _handleRestartOptionChange(e){
        this.setState({
            isTimedOutOnly: e.target.value === "pick"
        })
    }

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleRestart() {
        const {restartCallback, restartId} = this.props
        const {isTimedOutOnly} = this.state
        restartCallback(restartId, isTimedOutOnly)
        this.props.closeModal()
    }

    render() {
        const {status} = this.props
        return (
            <div className="container__modal container__restart-modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-progress-clockwise"/>
                    </div>
                    <span className="title__restart-modal">Task restart options</span>
                    <div className="restart-task__radio-group" onChange={::this._handleRestartOptionChange}>
                        <div>
                            <input type="radio" id="wholeTask" value="whole" name="restart" defaultChecked />
                            <label htmlFor="wholeTask">
                                <span className="overlay"/>
                                Restart whole task as a new one
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="pickTask" value="pick" name="restart" disabled={status === taskStatus.FINISHED}/>
                            <label htmlFor="pickTask">
                                <span className="overlay"/>
                                Restart all timed out subtasks
                            </label>
                        </div>
                    </div>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={::this._handleRestart} autoFocus>Apply</button>
                    </div>
                </div>
            </div>
        );
    }
}
