/**
 * [winston package for logging]
 */
const winston = require("winston");
const os = require("os");
const path = require("path");
var fs = require("fs");
var mkdirp = require("mkdirp");
const { getConfig, setConfig, dictConfig } = require("./config_storage.js");
const { DATADIR } = require("./golem_config.js");

const { DEBUG_MODE } = dictConfig;
const level = Object.freeze({
    ERROR: "error",
    WARNING: "warn",
    INFO: "info",
    VERBOSE: "verbose",
    DEBUG: "debug",
    SILLY: "silly"
});

const LOGPATH = path.join(DATADIR, "logs");

if (!fs.existsSync(LOGPATH))
    //ensure that log path already exist in the system
    try {
        mkdirp.sync(LOGPATH);
        console.log("Log directory created");
    } catch (err) {
        console.error(err);
    }

const log = new winston.createLogger({
    transports: [
        new winston.transports.File({
            name: "debug-file",
            filename: path.join(LOGPATH, "gui.log"),
            level: "debug",
            json: false
        }),
        new winston.transports.File({
            name: "error-file",
            filename: path.join(LOGPATH, "gui-error.log"),
            level: "error"
        })
    ]
});

const callback = function(level, location, ...args) {
    getConfig(DEBUG_MODE) &&
        log.log(level, ...args, {
            location
        });
};

const logger = Object.freeze(
    Object.entries(level).reduce((total, [_, value]) => {
        total[value] = callback.bind(null, value);
        return total;
    }, {})
);

module.exports = global.log = logger;
