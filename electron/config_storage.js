const electron = require('electron');
const Store = require('electron-store')
const store = new Store();

/**
 * CONFIG STORE KEYS
 */

//store.delete('DEFAULT_GETH') // <-- Rollback geth
//store.delete('HIDE_ONBOARD') // <-- Rollback onboard
const dictConfig = {
    HIDE_ONBOARD: 'HIDE_ONBOARD',
    AUTOLUNCH_SWITCH: 'AUTOLUNCH_SWITCH',
    PREVIEW_SWITCH: 'PREVIEW_SWITCH',
    RESOURCE_SLIDER: 'RESOURCE_SLIDER',
    GOLEM_STARTER: 'GOLEM_STARTER',
    DEFAULT_FILE_LOCATION: 'DEFAULT_FILE_LOCATION',
    DEFAULT_GETH: 'DEFAULT_GETH',
    DEBUG_MODE: 'DEBUG_MODE',
    DEVELOPER_MODE: 'DEVELOPER_MODE',
    INDICATOR_ID: 'INDICATOR_ID'
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
