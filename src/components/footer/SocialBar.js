import React from 'react';
const { ipcRenderer } = window.electron;

const SocialBar = ({ version }) => {
	const versionTemplate = version?.error
		? version?.message || ''
		: `${version?.message || ''}${version?.number || ''}`;

	const _openLogs = () => {
		ipcRenderer.send('open-logs');
	};

	return (
		<div className="content__footer-social">
			<span className="element__footer" onClick={_openLogs}>
				<span className="icon-logs" />
				<u>open logs</u>
			</span>
			<a
				className="element__footer"
				href="https://www.github.com/golemfactory">
				<span className="icon-golem" />
				{versionTemplate}
			</a>
			<a className="element__footer" href="https://chat.golem.network">
				<span className="icon-chat" />
				<u>golem chat</u>
			</a>
		</div>
	);
};

SocialBar.displayName = 'SocialBar';

export default SocialBar;
