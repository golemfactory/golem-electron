const fs = require('fs');
const path = require('path');

module.exports = function selectDirectory(directory, _isMainNet) {
    const blackList = [
        'ACTION', 'APK', 'APP', 
        'BAT', 'BIN',
        'CMD', 'COM', 'COMMAND', 'CPL', 'CSH',
        'EXE',
        'GADGET',
        'INF', 'INS', 'INX', 'IPA', 'ISU',
        'JOB', 'JSE',
        'KSH',
        'LNK',
        'MSC', 'MSI', 'MSP', 'MST',
        'OSX', 'OUT',
        'PAF', 'PIF', 'PRG',
        'REG', 'RGS', 'RUN',
        'SCR', 'SCT', 'SHB', 'SHS',
        'U3B',
        'VB', 'VBE', 'VBS', 'VBSCRIPT',
        'WORKFLOW', 'WS', 'WSF', 'WSH'
    ];

    let masterList = ['BLEND'];

    // if(!_isMainNet)
    //     masterList.push("LXS")

    let ignorePlaftormFiles = function(file) {
        return (
            path.basename(file) !== '.DS_Store' && path.extname(file) !== null
        );
    };

    let isBadFile = function(file) {
        let correctExtension = file.replace('.', '').toUpperCase();
        return blackList.includes(correctExtension);
    };

    let isMasterFile = function(file) {
        let correctExtension = file.replace('.', '').toUpperCase();
        return masterList.includes(correctExtension);
    };

    let walk = function(dir, done) {
        let results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            let i = 0;
            (function next() {
                let file = list[i++];
                if (!file) return done(null, results);
                file = path.join(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        ignorePlaftormFiles(file) &&
                            results.push({
                                path: file,
                                name: path.basename(file),
                                extension: path.extname(file),
                                malicious: isBadFile(path.extname(file)),
                                master: isMasterFile(path.extname(file))
                            });
                        next();
                    }
                });
            })();
        });
    };

    let promises =
        directory.length > 0 &&
        directory.map(
            item =>
                new Promise((resolve, reject) => {
                    if (fs.lstatSync(item).isDirectory())
                        walk(item, function(err, results) {
                            if (err) {
                                reject(err);
                            }
                            resolve(results);
                        });
                    else {
                        let results = [];
                        ignorePlaftormFiles(item) &&
                            results.push({
                                path: item,
                                name: path.basename(item),
                                extension: path.extname(item),
                                malicious: isBadFile(path.extname(item)),
                                master: isMasterFile(path.extname(item))
                            });
                        resolve(results);
                    }
                })
        );
    //lazy load main window after creation
    const { mainWindow } = require('../app.js');
    mainWindow && mainWindow.focus();
    return Promise.all(promises);
};
