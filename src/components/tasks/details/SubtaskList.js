import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import SubtaskItem from './SubtaskItem';

const SubtaskList = ({ lockCheckbox, list, checkedItems, toggleItems, showBlockNodeModal, restartSubtask }) => {
	return (
		<ul>
			{map(list, (item, key) => (
				<SubtaskItem
					lockCheckbox={lockCheckbox}
					item={item}
					key={key.toString()}
					keyItem={key.toString()}
					checkedItems={checkedItems}
					toggleItems={toggleItems}
					restartSubtask={restartSubtask}
					showBlockNodeModal={showBlockNodeModal}
				/>
			))}
		</ul>
	);
};

SubtaskList.displayName = 'SubtaskList';

SubtaskList.propTypes = {
	list: PropTypes.object.isRequired,
	checkedItems: PropTypes.object.isRequired,
	toggleItems: PropTypes.func.isRequired
};

export default SubtaskList;
