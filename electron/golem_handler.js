const electron = require('electron');
const fs = require('fs');
const getpid = require('getpid');
const os = require('os');
const path = require('path');

const {spawn} = require('child_process');
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
        let envPath = process.env.PATH;

        /* Create a working directory */
        if (!fs.existsSync(cwd))
            fs.mkdirSync(cwd);

        /* Patch PATH on Unix and Linux */
        if (os.platform() != 'win32')
            envPath += ':/usr/local/bin';

        console.log('💻 Starting Golem...');
        this.process = spawn(this.processName, this.processArgs, {
            cwd: cwd,
            env: {PATH: envPath}
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
        if (!this.process)
            console.warn('💻 Cannot stop Golem: unknown process');
        else
            this.process.kill('SIGINT');
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
