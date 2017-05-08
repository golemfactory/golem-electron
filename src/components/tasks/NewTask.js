import React from 'react'
import { Link } from 'react-router'

export default class NewTask extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
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
            </div>
        );
    }
}
