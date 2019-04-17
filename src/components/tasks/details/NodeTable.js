import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import NodeRow from './NodeRow';

const NodeTable = ({ list }) => {
	return (
		<table className="fragment__node-table">
			<thead>
				<tr>
					<th scope="col">Job ID</th>
					<th scope="col">Status</th>
					<th scope="col">Node Name</th>
					<th scope="col">Logs</th>
					<th scope="col">Block/Unblock</th>
				</tr>
			</thead>
			<tbody>
				{map(list, (item, key) => (
					<NodeRow
						item={item}
						key={key.toString()}
						keyItem={key.toString()}
					/>
				))}
			</tbody>
		</table>
	);
};

NodeTable.displayName = 'NodeTable';

NodeTable.propTypes = {
	list: PropTypes.array.isRequired
};

export default NodeTable;