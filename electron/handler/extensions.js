const chalk = require('chalk');
/**
 * [installDevExtensions installing development extensions]
 * @return  {[Object]}   [Promise]
 */
module.exports = function installDevExtensions() {
	const installExtension = require('electron-devtools-installer').default;
	const REACT_DEVELOPER_TOOLS = require('electron-devtools-installer')
		.REACT_DEVELOPER_TOOLS;
	const REDUX_DEVTOOLS = require('electron-devtools-installer')
		.REDUX_DEVTOOLS;

	console.log(chalk.blue(`Installing DevTools extensions...`));
	console.log();

	return new Promise((resolve, reject) => {
		installExtension(REACT_DEVELOPER_TOOLS.id)
			.then(name => {
				console.log(`${chalk.green(`✓`)} ${name}`);
				console.log();
				resolve();
			})
			.catch(err => {
				log.warn('MAIN_PROCESS > REACT_DEVELOPER_TOOLS', err);
				console.log(chalk.red(`An error occurred: ${err}`));
				console.log();
				reject();
			});
		installExtension(REDUX_DEVTOOLS.id)
			.then(name => {
				console.log(`${chalk.green(`✓`)} ${name}`);
				console.log();
				resolve();
			})
			.catch(err => {
				log.warn('MAIN_PROCESS > REDUX_DEVTOOLS', err);
				console.log(chalk.red(`An error occurred: ${err}`));
				console.log();
				reject();
			});
	});
};
