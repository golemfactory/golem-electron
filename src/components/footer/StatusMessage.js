import React from 'react';
import Tooltip from '@tippy.js/react';
import DotAnim from "../DotAnim";

const { remote } = window.electron;
const currentPlatform = remote.getGlobal('process').platform;

const ISSUES = {
	PORT: {
		title: 'Problem with ports',
		message: 'The ports are unreachable',
		docs:
			'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=_1-smb-port-unreachable'
	},
	RAM: {
		title: 'RAM allocation lowered',
		message:
			'Golem could not allocate the configured amount of RAM on your machine. Allocation adjusted to ',
		docs:
			'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=ram-warning'
	},
	DISK: {
		title: 'Not enough DISK',
		message: "You don't have enough DISK",
		docs:
			'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=disk-space-warning'
	}
};

const loadErrorUrl = msg => {
	switch (msg) {
		case 'Error creating Docker VM': //docker
			return (
				<a
					href={
						currentPlatform === 'win32'
							? 'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=docker-errors-on-windows-10'
							: 'https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=docker-errors-on-macos'
					}>
					<span className="icon-new-window" />
				</a>
			);
		case 'Outdated hyperg version': //hyperg
			return (
				<a href="https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=outdated-hyperg-version">
					<span className="icon-new-window" />
				</a>
			);
		case 'Chain sync error': //sync
			return (
				<a href="https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=sync">
					<span className="icon-new-window" />
				</a>
			);
			break;
		case 'Error connecting geth': //geth
			return (
				<a href="https://docs.golem.network/#/Products/Brass-Beta/Issues-&-Troubleshooting?id=geth">
					<span className="icon-new-window" />
				</a>
			);
		default:
			break;
	}
};

function loadConnectionWarnings(
	status,
	connectionProblem,
	componentWarnings = []
) {
	let warningMessage = '';
	const newLineBeforeWarning =
		status?.client?.message.length > 10 ? <br key="br" /> : ' ';

	if (connectionProblem.status)
		warningMessage =
			connectionProblem.issue == 'WEBSOCKET' ? (
				<span key="warningWebsocket" className="info__warnings">
					connection dropped
				</span>
			) : (
				' '
			);
	else if (componentWarnings.length > 0) {
		warningMessage = (
			<span key="warningComponent" className="info__warnings">
				{componentWarnings.length > 1
					? `${componentWarnings.length} issues`
					: componentWarnings[0].status &&
					  ISSUES[componentWarnings[0].issue].title}
				<Tooltip
					interactive
					className="tooltip__warning-component"
					content={
						<p className="info__connection">
							{componentWarnings.map((item, index) => {
								const { docs, message } = ISSUES[
									componentWarnings[index].issue
								];
								return (
									<span
										key={index.toString()}
										className="info__connection__item">
										<span
											className={`icon-status-dot ${
												componentWarnings[index]
													.issue === 'RAM'
													? 'icon-status-dot--info'
													: ''
											}`}
										/>
										{message}
										{componentWarnings[index].issue ===
											'RAM' &&
											componentWarnings[index]?.value &&
											`${
												componentWarnings[index]?.value
											} GiB`}
										<a href={docs}>
											<span className="icon-new-window" />
										</a>
									</span>
								);
							})}
						</p>
					}
					distance={status?.client?.message.length > 10 ? 40 : 30}
					placement="top"
					trigger="mouseenter"
					theme="light">
					<span className="icon-warning-rounded" />
				</Tooltip>
			</span>
		);
	}
	return [newLineBeforeWarning, warningMessage];
}

const StatusMessage = ({
	componentWarnings,
	connectionProblem,
	isEngineOn,
	isGolemConnecting,
	showPortInfo,
	status
}) => {
	return (
		<span>
			<span className="status-message">
				<span>
					{status?.client?.message ? (
						isGolemConnecting(isEngineOn, status) ? (
							<span>
								{status.client.message}
								<Tooltip
									content={
										<p className="info__connection">
											The process may take a few seconds.
											<br />
											When all connection statuses are
											green
											<br />
											then app will properly connect.
										</p>
									}
									placement="top"
									trigger="mouseenter">
									<span className="icon-question-mark" />
								</Tooltip>
							</span>
						) : showPortInfo ? (
							'Checking ports'
						) : (
							status.client.message
						)
					) : (
						<DotAnim>Loading</DotAnim>
					)}
				</span>
				{status && status[0] && (
					<span>
						<a href="https://docs.golem.network/#/Products/Brass-Beta/Installation">
							<span className="icon-new-window" />
						</a>
					</span>
				)}
			</span>
			{status?.client?.message && loadErrorUrl(status.client.message)}
			{loadConnectionWarnings(
				status,
				connectionProblem,
				componentWarnings
			)}
		</span>
	);
};

StatusMessage.displayName = 'StatusMessage';

export default StatusMessage;
