import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import NodeRow from './NodeRow';

const NodeTable = ({ aclRestrictedMode, list, checkedItems, toggleItems, showBlockNodeModal, restartSubtask }) => {
	return (
		<table className="fragment__node-table">
			<thead>
				<tr>
					<th scope="col" width="15%"></th>
					<th scope="col" width="26%">Node ID</th>
					<th scope="col" width="46%">Node Name</th>
					<th scope="col" width="50px">{aclRestrictedMode ? 'Delete' : 'Unlock'}</th>
				</tr>
			</thead>
			<tbody>
				{map(list, (item, key) => (
					<NodeRow
						item={item}
						key={key.toString()}
						keyItem={key.toString()}
						toggleItems={toggleItems}
						aclRestrictedMode={aclRestrictedMode}
						showBlockNodeModal={showBlockNodeModal}
					/>
				))}
			</tbody>
		</table>
	);
};

NodeTable.displayName = 'NodeTable';

NodeTable.propTypes = {
	list: PropTypes.object.isRequired,
	checkedItems: PropTypes.object.isRequired,
	toggleItems: PropTypes.func.isRequired
};

export default NodeTable;
