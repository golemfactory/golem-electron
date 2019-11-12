const fs = require('fs');
const dirtree2json = require('dirtree2json/lib');

module.exports = function dirToJson(directory, ext) {
    return new Promise((resolve, reject) => {
        var regexp = new RegExp(ext, 'i');
        var options = {
            filter: {
                fileExtension: regexp
            },
            excludeEmptyFolders: true,
            includeId: true,
            includeAbsolutePath: true,
            attributeName: {
                child: 'children'
            },
            state: {
                expanded: true
                // favorite: true,
                // deletable: true,
            }
        };
        if (!fs.lstatSync(directory[0]).isDirectory()) {
            resolve(null);
        }

        var tree = dirtree2json.dirTojson(directory[0], options);
        resolve(tree);
    });
};
