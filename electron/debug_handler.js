const log = require('electron-log')
const {getConfig, setConfig, dictConfig} = require('./config_storage.js')

const {DEBUG_MODE} = dictConfig
const level = Object.freeze({
    ERROR: 'error',
    WARNING: 'warn',
    INFO: 'info',
    VERBOSE: 'verbose',
    DEBUG: 'debug',
    SILLY: 'silly'
})

const callback = function(level, ...args) {
    getConfig(DEBUG_MODE) && log[level](...args)
}

const logger = Object.freeze(Object.entries(level)
    .reduce((total, [_, value]) => {
        total[value] = callback.bind(null, value)
        return total
    }, {}))

module.exports = global.log = logger