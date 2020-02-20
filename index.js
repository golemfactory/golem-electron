require('./electron/app.js');

//require('electron-debug')({showDevTools: true, enabled: true});

/*
 * Application tray can be additional feature for the future.
 */
//const createTray = require('./electron/tray_handler.js')

const { isMac, isWin } = require('./electron/config/electron.js');

const checkUpdate = require('./electron/utils/check_update.js');
const copyFiles = require('./electron/utils/copy_files.js');
const dirToJson = require('./electron/utils/dir_to_json.js');
const ethChecksum = require('./electron/utils/eth_checksum.js');
const estimatedGas = require('./electron/utils/gas_price_oracle.js');
const getDefaultLocation = require('./electron/utils/default_location.js');
const gethValidator = require('./electron/utils/geth_validator.js');
const selectDirectory = require('./electron/utils/select_directory.js');

exports.checkUpdate = checkUpdate;
exports.copyFiles = copyFiles;
exports.dirToJson = dirToJson;
exports.isWin = isWin;
exports.isMac = isMac;
exports.getDefaultLocation = getDefaultLocation;
exports.getEstimatedGasPrice = estimatedGas;
exports.selectDirectory = selectDirectory;
exports.toChecksumAddress = ethChecksum;
exports.validateGeth = gethValidator;
