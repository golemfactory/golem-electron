import React from 'react'
import { Link } from 'react-router'
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
    }

    _closeModal() {
        const {actions} = this.props
        actions.setFileCheck({
            status: false
        });
    }

    render() {
        const {fileCheckModal} = this.props
        return (
            <div className="content__new-task">
                <div className="container-name__new-task">
                    <label>Task Name</label>
                    <input type="text" placeholder="Another Golem Task"/>
                </div>
                <div className="container-type__new-task">
                    <label>Task Type</label>
                    <div className="container-radio__new-task">
                        <div className="radio-item">
                            <span className="icon-blender">
                                <span className="path1"/>
                                <span className="path2"/>
                                <span className="path3"/>
                            </span>
                            <input id="taskTypeRadio1" type="radio" name="taskType"/>
                            <label htmlFor="taskTypeRadio1" className="radio-label">Blender</label>
                        </div>
                        <div className="radio-item">
                            <span className="icon-luxrenderer"/>
                            <input id="taskTypeRadio2" type="radio" name="taskType"/>
                            <label htmlFor="taskTypeRadio2" className="radio-label">LuxRender</label>
                        </div>
                        
                    </div>
                </div>
                <div className="container-action__new-task">
                    <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                        <span >Cancel</span>
                    </Link>
                    <Link to="/task/settings"><button className="btn--primary">Next</button></Link>
                </div>
                {fileCheckModal.status && <FileCheckModal closeModal={::this._closeModal} unknownFiles={fileCheckModal.files}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask)