import React from "react";
import PropTypes from "prop-types";

const SubtaskItem = ({ item, keyItem, checkedItems, toggleItems }) => {
	return (
		<li key={keyItem} className="container-checkbox__details">
			<div className="checkbox-item">
				<input
					id={`taskTypeRadio${keyItem}`}
					type="checkbox"
					name="taskType"
					value={item.subtask_id}
					onChange={() => toggleItems.call(null, [item.subtask_id])}
					checked={checkedItems[item.subtask_id] || false}
					readOnly
					required
				/>
				<label
					htmlFor={`taskTypeRadio${keyItem}`}
					className="checkbox-label-left"
				>
					<b>Subtask number: </b> {keyItem}
					<span className="bumper" />
					<b>Progress: </b> {item.progress * 100}%
					<span className="bumper" />
					<b>State: </b> {item.status}
				</label>
				<div className="checkbox-item__action">
					<span className="icon-progress-clockwise" />
					<span className="icon-arrow-down" />
				</div>
			</div>
		</li>
	);
};

SubtaskItem.displayName = "SubtaskItem";

SubtaskItem.propTypes = {
	item: PropTypes.object,
	keyItem: PropTypes.string,
	checkedItems: PropTypes.object,
	toggleItems: PropTypes.func
};

export default SubtaskItem;
