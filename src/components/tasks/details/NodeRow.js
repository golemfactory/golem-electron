import React from 'react';
import PropTypes from 'prop-types';

const NodeRow = ({ item }) => {
	return (
		<tr className="fragment__node-row">
			<td align="center">
				{item.subtask_id.replace(
					new RegExp('^(.{0,12}).*(.{2})$', 'im'),
					'$1...$2'
				)}
			</td>
			<td align="center">{item.status}</td>
			<td align="center">{item.node_name}</td>
			<td align="center">
				<span className="icon-logs" />
			</td>
			<td align="center">
				<span className="icon-locked" />
			</td>
		</tr>
	);
};

NodeRow.displayName = 'NodeRow';

NodeRow.propTypes = {
	item: PropTypes.object.isRequired
};

export default NodeRow;
