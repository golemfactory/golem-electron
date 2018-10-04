const os = require('os');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const {getConfig, dictConfig} = require('./config_storage.js')
const {DEFAULT_GETH} = dictConfig

const MAINNET = argv['mainnet']
const CUSTOM_DATADIR = argv['datadir']
const CUSTOM_RPC = argv['rpc-address']

const CHAIN = MAINNET ? 'mainnet' : 'rinkeby';
const GETH_DEFAULT = getConfig(DEFAULT_GETH)


function defaultDatadir(){

    const HOMEDIR = os.homedir();
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

    return path.join(HOMEDIR, localDir, 'golem', 'default', CHAIN);
}

const DATADIR = CUSTOM_DATADIR 
                ? path.join(CUSTOM_DATADIR, CHAIN) 
                : defaultDatadir()

module.exports = {
	DATADIR,
	IS_MAINNET: MAINNET,
    CUSTOM_DATADIR,
    CUSTOM_RPC,
    GETH_DEFAULT
}
