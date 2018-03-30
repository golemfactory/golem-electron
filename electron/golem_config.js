const os = require('os');
const path = require('path');

const {getConfig, dictConfig} = require('./config_storage.js')
const {DEFAULT_GETH} = dictConfig

const MAINNET = process.argv.includes('--mainnet')
const CHAIN = MAINNET ? 'mainnet' : 'rinkeby';
const GETH_DEFAULT = getConfig(DEFAULT_GETH)


let localDir;

switch(os.platform()) {
    case "win32":
        localDir = 'AppData\\Local\\golem'; // mind the extra 'golem'
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
	DATADIR,
	IS_MAINNET: MAINNET,
    GETH_DEFAULT
}
