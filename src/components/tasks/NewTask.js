import React from 'react'
import { Link, hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'
import FileCheckModal from './modal/FileCheckModal'

const mapStateToProps = state => ({
    fileCheckModal: state.info.fileCheckModal
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

const radioTypes = Object.freeze({
    blend: 'Blender',
    lxs: 'LuxRender'
})

export class NewTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'Golem Task',
            type: radioTypes[this.props.params.type] || null
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.params.type !== this.props.params.type)
            this.setState({
                type: radioTypes[nextProps.params.type] || null
            })
    }

    componentWillUnmount() {
        if (!this._nextStep) {
            this.props.actions.clearTaskPlain()
        }
    }

    /**
     * [_closeModal funcs. closes modals]
     */
    _closeModal() {
        const {actions} = this.props
        actions.setFileCheck({
            status: false
        });
    }

    checkInputValidity(e) {
        const {taskNameHint, nextButton} = this.refs
        e.target.checkValidity();
        if (e.target.validity.valid){
            taskNameHint.style.display = "none";
            nextButton.disabled = false
        }
        else{
            taskNameHint.style.display = "block";
            nextButton.disabled = true
        }
    }

    /**
     * [_handleNameInput funcs. updates name of the new task]
     * @param  {Event}  e
     */
    _handleNameInput(e) {
        //console.log(e.target.value)
        ::this.checkInputValidity(e)
        this.setState({
            name: e.target.value
        })
    }

    /**
     * [_handleTypeRadio funcs. updates type of the new task]
     * @param  {Event}  e
     */
    _handleTypeRadio(e) {
        //console.log(e.target.value)
        this.setState({
            type: e.target.value
        })
    }

    /**
     * [_handleNextButton funcs. redirect user to the next step]
     * @param  {Event}  e
     */
    _handleNextButton(e) {
        e.preventDefault();
        this._nextStep = true
        const {name, type} = this.state
        this.props.actions.createTask({
            name,
            type
        })
        hashHistory.push('/task/settings')
    }

    render() {
        const {fileCheckModal} = this.props
        const {name, type} = this.state
        return (
            <div>
                <form className="content__new-task" onSubmit={::this._handleNextButton}>
                    <div className="container-name__new-task">
                        <label>Task Name</label>
                        <span ref="taskNameHint" className="hint__task-name">{name.length < 4 ? "Task name should consists of at least 4 characters." : "Task name can contain; letter, number, space between characters, dot, dash and underscore."}</span>
                        <input type="text" value={name} pattern="^[a-zA-Z0-9_\-\.]+( [a-zA-Z0-9_\-\.]+)*$" minLength={4} maxLength={24} autoFocus onChange={::this._handleNameInput} required/>
                    </div>
                    <div className="container-type__new-task">
                        <label>Task Type</label>
                        <div ref="radioCloud" className="container-radio__new-task" onChange={::this._handleTypeRadio}>
                            <div className="radio-item">
                                <span className="icon-blender">
                                    <span className="path1"/>
                                    <span className="path2"/>
                                    <span className="path3"/>
                                    <span className="path4"/>
                                </span>
                                <input id="taskTypeRadio1" type="radio" name="taskType" value="Blender" checked={type === radioTypes.blend} readOnly required/>
                                <label htmlFor="taskTypeRadio1" className="radio-label">Blender</label>
                            </div>
                            <div className="radio-item">
                                <span className="icon-luxrender"/>
                                <input id="taskTypeRadio2" type="radio" name="taskType" value="LuxRender" checked={type === radioTypes.lxs} readOnly/>
                                <label htmlFor="taskTypeRadio2" className="radio-label">LuxRender</label>
                            </div>
                            <div className="radio-item">
                                <span className="icon-question-mark"/>
                                <input id="taskTypeRadio3" type="radio" name="taskType" value="Dummy"/>
                                <label htmlFor="taskTypeRadio3" className="radio-label">Dummy</label>
                            </div>
                        </div>
                    </div>
                    <div className="container-action__new-task">
                        <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                            <span >Cancel</span>
                        </Link>
                        <button ref="nextButton" type="submit" className="btn--primary" disabled={!type}>Next</button>
                    </div>
                </form>
                {fileCheckModal.status && <FileCheckModal closeModal={::this._closeModal} unknownFiles={fileCheckModal.files}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask)