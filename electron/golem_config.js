const os = require('os');
const path = require('path');

const MAINNET = process.argv.includes('--mainnet')
const CHAIN = MAINNET ? 'mainnet' : 'rinkeby';


let localDir;

switch(os.platform()) {
    case "win32":
        localDir = 'AppData\\Local';
        break;
    case "darwin":
        localDir = 'Library/Application\ Support';
        break;
    default:
        localDir = '.local/share';
        break;
}

const HOMEDIR = os.homedir();
const DATADIR = path.join(HOMEDIR, localDir, 'golem', 'default', CHAIN);

module.exports = {
	DATADIR: DATADIR,
	IS_MAINNET: MAINNET
}
