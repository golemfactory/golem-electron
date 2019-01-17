const electron = require('electron');
const Store = require('electron-store')
const store = new Store();

const MAINNET = process.argv.includes('--mainnet')
const TERMS_VERSION = 3;
/**
 * CONFIG STORE KEYS
 */

//store.delete('DEFAULT_GETH') // <-- Rollback geth
//store.delete('HIDE_ONBOARD_FLOW:TEST_V'+TERMS_VERSION) // <-- Rollback onboard
const dictConfig = MAINNET ? {
    AUTOLUNCH_SWITCH: 'AUTOLUNCH_SWITCH:MAIN',
    CONCENT_ONBOARDING: 'CONCENT_ONBOARDING:MAIN',
    DEBUG_MODE: 'DEBUG_MODE:MAIN',
    DEFAULT_FILE_LOCATION: 'DEFAULT_FILE_LOCATION:MAIN',
    DEFAULT_GETH: 'DEFAULT_GETH:MAIN',
    DEVELOPER_MODE: 'DEVELOPER_MODE:MAIN',
    GOLEM_STARTER: 'GOLEM_STARTER:MAIN',
    HIDE_ONBOARD: 'HIDE_ONBOARD_FLOW:MAIN_V'+ TERMS_VERSION,
    INDICATOR_ID: 'INDICATOR_ID:MAIN',
    NOTIFICATION_CENTER: 'NOTIFICATION_CENTER:MAIN',
    PREVIEW_SWITCH: 'PREVIEW_SWITCH:MAIN',
    RESOURCE_SLIDER: 'RESOURCE_SLIDER:MAIN'
} :
{
    AUTOLUNCH_SWITCH: 'AUTOLUNCH_SWITCH:TEST',
    CONCENT_ONBOARDING: 'CONCENT_ONBOARDING:TEST',
    DEBUG_MODE: 'DEBUG_MODE:TEST',
    DEFAULT_FILE_LOCATION: 'DEFAULT_FILE_LOCATION:TEST',
    DEFAULT_GETH: 'DEFAULT_GETH:TEST',
    DEVELOPER_MODE: 'DEVELOPER_MODE:TEST',
    GOLEM_STARTER: 'GOLEM_STARTER:TEST',
    HIDE_ONBOARD: 'HIDE_ONBOARD_FLOW:TEST_V'+ TERMS_VERSION,
    INDICATOR_ID: 'INDICATOR_ID:TEST',
    NOTIFICATION_CENTER: 'NOTIFICATION_CENTER:TEST',
    PREVIEW_SWITCH: 'PREVIEW_SWITCH:TEST',
    RESOURCE_SLIDER: 'RESOURCE_SLIDER:TEST',
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
