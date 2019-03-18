import React from "react";
import PropTypes from "prop-types";
import flow from "lodash/fp/flow";
import groupBy from "lodash/fp/groupBy";

const map = require("lodash/fp/map").convert({ cap: false });

const GroupedStatus = ({ subtasksList }) => {
	const groupedStatuses = flow([
		groupBy("status"),
		map((items, name) => {
			return { status: name, count: items.length };
		})
	])(subtasksList);
	return (
		<div className="details__subtask-stats">
			{groupedStatuses &&
				groupedStatuses.map((item, key) => (
					<span key={key}>
						{item.status}: {item.count}
					</span>
				))}
		</div>
	);
};

GroupedStatus.displayName = "GroupedStatus";

GroupedStatus.propTypes = {
	subtasksList: PropTypes.array
};

export default GroupedStatus;
