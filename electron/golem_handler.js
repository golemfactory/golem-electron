const electron = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {exec, execSync, spawn} = require('child_process');
const {app} = electron;

const WHITESPACE_REGEXP = /\s*[\s,]\s*/;


class GolemProcess {

    constructor(processName, processArgs) {
        this.process = null;
        this.processName = processName || 'golemapp';
        this.processArgs = processArgs || ['--nogui', '-r', '127.0.0.1:61000'];
    }

    startProcess(err, pid) {
        if (!this.process)
            this._startProcess();
    }

    _startProcess() {
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
            stdio: 'ignore'
        });

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
