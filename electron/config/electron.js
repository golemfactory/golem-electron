function isDevelopment() {
	return process.env.NODE_ENV === 'development';
}
function isWin() {
	return process.platform === 'win32';
}
function isMac() {
	return process.platform === 'darwin';
}
function isLinux() {
	return process.platform === 'linux';
}
module.exports = {
	isDevelopment: isDevelopment,
	isWin: isWin,
	isMac: isMac,
	isLinux: isLinux,
	APP_NAME: isDevelopment() ? 'Golem (development)' : 'Golem',
	APP_WIDTH: isWin() ? 478 : 460,
	APP_HEIGHT: 810, //589
	APP_MIN_HEIGHT: 630,
	PREVIEW_APP_WIDTH: 752,
	PREVIEW_APP_HEIGHT: 572,
	PREVIEW_APP_MIN_WIDTH: 600,
	PREVIEW_APP_MIN_HEIGHT: 530
};
