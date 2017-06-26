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

export class NewTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'Golem Task',
            type: null
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

    /**
     * [_handleNameInput funcs. updates name of the new task]
     * @param  {Event}  e
     */
    _handleNameInput(e) {
        console.log(e.target.value)
        this.setState({
            name: e.target.value
        })
    }

    /**
     * [_handleTypeRadio funcs. updates type of the new task]
     * @param  {Event}  e
     */
    _handleTypeRadio(e) {
        console.log(e.target.value)
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
                        <input type="text" value={name} autoFocus onChange={::this._handleNameInput} required/>
                    </div>
                    <div className="container-type__new-task">
                        <label>Task Type</label>
                        <div className="container-radio__new-task" onChange={::this._handleTypeRadio}>
                            <div className="radio-item">
                                <span className="icon-blender">
                                    <span className="path1"/>
                                    <span className="path2"/>
                                    <span className="path3"/>
                                    <span className="path4"/>
                                </span>
                                <input id="taskTypeRadio1" type="radio" name="taskType" value="Blender" required/>
                                <label htmlFor="taskTypeRadio1" className="radio-label">Blender</label>
                            </div>
                            <div className="radio-item">
                                <span className="icon-luxrender"/>
                                <input id="taskTypeRadio2" type="radio" name="taskType" value="LuxRender"/>
                                <label htmlFor="taskTypeRadio2" className="radio-label">LuxRender</label>
                            </div>
                            
                        </div>
                    </div>
                    <div className="container-action__new-task">
                        <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                            <span >Cancel</span>
                        </Link>
                        <button type="submit" className="btn--primary" disabled={!type}>Next</button>
                    </div>
                </form>
                {fileCheckModal.status && <FileCheckModal closeModal={::this._closeModal} unknownFiles={fileCheckModal.files}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask)