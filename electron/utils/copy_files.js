const fs = require('fs');
const path = require('path');
const { isMac, isWin } = require('../config/electron.js');

module.exports = function copyFiles(files, missingFiles, _taskPath) {
    const promises = missingFiles
        .map(missingFile => {
            const matchedFile = files.find(
                file => file.name === missingFile.baseName
            );
            if (matchedFile) {
                const destination = path.join(
                    _taskPath,
                    missingFile.dirName.replace('/golem/resources/', '')
                );

                return _copyAsync(matchedFile, destination);
            }
        })
        .filter(item => item !== undefined);

    function _copyAsync(file, destDir) {
        return new Promise((resolve, reject) => {
            fs.access(destDir, err => {
                if (err) fs.mkdirSync(destDir);

                _copyFile(file.path, path.join(destDir, file.name));
            });

            function _copyFile(src, dest) {
                let readStream = fs.createReadStream(src);
                readStream.once('error', err => console.error);
                readStream.once('end', () => resolve(dest));
                readStream.pipe(fs.createWriteStream(dest));
            }
        });
    }

    return Promise.all(promises);
};
