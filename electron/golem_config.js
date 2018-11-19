const os = require('os');
const path = require('path');
const yargs = require('yargs')

const args =
  yargs(process.argv)
    .alias('m', 'mainnet')
    .alias('d', 'datadir')
    .alias('r', 'rpc-address')
    .argv

const {getConfig, dictConfig} = require('./config_storage.js')
const {DEFAULT_GETH} = dictConfig

const MAINNET = args['mainnet']
const CUSTOM_DATADIR = args['datadir']
const CUSTOM_RPC = args['rpc-address']

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
