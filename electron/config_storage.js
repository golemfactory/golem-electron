var electron = require('electron');
const Config = require('electron-config')
const config = new Config();

/**
 * CONFIG STORE KEYS
 */
//config.delete('SHOW_ONBOARD') // <-- Rollback onboard
const dictConfig = {
    SHOW_ONBOARD: 'SHOW_ONBOARD',
    AUTOLUNCH_SWITCH: 'AUTOLUNCH_SWITCH',
    PREVIEW_SWITCH: 'PREVIEW_SWITCH',
    RESOURCE_SLIDER: 'RESOURCE_SLIDER',
    GOLEM_STARTER: 'GOLEM_STARTER',
    DEFAULT_FILE_LOCATION: 'DEFAULT_FILE_LOCATION',
    DEBUG_MODE: 'DEBUG_MODE'
}

/**
 * [setConfig storing key value config persistent]
 * @param {[Any]}       key  
 * @param {[Any]}       value 
 *
 * @see https://github.com/sindresorhus/electron-config 
 */
let setConfig = function(key, value) {
    config.set(key, value);
}

/**
 * [getConfig getting data from the config store]
 * @param  {[Any]}      key 
 * @return {[Any]}  
 *
 * @see https://github.com/sindresorhus/electron-config
 */
let getConfig = function(key) {
    return config.get(key)
}

const configStorage = {
    setConfig,
    getConfig,
    dictConfig
}

module.exports = global.configStorage = configStorage