import React from 'react';
import PropTypes from 'prop-types';
import { taskStatus } from "./../../../../../constants/statusDicts";

const RestartOptions = ({ handleOptionChange, status }) => {
	return (
		<div className="container__restart-options">
			<span className="title__restart-modal">Task restart options</span>
			<div
				className="restart-task__radio-group"
				onChange={handleOptionChange}>
				<div>
					<input
						type="radio"
						id="wholeTask"
						value="whole"
						name="restart"
						defaultChecked
					/>
					<label htmlFor="wholeTask">
						<span className="overlay" />
						Restart whole task as a new one
					</label>
				</div>
				<div>
					<input
						type="radio"
						id="pickTask"
						value="pick"
						name="restart"
						disabled={
							status === taskStatus.FINISHED ||
							status === taskStatus.COMPUTING
						}
					/>
					<label htmlFor="pickTask">
						<span className="overlay" />
						Restart only timed out subtasks
					</label>
				</div>
			</div>
		</div>
	);
};

RestartOptions.displayName = 'RestartOptions';

RestartOptions.propTypes = {
	handleOptionChange: PropTypes.func,
	status: PropTypes.string
};

export default RestartOptions;
