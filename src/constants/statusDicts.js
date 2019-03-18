const testStatusDict = Object.freeze({
    STARTED: 'Started',
    SUCCESS: 'Success',
    ERROR: 'Error'
})

const taskStatus = Object.freeze({
    WAITINGFORPEER: 'Waiting for peer',
    DEPOSIT: 'Creating the deposit',
    NOTREADY: 'Not started',
    READY: 'Ready',
    WAITING: 'Waiting',
    COMPUTING: 'Computing',
    FINISHED: 'Finished',
    TIMEOUT: 'Timeout',
    RESTART: 'Restart',
    FAILURE: 'Failure'
})

module.exports = {
    testStatusDict,
    taskStatus
}