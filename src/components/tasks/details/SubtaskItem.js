import React from 'react';
import PropTypes from 'prop-types';

const SubtaskItem = ({ item, keyItem, checkedItems, toggleItems }) => {
	const recentInfo = item[item.length - 1];
	return (
		<li key={keyItem} className="container-checkbox__details">
			<div className="checkbox-item">
				<input
					id={`taskTypeRadio${keyItem}`}
					type="checkbox"
					name="taskType"
					value={recentInfo && recentInfo.subtask_id}
					onChange={() => toggleItems.call(null, [recentInfo && recentInfo.subtask_id])}
					checked={checkedItems[recentInfo && recentInfo.subtask_id] || false}
					disabled={!recentInfo}
					readOnly
					required
				/>
				<label
					htmlFor={`taskTypeRadio${keyItem}`}
					className="checkbox-label-left">
					<b>Subtask number: </b> {keyItem}
					<span className="bumper" />
					<b>Progress: </b> {recentInfo ? recentInfo.progress * 100 : 0}%
					<span className="bumper" />
					<b>State: </b> {recentInfo ? recentInfo.status : "Not started"}
				</label>
				<div className="checkbox-item__action">
					<span className="icon-progress-clockwise" />
					<span className="icon-arrow-down" />
				</div>
			</div>
		</li>
	);
};

SubtaskItem.displayName = 'SubtaskItem';

SubtaskItem.propTypes = {
	item: PropTypes.array,
	keyItem: PropTypes.string,
	checkedItems: PropTypes.object,
	toggleItems: PropTypes.func
};

export default SubtaskItem;
