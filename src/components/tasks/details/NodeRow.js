import React, { useState } from 'react';
import PropTypes from 'prop-types';

const { ipcRenderer } = window.electron;

const NodeRow = ({ item, showBlockNodeModal }) => {
	const _handleOpenFile = (path, parentFolder) =>
		ipcRenderer.send('open-file', path, parentFolder);

	const _showBlockNodeModal = subtask => showBlockNodeModal(subtask);

	return (
		<tr className="fragment__node-row">
			<td align="center">
				{item.subtask_id.replace(
					new RegExp('^(.{0,12}).*(.{2})$', 'im'),
					'$1...$2'
				)}
			</td>
			<td align="center">{item.status}</td>
			<td align="center">{item.node_name || "Anonymous"}</td>
			<td align="center">
				<span
					className="icon-logs"
					onClick={_handleOpenFile.bind(null, item.stdout, true)}
				/>
			</td>
			<td align="center">
				<span
					className="icon-locked"
					onClick={_showBlockNodeModal.bind(null, item)}
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
