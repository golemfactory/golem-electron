import React from 'react';
import PropTypes from 'prop-types';
import { taskStatus } from "./../../../../../constants/statusDicts";

const SubtaskInformation = ({ item }) => {
	const num = item?.subtask_ids.length || 0; 
	const denum = item?.subtasks_count || 0; 
	return (
		<div className="subtask-info">
			<span>
				Restarting selected subtasks:
				<br/>
				<b>Subtask amount: {num +'/'+ denum}</b>
			</span>
		</div>
	);
};

SubtaskInformation.displayName = 'SubtaskInformation';

SubtaskInformation.propTypes = {
	item: PropTypes.object
};

export default SubtaskInformation;
