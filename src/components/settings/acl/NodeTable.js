import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import NodeRow from './NodeRow';
import ConditionalRender from '../../hoc/ConditionalRender';

const NodeTable = ({
	aclRestrictedMode = false,
	list,
	checkedItems,
	toggleItems,
	showBlockNodeModal,
	isBlockTable = false
}) => {
	return (
		<table className="fragment__node-table">
			<thead>
				<tr>
					<th scope="col" width="10%" />
					<th scope="col">Node ID</th>
					<ConditionalRender showIf={isBlockTable}>
						<th scope="col">Node IP</th>
						<th scope="col">PORT</th>
					</ConditionalRender>
					<th scope="col" width="25%">
						Node Name
					</th>
					<th scope="col" width="50px">
						{aclRestrictedMode
							? 'Delete'
							: isBlockTable
							? 'Block'
							: 'Unlock'}
					</th>
				</tr>
			</thead>
			<tbody>
				{map(list, (item, key) => (
					<NodeRow
						item={item}
						key={key.toString()}
						isBlockTable={isBlockTable}
						isChecked={!!checkedItems[(item?.key || item?.identity)]}
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
	list: PropTypes.array.isRequired,
	checkedItems: PropTypes.object.isRequired,
	toggleItems: PropTypes.func.isRequired
};

export default NodeTable;
