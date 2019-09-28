import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@tippy.js/react';

const { ipcRenderer, clipboard } = window.electron;
let copyTimeoutList = [];

const NodeRow = ({ item, showBlockNodeModal }) => {
	const [isNodeCopied, setCopyNodeStatus] = useState(false);
	const [isSubtaskCopied, setCopySubtaskStatus] = useState(false);

	useEffect(() => {
		return () => {
			copyTimeoutList.map(item => clearTimeout(item));
		};
	}, []);

	const _handleOpenFile = (path, parentFolder) =>
		ipcRenderer.send('open-file', path, parentFolder);

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
		<tr className="fragment__node-row">
			<td align="center">
				<Tooltip
					content={
						<p>
							{isSubtaskCopied
								? 'Copied Succesfully!'
								: 'Click to copy ID'}
						</p>
					}
					placement="top"
					trigger="mouseenter"
					hideOnClick={false}
					size="small">
					<span
						className="id-info"
						onClick={_copyField.bind(
							null,
							item.subtask_id,
							isSubtaskCopied,
							setCopySubtaskStatus
						)}>
						{item.subtask_id.replace(
							new RegExp('^(.{0,12}).*(.{2})$', 'im'),
							'$1...$2'
						)}
					</span>
				</Tooltip>
			</td>
			<td align="center">{item.status}</td>
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
						className="id-info"
						onClick={_copyField.bind(
							null,
							item.node_id,
							isNodeCopied,
							setCopyNodeStatus
						)}>
						{item.node_name || 'Unknown'}
					</span>
				</Tooltip>
			</td>
			<td align="center">
				<span
					className="icon-logs"
					onClick={_handleOpenFile.bind(null, item.stdout, true)}
				/>
			</td>
			<td align="center">
				<span
					className={`icon-locked ${
						item?.node_id ? '' : 'icon--disabled'
					}`}
					onClick={
						item?.node_id
							? _showBlockNodeModal.bind(null, item)
							: undefined
					}
				/>
			</td>
		</tr>
	);
};

NodeRow.displayName = 'NodeRow';

NodeRow.propTypes = {
	item: PropTypes.object.isRequired
};

export default NodeRow;
