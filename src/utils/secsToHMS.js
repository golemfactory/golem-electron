/**
 * [convertSecsToHrsMinsSecs function to format seconds as hh:mm:ss]
 * @param  {int}        sec     [seconds]
 * @return {String}             [hh:mm:ss]
 */
function convertSecsToHMS(sec) {
    let minutes = Math.trunc(sec / 60);
    let seconds = sec % 60;
    let hours = Math.trunc(minutes / 60);

    minutes = minutes % 60;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
}

module.exports = convertSecsToHMS