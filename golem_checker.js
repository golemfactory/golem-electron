const {spawn, execFile, exec} = require('child_process');
var getpid = require('getpid');
const chalk = require('chalk')

let operatingSystem = process.platform
var golemCheck = function() {
    getpid('hyperg', function(err, pid) {
        if (err) {
            return handle_error(err);
        }

        if (Array.isArray(pid)) {
            // (Windows only) If the query matches multiple running process names
            // then you'll get an array of matched PIDs back
            console.log(`💻 This platform is ${operatingSystem}`);
            console.log(`💻 Golem is running like a charm with this pid ${pid.join('-')}`);
            console.log()
        //pid.forEach(say_hello);
        } else {
            // Even if no errors occurred, pid may still be null/undefined if it wasn't found
            if (pid) {
                console.log(`💻 This platform is ${operatingSystem}`);
                console.log(`💻 Golem is running like a charm with this pid ${pid}`);
                console.log()
            } else {
                console.log(`💻 This platform is ${operatingSystem}`);
                console.log(`💻 Golem is not running. So we decided to make it running.`);
                console.log()
                console.log(`⏳ Golem starting...`);
                console.log()
                let golemProcess = spawn('golemapp')

                golemProcess.stdout.on('data', (data) => {
                    console.log("stdout", data.toString('utf8'));
                    console.log()
                });

                golemProcess.stderr.on('data', (data) => {
                    console.log(`⏳ There's an error like: `, data.toString('utf8'));
                    console.log()
                });

                golemProcess.on('close', (code) => {
                    console.log(`golem child process exited with code ${code}`);
                });
            }
        }
    });
}

module.exports = golemCheck