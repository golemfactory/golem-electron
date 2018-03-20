const electron = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {exec, execSync, spawn} = require('child_process');
const {app} = electron;

const log = require('./debug_handler.js');
const {getConfig, dictConfig} = require('./config_storage.js')
const {DEFAULT_GETH} = dictConfig
const {DATADIR, IS_MAINNET} = require('./golem_config.js');

const WHITESPACE_REGEXP = /\s*[\s,]\s*/;


function Deferred() {
    var self = this;

    self.called = false;
    self.promise = new Promise((resolve, reject) => {

        function build(resultFunc) {
            return data => {
                self.called = true;
                resultFunc(data);
            };
        }

        self.resolve = build(resolve);
        self.reject = build(reject);
    });
}


class GolemProcess {

    constructor(processName, processArgs) {
        this.process = null;
        this.certificate = null;

        let defaultArgs = ['-r', 'localhost:61000'];
        if (IS_MAINNET) defaultArgs.push('--mainnet');
        if (getConfig(DEFAULT_GETH)) this._addGethArgs(defaultArgs);

        this.processName = processName || 'golemapp';
        this.processArgs = processArgs || defaultArgs;
        this.processOpts = environment();

        this.processGeth = '--start-geth';
        this.processPort = '--start-geth-port';
        this.processAddr = '--geth-address';

        this.prepared = new Deferred();
        this.prepared.promise.catch(this.fatalError);
    }

    fatalError(err) {
        // TODO: propagate this error and show a message in UI
        log.error(
            'MAIN_PROCESS > GOLEM_HANDLER',
            'Cannot start Golem:', err.toString()
        )

        console.log('Golem error:', err)
    }

    loadCertificate() {
        let certPath = path.join(DATADIR, 'crossbar', 'rpc_cert.pem');
        let readCert = () => this._readCertificate(certPath).then(
            this.prepared.resolve,
            this.prepared.reject
        );

        if (fs.existsSync(certPath))
            readCert();
        else
            this._createCertificate().then(
                readCert,
                this.prepared.reject
            );
    }

    _createCertificate() {
        /* Uses core to generate certificates */
        let deferred = new Deferred();

        try {

            let process = spawn(
                this.processName,
                this.processArgs.concat(['--generate-rpc-cert']),
                this.processOpts,
            );

            process.on('uncaughtException', deferred.reject);
            process.on('error', deferred.reject);
            process.on('close', code => code == 0
                ? deferred.resolve()
                : deferred.reject(code)
            )

        } catch (err) {
            deferred.reject(err);
        }

        return deferred.promise;
    }

    _readCertificate(certPath) {
        return new Promise((resolve, reject) => {
            try {
                let buffer = fs.readFileSync(certPath);
                this.certificate = buffer.toString('ascii');
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    _addGethArgs(args) {
        const customGeth = getConfig(DEFAULT_GETH);
        var gethFlag;

        if (customGeth.isLocalGeth){

            args.push(this.processGeth)
            gethFlag = `${this.processPort} ${customGeth.gethPort || 8545}`

        } else if (customGeth.gethAddress){
            gethFlag = `${this.processAddr} ${customGeth.gethAddress}`
        }

        gethFlag && args.push(gethFlag)

        console.warn('💻 Golem will run on your local geth!');
    }

    startProcess() {
        /* Return if already running or certs haven't been loaded yet */
        if (this.process || !this.prepared.called)
            return;

        console.log('💻 Starting Golem...');

        /* Create the data directory */
        if (!fs.existsSync(DATADIR))
            fs.mkdirSync(DATADIR);

        try {

            this.process = spawn(
                this.processName,
                this.processArgs,
                this.processOpts,
            );

            this.process.on('uncaughtException', this.prepared.reject);
            this.process.on('error', this.prepared.reject);
            this.process.on('exit', code =>
                log.info('MAIN_PROCESS > GOLEM_HANDLER',
                         'Golem exited with code', code)
            );

        } catch (err) {
            return this.prepared.reject(err);
        }
    }

    stopProcess() {
        return new Promise((resolve, reject) => {
            if (!this.process)
                return reject();

            console.log('💻 Stopping Golem...');

            if (os.platform() == 'win32')
                this.windowsKillProcess(this.process.pid, true);
            else
                this.process.kill();

            this.process = null;
            resolve();
        });
    }

    windowsKillProcess(pid, ignorePid) {
        let subPids = this.windowsSubProcesses(pid);
        for ( let subPid of subPids )
            this.windowsKillProcess(subPid);

        try {
            if (!ignorePid)
                process.kill(parseInt(pid), 'SIGINT');
        } catch ( exc ) {
            log.error('MAIN_PROCESS > GOLEM_HANDLER',
                      `Error killing process ${pid}: ${exc}`)
        }
    }

    windowsSubProcesses(pid) {
        let stdout = '';

        try {

            stdout = execSync(
                `wmic process where (` +
                `ParentProcessId=${pid} ` +
                `and Name!="wmic.exe" ` +
                `) get processid`
            ).toString();

        } catch ( exc ) {
            log.error('MAIN_PROCESS > GOLEM_HANDLER',
                      `Error executing WMIC: ${exc}`)
        }

        return stdout.split('\n')
            .filter(Number);
    }
}


function environment() {
    let env = process.env;
    let platform = os.platform();

    /* Patch locale on Unix and Linux */
    if (platform != 'win32') {
        env.PATH += ':/usr/local/bin';

        if (platform == 'linux') {
            env.LC_ALL = env.LC_ALL || 'en_US.UTF-8';
            env.LANG = env.LANG || 'en_US.UTF-8';
        } else
            env.LC_ALL = env.LC_ALL || 'UTF-8';
    }

    return {
        cwd: DATADIR,
        env: env,
        stdio: 'ignore'
    }
}


function golemHandler(app) {
    if (app.golem) return;

    app.golem = new GolemProcess();
    app.golem.loadCertificate();

    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {

        let certificateError = err => log.error('Certificate error:', err);
        let checkCertificate = () => {
            event.preventDefault();
            callback(certificate.data == app.golem.certificate);
        };

        app.golem.prepared.promise.then(
            checkCertificate,
            certificateError
        );
    });
}


module.exports = golemHandler;
