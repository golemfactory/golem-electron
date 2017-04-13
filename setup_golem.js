const {spawn, execFile} = require('child_process');
const chalk = require('chalk')
/**
 * [request, HTTP request client]
 * @see https://github.com/request/request
 */
var request = require("request")
/**
 * [progress, progress handler for request module]
 * @see https://github.com/IndigoUnited/node-request-progress
 */
var progress = require('request-progress')
var fs = require('fs')
/**
 * [unzip, nodejs unzip module]
 * @see https://github.com/EvanOxfeld/node-unzip
 */
var unzip = require('unzip')

const os = {
    LINUX: {
        name: 'linux',
        url: 'https://www.dropbox.com/s/2nn5lg7x0c3q23z/golem-linux.zip?dl=1', //dl=1 for direct download from dropbox
        extension: 'sh'
    },
    WIN: {
        name: 'win32',
        url: 'https://www.dropbox.com/s/5t6c3qwarddmymc/golem-win32-0.2.X.zip?dl=1',
        extension: 'sh'
    },
    UNIX: {
        name: 'darwin',
        url: 'https://www.dropbox.com/s/2nn5lg7x0c3q23z/golem-linux.zip?dl=1',
        extension: 'sh'
    },
}

/**
 * [installation golem server installation]
 * @return nothing
 */
var installation = function() {
    let operatingSystem = process.platform
    console.log(`⏳ Installation starting`)
    console.log()
    console.log(`💻 This platform is ${operatingSystem}`);
    console.log()

    switch (operatingSystem) {
    case os.UNIX.name: {
        console.log(`💻 Installment starting for ${operatingSystem} with shell file`);
        console.log()
        const {url, extension} = os.UNIX
        downloadPackage(url, extension);
        break;
    }
    case os.LINUX.name: {
        console.log(`💻 Installment starting for ${operatingSystem} with shell file`);
        console.log()
        const {url, extension} = os.LINUX
        downloadPackage(url, extension);
        break;
    }
    case os.WIN.name: {
        console.log(`💻 Installment starting for ${operatingSystem} with command file`);
        console.log()
        const {url, extension} = os.WIN
        downloadPackage(url, extension);
        break;
    }
    }

    /**
     * [downloadPackage Downloading golem server files from external source]
     * @return nothing
     */
    function downloadPackage(url, extension) {
        console.log('📦 Package Downloading...')
        console.log()
        progress(request({
            url: url
        }), {})
            .on('progress', _onRequestProgress)
            .on('error', function(err) {
                // Do something with err
                console.log(err)
            })
            .pipe(fs.createWriteStream('golem.zip'))
            .on('close', function() {
                unzipFile(extension)
                console.log('🏁 Downloading successful!');
                console.log()
            });
    }

    /**
     * [unzipFile unzipping downloaded file]
     * @return nothing
     */
    function unzipFile(extension) {
        fs.createReadStream('golem.zip').pipe(unzip.Extract({
            path: './'
        })).on('close', _onUnzipFile.bind(null, extension));
    }

    /**
     * [_onUnzipFile callback function for unzip]
     * @return nothing
     */
    function _onUnzipFile(extension) {
        fs.unlinkSync('golem.zip');
        console.log('🐢 Installation started!', extension)
        console.log()
        const sh = execFile(`./golem/test.${extension}`, [], _onExecFile);
    }

    /**
     * [_onExecFile callback function for execFile child process]
     * @param  {[Object]} error  [Execution error]
     * @param  {[Object]} stdout [Output]
     * @param  {[Object]} stderr [Output error]
     * @return nothing
     */
    function _onExecFile(error, stdout, stderr) {
        console.log('🏁', stdout)
        console.log()
    }

    /**
     * [_onRequestProgress callback function for download progress]
     * @param  {[Object]} state [state of the downloaded file]
     * @return nothing
     */
    function _onRequestProgress(state) {
        console.log('📈 Progress: ', state)
    }
}

exports.installation = installation