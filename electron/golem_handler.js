const electron = require('electron');
const fs = require('fs');
const getpid = require('getpid');
const os = require('os');
const path = require('path');
const psTree = require('ps-tree');

const {exec, spawn} = require('child_process');
const {app, ipcMain} = electron;


class GolemProcess {

    constructor(processName, processArgs) {
        this.process = null;
        this.processName = processName || 'golemapp';
        this.processArgs = processArgs || ['--nogui'];
    }

    processRunning(cb) {
        if (this.process)
            return cb(this.process.pid);

        getpid(this.processName, (err, pid) => {
            if (err)
                return handle_error(err);
            cb(pid);
        });
    }

    startProcess(err, pid) {
        this.processRunning(running => {
            if (!running)
                this._startProcess();
        })
    }

    _startProcess() {
        let cwd = path.join(os.homedir(), '.golem');
        let env = process.env;

        /* Create a working directory */
        if (!fs.existsSync(cwd))
            fs.mkdirSync(cwd);

        /* Patch PATH on Unix and Linux */
        if (os.platform() != 'win32')
            env.PATH += ':/usr/local/bin';

        console.log('💻 Starting Golem...');
        this.process = spawn(this.processName, this.processArgs, {
            cwd: cwd,
            env: env
        });

        console.log('spawned', this.process.pid);

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

            /* Kill golemapp on Linux / macOS */
            if (os.platform() != 'win32')
                return this.process.kill();

            /* Kill golemapp on Windows */
            exec('tasklist', (error, stdout, stderr) => {
                let lines = stdout.split('\n');
                for (let line of lines) {

                    if (!line.startsWith(this.processName))
                        continue;

                    let entries = line.split(/\s*[\s,]\s*/);
                    process.kill(parseInt(entries[1]), 'SIGINT');
                }

                resolve();
            });
        });
    }

}


function golemHandler(app) {
    app.golem = new GolemProcess();

    ipcMain.on('start-golem-process', () => {
        app.golem.startProcess();
    });
    ipcMain.on('stop-golem-process', (event, counter) => {
        app.golem.stopProcess();
    });
}


module.exports = golemHandler;
