/**
 * [convertSecsToHrsMinsSecs function to format seconds as hh:mm:ss]
 * @param  {int}        sec     [seconds]
 * @return {String}             [hh:mm:ss]
 */
function convertSecsToHMS(sec) {
    if(sec == "0" || sec == null){
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

function dayDiff(timeDiff){
    const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    const oneHour = 60*60*1000; // minutes*seconds*milliseconds
    const oneMin = 60*1000; // seconds*milliseconds
    const oneSec = 1000; // seconds*milliseconds

    const flatDay = Math.floor(Math.abs((timeDiff)/(oneDay)));
    const flatHour = (Math.floor(Math.abs((timeDiff)/(oneHour))) % 24);
    const flatMin = (Math.floor(Math.abs((timeDiff)/(oneMin))) % 60);
    const flatSec = (Math.floor(Math.abs((timeDiff)/(oneSec))) % 60);

    return  (flatDay ? flatDay + "d " : "") + 
            (flatHour ? flatHour + "h " : "") + 
            (flatMin ? flatMin + "m " : "") + 
            ((!flatDay && !flatHour && !flatMin) ? flatSec + "s " : "");
}

function timeStampToHR(timestamp, isFlatDate = false, onlyDate = false) {
    // Create a new JavaScript Date object based on the timestamp
    var date = new Date(parseInt(timestamp * (10 ** 3)));
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var days = date.getDate();
    var month = (date.getMonth() + 1); //January is 0!
    var year = date.getFullYear();


    var dd = days.toString().padStart(2, "0");
    var M = month.toString().padStart(2, "0");

    var formattedDate = dd + '/' + M + '/' + year;

    var ss = seconds.toString().padStart(2, "0");
    var mm = minutes.toString().padStart(2, "0");
    var hh = hours.toString().padStart(2, "0");

    // Will display time in 10:30:23 format
    var formattedTime = hh + ':' + mm + ':' + ss;

    if(onlyDate)
        return `${isDateToday(formattedDate) ? formattedTime : formattedDate}`

    // Will display time in 1d 10h 2m 10s format
    if(isFlatDate)
        return dayDiff(date)

    return `${isDateToday(formattedDate) ? '' : formattedDate + ' -'} ${formattedTime}`
}

module.exports = {
    convertSecsToHMS,
    timeStampToHR,
    isDateToday
}
