/**
 * [convertSecsToHrsMinsSecs function to format seconds as hh:mm:ss]
 * @param  {int}        sec     [seconds]
 * @return {String}             [hh:mm:ss]
 */
function convertSecsToHMS(sec) {
    if(sec == "0"){
        return "Unknown"
    }
    let minutes = Math.trunc(sec / 60);
    let seconds = (sec % 60).toFixed(0);
    let hours = Math.trunc(minutes / 60);

    minutes = minutes % 60;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
}

function isDateToday(date) {
    let today = new Date();
    let givenDay = new Date(date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
    return (today.toDateString() == givenDay.toDateString());
}

function timeStampToHR(timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    var date = new Date(parseInt(timestamp * (10 ** 3)));
    var days = "0" + date.getDate();
    var month = "0" + (date.getMonth() + 1); //January is 0!
    var year = date.getFullYear();

    var formattedDate = days.substr(-2) + '/' + month.substr(-2) + '/' + year;
    // Hours part from the timestamp
    var hours = "0" + date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return `${isDateToday(formattedDate) ? '' : formattedDate + ' -'} ${formattedTime}`
}

module.exports = {
    convertSecsToHMS,
    timeStampToHR,
    isDateToday
}