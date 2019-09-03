import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@tippy.js/react';

import ConditionalRender from '../../hoc/ConditionalRender';

const { ipcRenderer, clipboard } = window.electron;
let copyTimeoutList = [];

const NodeRow = ({
	aclRestrictedMode,
	isBlockTable,
	isChecked,
	item,
	keyItem,
	toggleItems,
	showBlockNodeModal
}) => {
	const [isNodeCopied, setCopyNodeStatus] = useState(false);
	const [isSubtaskCopied, setCopySubtaskStatus] = useState(false);

	useEffect(() => {
		return () => {
			copyTimeoutList.map(item => clearTimeout(item));
		};
	}, []);

	const _showBlockNodeModal = subtask => showBlockNodeModal(subtask);

	const _copyField = (item, isDataCopied, setDataCopy) => {
		if (copyTimeoutList[item] && isDataCopied) return;

		if (item) {
			clipboard.writeText(item);

			setDataCopy(prevData => !prevData);
			copyTimeoutList[item] = setTimeout(() => {
				setDataCopy(prevData => !prevData);
				clearTimeout(copyTimeoutList[item]);
				copyTimeoutList[item] = null;
			}, 2000);
		}
	};

	return (
		<tr className="fragment__node-row checkbox-group">
			<td>
				<div className="checkbox-item">
					<input
						id={`taskTypeRadio${keyItem}`}
						type="checkbox"
						name="taskType"
						value={item?.key}
						checked={isChecked}
						onChange={() => toggleItems.call(null, [item?.key])}
						readOnly
						required
					/>
					<label
						htmlFor={`taskTypeRadio${keyItem}`}
						className="checkbox-label-left">
						<span className="overlay" />
						<span />
					</label>
				</div>
			</td>
			<td align="center">
				<Tooltip
					content={
						<p>
							{isNodeCopied
								? 'Copied Succesfully!'
								: 'Click to copy ID'}
						</p>
					}
					placement="top"
					trigger="mouseenter"
					hideOnClick={false}
					size="small">
					<span
						className="info__id"
						onClick={_copyField.bind(
							null,
							item.node_id,
							isNodeCopied,
							setCopyNodeStatus
						)}>
						{(item?.key || item.node_id)?.replace(
							new RegExp('^(.{0,4}).*(.{4})$', 'im'),
							'$1...$2'
						)}
					</span>
				</Tooltip>
			</td>
			<ConditionalRender showIf={isBlockTable}>
				<td align="center">
					<span className="info__id">{item.pub_addr}</span>
				</td>
				<td align="center">
					<span className="info__id">{item.p2p_pub_port}</span>
				</td>
			</ConditionalRender>
			<td align="center">
				<Tooltip
					content={
						<p>
							{isNodeCopied
								? 'Copied Succesfully!'
								: 'Click to copy ID'}
						</p>
					}
					placement="top"
					trigger="mouseenter"
					hideOnClick={false}
					size="small"
					isEnabled={!!item?.node_name}>
					<span
						className={`info__name ${
							aclRestrictedMode ? 'info__name--restricted' : ''
						}`}
						onClick={_copyField.bind(
							null,
							item.node_id,
							isNodeCopied,
							setCopyNodeStatus
						)}>
						{item.node_name || 'Anonymous'}
					</span>
				</Tooltip>
			</td>
			<td align="center">
				<span
					className={
						aclRestrictedMode
							? 'icon-delete'
							: isBlockTable
							? 'icon-unlocked'
							: 'icon-locked'
					}
					onClick={_showBlockNodeModal.bind(null, item)}
				/>
			</td>
		</tr>
	);
};

NodeRow.displayName = 'NodeRow';

NodeRow.propTypes = {
	item: PropTypes.oneOfType([
		PropTypes.object.isRequired,
		PropTypes.array.isRequired
	])
};

export default NodeRow;
