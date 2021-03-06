import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/map';

import { ICONS } from './';

const fpMap = require('lodash/fp/map').convert({ cap: false });

function addUniq(arr, object, key) {
	var isExist = arr.some(item => item[key] == object[key]);
	if (isExist) return;
	arr.push(object);
}

const fillRestGroups = function(gs) {
	gs.forEach(item => addUniq(gs, item, 'status'));

	addUniq(gs, { status: 'Not Started', count: 0 }, 'status');
	addUniq(gs, { status: 'Cancelled', count: 0 }, 'status');
	addUniq(gs, { status: 'Failure', count: 0 }, 'status');
	addUniq(gs, { status: 'Finished', count: 0 }, 'status');
	addUniq(gs, { status: 'Starting', count: 0 }, 'status');
	addUniq(gs, { status: 'Verifying', count: 0 }, 'status');
	addUniq(gs, { status: 'Downloading', count: 0 }, 'status');
	addUniq(gs, { status: 'Restart', count: 0 }, 'status');

	return gs;
};

const GroupedStatus = ({ subtasksList }) => {
	const currentList = map(subtasksList, item =>
		item.length > 0 ? item[item.length - 1] : { status: 'Not Started' }
	);
	const groupedStatuses = flow([
		groupBy('status'),
		fpMap((items, name) => {
			return { status: name, count: items.length };
		})
	])(currentList);
	fillRestGroups(groupedStatuses);
	return (
		<div className="details__subtask-stats">
			{groupedStatuses &&
				groupedStatuses.map((item, key) => (
					<span key={key}>
						<span
							className={`icon-${ICONS[item.status]?.name} ${
								ICONS[item.status]?.color
							}`}
						/>
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
