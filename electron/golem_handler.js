const electron = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {execSync, spawn, spawnSync} = require('child_process');
const {app} = electron;

const WHITESPACE_REGEXP = /\s*[\s,]\s*/;
const MINIMUM_GOLEM_VERSION = [0, 7, 1];


class GolemProcess {

    constructor(processName, processArgs) {
        this.process = null;
        this.processName = processName || 'golemapp';
        this.processArgs = processArgs || ['--nogui', '-r', '127.0.0.1:61000'];
    }

    startProcess() {
        try {
            if (this.process) return;
            if (!this.checkVersion()) return;
            this._startProcess();
        } catch (e) {
            console.error('GolemProcess error:', e);
        }
    }

    prepareSpawnOptions() {
        let cwd = path.join(os.homedir(), '.golem');
        let env = process.env;
        let platform = os.platform();

        /* Create a working directory */
        if (!fs.existsSync(cwd))
            fs.mkdirSync(cwd);

        /* Patch env on Unix and Linux */
        if (platform != 'win32') {
            env.PATH += ':/usr/local/bin';

            if (platform == 'linux') {
                env.LC_ALL = env.LC_ALL || 'en_US.UTF-8';
                env.LANG = env.LANG || 'en_US.UTF-8';
            } else
                env.LC_ALL = env.LC_ALL || 'UTF-8';
        }

        console.log('💻 Starting Golem...');
        this.process = spawn(this.processName, this.processArgs, {
            cwd: cwd,
            env: env,
        }
    }

    checkVersion() {
        let options = this.prepareSpawnOptions();
        options.stdio = 'pipe';
        options.timeout = 1000; // ms
        options.killSignal = 'SIGKILL';
        let result = spawnSync(this.processName, ['--version'], options);
        if (result.error) {
            if (result.error.code == 'ENOENT') {
                console.error(this.processName,
                        "not found! Make sure it's in your $PATH");
                return false;
            } else {
                console.error(this.processName, "failed. ERRNO:",
                        result.error.errno, "code:", result.error.code);
                return false;
            }
        }
        if (result.status != 0) {
            console.error('Cannot start Golem process. Exit code:',
                    result.status,
                    'stderr:',
                    result.stderr && result.stderr.toString() || "<null>"
            );
            return false;
        }
        let version_re = /^GOLEM version: (\d+\.\d+\.\d+)$/m;
        let version_match = version_re.exec(result.stdout.toString());
        let process_version = version_match[1].split(".");
        if (process_version < MINIMUM_GOLEM_VERSION) {
            console.error(this.processName,
                    ' version is', process_version.join(".")
                    +'. Minimum required version is',
                    MINIMUM_GOLEM_VERSION.join(".") + '. Please upgrade.'
            );
            return false;
        }
        return true;
    }

    _startProcess() {
        let options = this.prepareSpawnOptions();
        options.stdio = 'ignore';

        console.log('💻 Starting Golem...');
        this.process = spawn(this.processName, this.processArgs, options);

        /* Handle process events */
        this.process.on('error', data => {
            console.error('💻 Cannot start Golem:', data.toString())
        });
        this.process.on('exit', code => {
            console.log('💻 Golem exited with code', code);
        });
        /* FIXME: we shouldn't be catching stdout here.
        this.process.stderr.on('data', data => {
            console.error('💻 Golem error:', data.toString());
        });*/
    }

    stopProcess() {
        return new Promise((resolve, reject) => {
            if (!this.process) {
                console.warn('💻 Cannot stop Golem: not in control of the process');
                return reject();
            }

            if (os.platform() == 'win32')
                this.windowsKillProcess(this.process.pid, true);
            else
                this.process.kill();

            resolve();
        });
    }

    windowsKillProcess(pid, ignorePid) {
        let subPids = this.windowsSubProcesses(pid);
        for (let subPid of subPids)
            this.windowsKillProcess(subPid);

        try {
            if (!ignorePid)
                process.kill(parseInt(pid), 'SIGINT');
        } catch (exc) {
            console.error(`Error killing process ${pid}: ${exc}`);
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
            console.error(`Error executing WMIC: ${exc}`);
        }

        return stdout.split('\n')
                     .filter(Number);
    }
}


function golemHandler(app) {
    app.golem = new GolemProcess();
}


module.exports = golemHandler;
