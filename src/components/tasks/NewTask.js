import React from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'
import FileCheckModal from './modal/FileCheckModal'
import InfoLabel from './../InfoLabel'

const mapStateToProps = state => ({
    fileCheckModal: state.info.fileCheckModal,
    taskName: state.create.task.taskName,
    relativePath: state.create.task.relativePath,
    isMainNet: state.info.isMainNet
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
            name: props.taskName || "Golem Task",
            type: radioTypes[this.props.match.params.type] || null
        }
        props.actions.clearTaskPlain() //clear previous test status
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.match.params.type !== this.props.match.params.type)
            this.setState({
                type: radioTypes[nextProps.match.params.type] || null
            })

        if(nextProps.taskName !== this.props.taskName){
            let taskName = nextProps.taskName && nextProps.taskName.split("."+ nextProps.match.params.type)[0];
            taskName = taskName && taskName.replace(/[^a-zA-Z0-9_\-\. ]/g, "");
             this.setState({
                name: (taskName && taskName.substring(0,24)) || "Golem Task"
            })
        }
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
        window.routerHistory.push('/task/settings')
    }

    render() {
        const {fileCheckModal, isMainNet, relativePath} = this.props
        const {name, type} = this.state
        return (
            <div>
                <form className="content__new-task" onSubmit={::this._handleNextButton}>
                    <div className="container-name__new-task">
                        <div className="label">
                            <InfoLabel type="h4" label="Name your task" info={<p className="tooltip_task">You can change your default file name</p>} distance={-20}/>
                        </div>
                        <span ref="taskNameHint" className="hint__task-name">{name.length < 4 ? "Task name should consists of at least 4 characters." : "Task name can contain; letter, number, space between characters, dot, dash and underscore."}</span>
                        <input type="text" value={name} pattern="^[a-zA-Z0-9_\-\.]+( [a-zA-Z0-9_\-\.]+)*$" minLength={4} maxLength={24} autoFocus onChange={::this._handleNameInput} required/>
                    </div>
                    <span className="source-path">{relativePath}</span>
                    <div className="container-type__new-task">
                        <div className="label">
                            <InfoLabel type="h4" label="Task Type" info={<p className="tooltip_task"><a href="">Learn more</a> how to prepare files for Golem</p>} distance={-20} interactive={true}/>
                        </div>
                        <div ref="radioCloud" className="container-radio__new-task" onChange={::this._handleTypeRadio}>
                            <div className="radio-item">
                                <span className="icon-blender">
                                    <span className="path1"/>
                                    <span className="path2"/>
                                    <span className="path3"/>
                                    <span className="path4"/>
                                </span>
                                <input id="taskTypeRadio1" type="radio" name="taskType" value="Blender" checked={type === radioTypes.blend} readOnly required/>
                                <label htmlFor="taskTypeRadio1" className="radio-label-right">Blender</label>
                            </div>
                            {true ? //disabled
                                undefined 
                                :
                                <div className="radio-item">
                                    <span className="icon-luxrender"/>
                                    <input id="taskTypeRadio2" type="radio" name="taskType" value="LuxRender" checked={type === radioTypes.lxs} readOnly/>
                                    <label htmlFor="taskTypeRadio2" className="radio-label-right">LuxRender</label>
                                </div>
                            }
                        </div>
                        <div className="hint__blender">
                        Supported render engines are: Blender Render and Cycles Render. Those are sellected automaticaly by Golem from your Blender file settings, so if you want to render with different engine please change settings inside your .blend file before uploading to Golem.
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