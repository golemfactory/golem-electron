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
            			<div className="radio-item__new-task">
            				<span className="icon-blender">
            					<span className="path1"/>
            					<span className="path2"/>
            					<span className="path3"/>
            				</span>
            				<span>Blender</span>
            				<input type="radio" name="taskType"/>
            			</div>
            			<div className="radio-item__new-task">
            				<span className="icon-luxrenderer"/>
            			<span>LuxRender</span>
            				<input type="radio" name="taskType"/>
            			</div>
            		</div>
            	</div>
            	<div className="container-action__new-task">
            		<span>Cancel</span>
            		<Link to="/task/settings"><button className="btn--primary">Next</button></Link>
            	</div>
            </div>
        );
    }
}
