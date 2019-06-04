import React from 'react';
import PropTypes from 'prop-types';
import { taskStatus } from "./../../../../../constants/statusDicts";

const SubtaskInformation = ({ status }) => {
	return (
		<div>
			<span>Restart subtask</span>
		</div>
	);
};

SubtaskInformation.displayName = 'SubtaskInformation';

SubtaskInformation.propTypes = {
	status: PropTypes.string
};

export default SubtaskInformation;
