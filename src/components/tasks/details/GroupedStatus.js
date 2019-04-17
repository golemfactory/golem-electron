import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/map';

const fpMap = require('lodash/fp/map').convert({ cap: false });

const GroupedStatus = ({ subtasksList }) => {
	const currentList = map(subtasksList, item =>
		item.length > 0 ? item[item.length - 1] : {status: 'Not Started'}
	);
	const groupedStatuses = flow([
		groupBy('status'),
		fpMap((items, name) => {
			return { status: name, count: items.length };
		})
	])(currentList);
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

GroupedStatus.displayName = 'GroupedStatus';

GroupedStatus.propTypes = {
	subtasksList: PropTypes.object
};

export default GroupedStatus;
