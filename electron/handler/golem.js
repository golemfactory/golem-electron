const electron = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { execSync, spawn } = require('child_process');
const { app } = electron;

const log = require('./debug.js');
const {
    DATADIR,
    IS_MAINNET,
    CUSTOM_DATADIR,
    CUSTOM_RPC,
    GETH_DEFAULT
} = require('../config/golem.js');

const WHITESPACE_REGEXP = /\s*[\s,]\s*/;

function Deferred() {
    this.promise = new Promise((resolve, reject) => {
        const build = resultFunc => {
            return data => {
                resultFunc(data);
            };
        };

        this.resolve = build(resolve);
        this.reject = build(reject);
    });
}

class GolemProcess {
    constructor(processName, processArgs) {
        this.process = null;
        this.certificate = null;
        this.connected = false;

        this.processGeth = '--start-geth';
        this.processPort = '--start-geth-port';
        this.processAddr = '--geth-address';

        let defaultArgs = ['-r', 'localhost:61000'];
        if (IS_MAINNET) defaultArgs.push('--mainnet');

        if (CUSTOM_DATADIR)
            defaultArgs = defaultArgs.concat(['--datadir', CUSTOM_DATADIR]);

        if (CUSTOM_RPC) defaultArgs[1] = CUSTOM_RPC;
        if (GETH_DEFAULT) this._addGethArgs(defaultArgs);

        this.processName = processName || 'golemapp';
        this.processArgs = processArgs || defaultArgs;
        this.processOpts = environment();

        this.prepared = new Deferred();
        this.prepared.promise.catch(this.fatalError);
    }

    fatalError(err) {
        // TODO: propagate this error and show a message in UI
        log.error(
            'MAIN_PROCESS > GOLEM_HANDLER',
            'Cannot start Golem:',
            err.toString()
        );

        console.log('Golem error:', err);
    }

    loadCertificate() {
        const certPath = path.join(DATADIR, 'crossbar', 'rpc_cert.pem');
        let createCertificateTimeout = null;

        let readCert = () =>
            this._readCertificate(certPath).then(
                this.prepared.resolve,
                this.prepared.reject
            );

        if (fs.existsSync(certPath)) {
            if (createCertificateTimeout)
                clearTimeout(createCertificateTimeout);
            readCert();
        } else
            createCertificateTimeout = setTimeout(() => {
                this.startProcess();
                this.loadCertificate();
            }, 1000);
    }

    _readCertificate(certPath) {
        return new Promise((resolve, reject) => {
            try {
                const buffer = fs.readFileSync(certPath);
                this.certificate = buffer.toString('ascii');
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    getSecretKey(user) {
        return new Promise((resolve, reject) =>
            this._readSecretKey(user)
                .then(result => resolve(result))
                .catch(rejection => reject(rejection))
        );
    }

    _readSecretKey(user) {
        const tokenPath = path.join(DATADIR, 'crossbar', 'secrets');
        return new Promise((resolve, reject) => {
            try {
                const buffer = fs.readFileSync(
                    path.join(tokenPath, `${user}.tck`)
                );
                const token = buffer.toString('ascii');
                resolve(token);
            } catch (err) {
                reject(err);
            }
        });
    }

    _addGethArgs(args) {
        const customGeth = GETH_DEFAULT;
        let gethFlag;

        if (customGeth && customGeth.isLocalGeth) {
            args.push(this.processGeth);
            gethFlag = `${this.processPort} ${customGeth.gethPort || 8545}`;
        } else if (customGeth.gethAddress) {
            gethFlag = [this.processAddr, customGeth.gethAddress];
        }

        if (gethFlag) args = args.concat(gethFlag);

        console.warn('💻 Golem will run on your local geth!');
    }

    startProcess() {
        /* Return if already running*/
        if (this.process) return;

        console.log('💻 Starting Golem...');

        /* Create the data directory */
        if (!fs.existsSync(DATADIR)) fs.mkdirSync(DATADIR);

        try {
            this.process = spawn(
                this.processName,
                this.processArgs,
                this.processOpts
            );

            this.process.on('uncaughtException', this.prepared.reject);
            this.process.on('error', this.prepared.reject);
            this.process.on('exit', code =>
                log.info(
                    'MAIN_PROCESS > GOLEM_HANDLER',
                    'Golem exited with code',
                    code
                )
            );
        } catch (err) {
            return this.prepared.reject(err);
        }
    }

    stopProcess() {
        return new Promise((resolve, reject) => {
            if (!this.process) return reject();

            console.log('💻 Stopping Golem...');

            if (os.platform() == 'win32')
                this.windowsKillProcess(this.process.pid, true);
            else this.process.kill();

            this.process = null;
            resolve();
        });
    }

    windowsKillProcess(pid, ignorePid) {
        const subPids = this.windowsSubProcesses(pid);
        for (let subPid of subPids) this.windowsKillProcess(subPid);

        try {
            if (!ignorePid) process.kill(parseInt(pid), 'SIGINT');
        } catch (exc) {
            log.error(
                'MAIN_PROCESS > GOLEM_HANDLER',
                `Error killing process ${pid}: ${exc}`
            );
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
        } catch (exc) {
            log.error(
                'MAIN_PROCESS > GOLEM_HANDLER',
                `Error executing WMIC: ${exc}`
            );
        }

        return stdout.split('\n').filter(Number);
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
        } else env.LC_ALL = env.LC_ALL || 'UTF-8';
    }

    return {
        cwd: DATADIR,
        env: env,
        stdio: 'ignore'
    };
}

function golemHandler(app) {
    if (app.golem) return;

    app.golem = new GolemProcess();
    app.golem.loadCertificate();

    // SSL/TSL: self signed certificate support
    app.on(
        'certificate-error',
        (event, webContents, url, error, certificate, callback) => {
            event.preventDefault();
            const certificateError = err =>
                log.error('Certificate error:', err);
            const checkCertificate = () =>
                callback(certificate.data == app.golem.certificate);

            app.golem.prepared.promise.then(checkCertificate, certificateError);
        }
    );
}

module.exports = golemHandler;
