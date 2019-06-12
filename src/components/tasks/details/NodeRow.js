import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@tippy.js/react';

const { ipcRenderer, clipboard } = window.electron;

const NodeRow = ({ item, showBlockNodeModal }) => {
	const [ isDataCopied, setCopyStatus ] = useState(false);
	let copyTimeout;

	useEffect(() => {
		return () => {
			copyTimeout && clearTimeout(copyTimeout)
		}
	}, [])

	const _handleOpenFile = (path, parentFolder) =>
		ipcRenderer.send('open-file', path, parentFolder);

	const _showBlockNodeModal = subtask => showBlockNodeModal(subtask);

	const _copyField = item => {
		if (item) {
            clipboard.writeText(item);
                	
            setCopyStatus(true);
            copyTimeout = setTimeout(() => {
                setCopyStatus(false);
            }, 3000);
        }
	}

	return (
		<tr className="fragment__node-row">
			<td align="center">
				<Tooltip
                    content={
                        <p>
                            {isDataCopied
                                ? 'Copied Succesfully!'
                                : 'Click to copy ID'}
                        </p>
                    }
                    placement="top"
                    trigger="mouseenter"
                    hideOnClick={false}>
						<span className="id-info" onClick={_copyField.bind(null, item.subtask_id)}>
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
                            {isDataCopied
                                ? 'Copied Succesfully!'
                                : 'Click to copy ID'}
                        </p>
                    }
                    placement="top"
                    trigger="mouseenter"
                    hideOnClick={false}>
						<span className="id-info" onClick={_copyField.bind(null, item.node_id)}>
							{item.node_name || "Anonymous"}
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
