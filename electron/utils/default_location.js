const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function createLocationPath(_dir) {
    return mkdirp.sync(_dir);
}

module.exports = function getDefaultLocation() {
    const _location = path.join(
        isWin() ? process.env.USERPROFILE : process.env.HOME,
        'Documents'
    );

    if (!fs.existsSync(_location)) return createLocationPath(_location);
    return _location;
};
