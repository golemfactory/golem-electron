import React from "react";
import PropTypes from "prop-types";

import SubtaskItem from "./SubtaskItem";

const SubtaskList = ({ list, checkedItems, toggleItems }) => {
	return (
		<ul>
			{list.map((item, key) => (
				<SubtaskItem
					item={item}
					key={key.toString()}
					keyItem={key.toString()}
					checkedItems={checkedItems}
					toggleItems={toggleItems}
				/>
			))}
		</ul>
	);
};

SubtaskList.displayName = "SubtaskList";

SubtaskList.propTypes = {
	list: PropTypes.array,
	checkedItems: PropTypes.object,
	toggleItems: PropTypes.func
};

export default SubtaskList;
