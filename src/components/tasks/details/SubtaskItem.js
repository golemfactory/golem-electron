import React from 'react';
import PropTypes from 'prop-types';

import NodeTable from './NodeTable';
import { ICONS } from './';

import ConditionalRender from '../../hoc/ConditionalRender';

class SubtaskItem extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			showNodeList: false
		};
	}

	toggleNodeList = e => {
		const expandButton = e.target;
		expandButton.classList.toggle('arrow-expand');
		this.setState({
			showNodeList: !this.state.showNodeList
		});
	};

	/**
	 * [_handleRestartModal sends information of the clicked task as callback]
	 * @param  {Any}        id      [Id of the selected task]
	 */
	_handleRestartModal(id) {
		this.props.restartSubtask(id);
	}

	render() {
		const {
			lockCheckbox,
			item,
			keyItem,
			checkedItems,
			toggleItems,
			restartSubtask,
			showBlockNodeModal
		} = this.props;
		const { showNodeList } = this.state;
		const recentInfo = item[item.length - 1];

		return (
			<li
				key={keyItem}
				className="container-checkbox__details checkbox-group">
				<div className="checkbox-item">
					<input
						id={`taskTypeRadio${keyItem}`}
						type="checkbox"
						name="taskType"
						value={recentInfo?.subtask_id}
						onChange={() =>
							toggleItems.call(null, [recentInfo?.subtask_id])
						}
						checked={
							checkedItems[recentInfo && recentInfo.subtask_id] ||
							false
						}
						disabled={!recentInfo || lockCheckbox}
						readOnly
						required
					/>
					<label
						htmlFor={`taskTypeRadio${keyItem}`}
						className="checkbox-label-left">
						<span className="overlay" />
						<span className="info-subtask-number"><b>Subtask number: </b> {keyItem.padStart(4, '0')}</span>
						<span className="bumper" />
						<b>State: </b>{' '}
						{recentInfo ? (
							<span
								className={`icon-${
									ICONS[(recentInfo?.status)]?.name
								} ${ICONS[(recentInfo?.status)]?.color}`}
							/>
						) : (
							<span className="icon-subtask-awaiting icon--color-gray"/>
						)}
					</label>
					<div className="checkbox-item__action">
						<span
							className={`icon-refresh ${
								lockCheckbox ? 'disabled' : ''
							}`}
							onClick={this._handleRestartModal.bind(
								this,
								recentInfo?.subtask_id
							)}
						/>
						<span
							className={`icon-arrow-down ${
								!recentInfo ? 'disabled' : ''
							}`}
							onClick={
								item.length > 0
									? this.toggleNodeList
									: undefined
							}
						/>
					</div>
				</div>
				<ConditionalRender showIf={showNodeList && item.length > 0}>
					<NodeTable
						list={item}
						showBlockNodeModal={showBlockNodeModal}
					/>
				</ConditionalRender>
			</li>
		);
	}
}

SubtaskItem.displayName = 'SubtaskItem';

SubtaskItem.propTypes = {
	item: PropTypes.array.isRequired,
	keyItem: PropTypes.string.isRequired,
	checkedItems: PropTypes.object.isRequired,
	toggleItems: PropTypes.func.isRequired
};

export default SubtaskItem;
