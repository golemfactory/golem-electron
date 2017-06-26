const electron = require('electron');
const getpid = require('getpid');

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
        console.log('💻 Starting Golem...');
        this.process = spawn(this.processName, this.processArgs);

        this.process.on('exit', code => {
            console.log('💻 Golem exited with code', code);
        });
        this.process.stderr.on('data', data => {
            console.error('💻 Golem error:', data.toString());
        });
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

    app.on('window-all-closed', () => {
        app.golem.stopProcess();
    });
    ipcMain.on('start-golem-process', () => {
        app.golem.startProcess();
    });
    ipcMain.on('stop-golem-process', (event, counter) => {
        app.golem.stopProcess();
    });
}


module.exports = golemHandler;
