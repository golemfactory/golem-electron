const electron = require('electron');
const Store = require('electron-store')
const store = new Store();

const MAINNET = process.argv.includes('--mainnet')

/**
 * CONFIG STORE KEYS
 */

//store.delete('DEFAULT_GETH') // <-- Rollback geth
//store.delete('HIDE_ONBOARD_FLOW') // <-- Rollback onboard
const dictConfig = MAINNET ? {
    HIDE_ONBOARD: 'HIDE_ONBOARD_FLOW:MAIN',
    AUTOLUNCH_SWITCH: 'AUTOLUNCH_SWITCH:MAIN',
    PREVIEW_SWITCH: 'PREVIEW_SWITCH:MAIN',
    RESOURCE_SLIDER: 'RESOURCE_SLIDER:MAIN',
    GOLEM_STARTER: 'GOLEM_STARTER:MAIN',
    DEFAULT_FILE_LOCATION: 'DEFAULT_FILE_LOCATION:MAIN',
    DEFAULT_GETH: 'DEFAULT_GETH:MAIN',
    DEBUG_MODE: 'DEBUG_MODE:MAIN',
    DEVELOPER_MODE: 'DEVELOPER_MODE:MAIN',
    INDICATOR_ID: 'INDICATOR_ID:MAIN'
} :
{
    HIDE_ONBOARD: 'HIDE_ONBOARD_FLOW:TEST',
    AUTOLUNCH_SWITCH: 'AUTOLUNCH_SWITCH:TEST',
    PREVIEW_SWITCH: 'PREVIEW_SWITCH:TEST',
    RESOURCE_SLIDER: 'RESOURCE_SLIDER:TEST',
    GOLEM_STARTER: 'GOLEM_STARTER:TEST',
    DEFAULT_FILE_LOCATION: 'DEFAULT_FILE_LOCATION:TEST',
    DEFAULT_GETH: 'DEFAULT_GETH:TEST',
    DEBUG_MODE: 'DEBUG_MODE:TEST',
    DEVELOPER_MODE: 'DEVELOPER_MODE:TEST',
    INDICATOR_ID: 'INDICATOR_ID:TEST'
}

/**
 * [setConfig storing key value config persistent]
 * @param {[Any]}       key  
 * @param {[Any]}       value 
 *
 * @see https://github.com/sindresorhus/electron-config 
 */
function setConfig(key, value) {
    store.set(key, value);
}

/**
 * [getConfig getting data from the config store]
 * @param  {[Any]}      key 
 * @return {[Any]}  
 *
 * @see https://github.com/sindresorhus/electron-config
 */
function getConfig(key) {
    return store.get(key)
}

const configStorage = {
    setConfig,
    getConfig,
    dictConfig,
    configStore: store
}

module.exports = global.configStorage = configStorage
