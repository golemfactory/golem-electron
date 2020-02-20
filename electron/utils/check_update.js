const semver = require('semver');

module.exports = function checkUpdate(_old, _new) {
    return semver.diff(_new, _old);
};
