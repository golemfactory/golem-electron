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
    _handleRestartModal(id, status) {
        this.props.restartModalHandler(id, status, this._handleRestart);
    }

	render() {
		const { item, keyItem, checkedItems, toggleItems, showBlockNodeModal } = this.props;
		const { showNodeList } = this.state;
		const recentInfo = item[item.length - 1];

		return (
			<li key={keyItem} className="container-checkbox__details checkbox-group">
				<div className="checkbox-item">
					<input
						id={`taskTypeRadio${keyItem}`}
						type="checkbox"
						name="taskType"
						value={recentInfo?.subtask_id}
						onChange={() =>
							toggleItems.call(null, [
								recentInfo?.subtask_id
							])
						}
						checked={
							checkedItems[recentInfo && recentInfo.subtask_id] ||
							false
						}
						disabled={!recentInfo}
						readOnly
						required
					/>
					<label
						htmlFor={`taskTypeRadio${keyItem}`}
						className="checkbox-label-left">
						<span className="overlay"/>
						<b>Subtask number: </b> {keyItem}
						<span className="bumper" />
						<b>Progress: </b>{' '}
						{recentInfo?.progress * 100 || 0}%
						<span className="bumper" />
						<b>State: </b>{' '}
						{<span className={`icon-${ICONS[recentInfo?.status]?.name} ${ICONS[recentInfo?.status]?.color}`}/>|| 'Not started'}
					</label>
					<div className="checkbox-item__action">
						<span className="icon-refresh" onClick={this._handleRestartModal.bind(this, recentInfo?.subtask_id)}/>
						<span
							className="icon-arrow-down"
							onClick={
								item.length > 0
									? this.toggleNodeList
									: undefined
							}
						/>
					</div>
				</div>
				<ConditionalRender showIf={showNodeList && item.length > 0}>
					<NodeTable list={item} showBlockNodeModal={showBlockNodeModal}/>
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