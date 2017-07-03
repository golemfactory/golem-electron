var electron = window.require('electron');
const Config = electron.remote.require('electron-config')
const config = new Config();

/**
 * CONFIG STORE KEYS
 */
//config.delete('SHOW_ONBOARD') // <-- Rollback onboard
export const dictConfig = {
    SHOW_ONBOARD: 'SHOW_ONBOARD',
    AUTOLUNCH_SWITCH: 'AUTOLUNCH_SWITCH',
    PREVIEW_SWITCH: 'PREVIEW_SWITCH',
    RESOURCE_SLIDER: 'RESOURCE_SLIDER',
    GOLEM_STARTER: 'GOLEM_STARTER',
    DEFAULT_FILE_LOCATION: 'DEFAULT_FILE_LOCATION'
}

/**
 * [setConfig storing key value config persistent]
 * @param {[Any]} 		key  
 * @param {[Any]} 		value 
 *
 * @see https://github.com/sindresorhus/electron-config 
 */
export function setConfig(key, value) {
    config.set(key, value);
}

/**
 * [getConfig getting data from the config store]
 * @param  {[Any]} 		key 
 * @return {[Any]}  
 *
 * @see https://github.com/sindresorhus/electron-config
 */
export function getConfig(key) {
    return config.get(key)
}


