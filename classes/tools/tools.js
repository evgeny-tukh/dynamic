const BODY_DESKTOP_CLASS = 'bodyDesktop';
const BODY_MOBILE_PORTRAIT_CLASS = 'bodyMobilePortrait';
const BODY_MOBILE_LANDSCAPE_CLASS = 'bodyMobileLandscape';

function setBodyClass (body) {
    if (!body) {
        body = document.body;
    }

    if (App.mobileApp) {
        body.className = App.isLandscape () ? BODY_MOBILE_LANDSCAPE_CLASS : BODY_MOBILE_PORTRAIT_CLASS;
    } else {
        body.className = BODY_DESKTOP_CLASS;
    }
}

function isWindowsXp () {
    return navigator.userAgent.indexOf ('Windows NT 5.1') >= 0;
}

const SEC_IN_NON_LEAP_YEAR = 3600 * 24 * 365;
const SEC_IN_DAY = 3600 * 24;
const MONTH_SIZE = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function parseUnixTimestamp (timestamp) {
    // get number of full years passed since 01.01.1970
    const yearsPassed = Math.floor (timestamp / SEC_IN_NON_LEAP_YEAR);

    // get number of leap years in those; first leap year was 1972
    // so if 3 full years passed we had 1 leap year (3 + 1) / 4
    // if 7 full years passed we hadd 2 leap years (7 + 1) / 4
    // and so on
    const leapYearsPassed = (yearsPassed > 2) ? Math.floor ((yearsPassed + 1) / 4) : 0;

    // get number of seconds since last year has been started
    const numOfSecondsInLastYear = timestamp - yearsPassed * SEC_IN_NON_LEAP_YEAR - leapYearsPassed * SEC_IN_DAY;

    // check if current year is leap
    const isLeapYear = yearsPassed > 2 && ((yearsPassed - 2) % 4) == 0;

    // get number of full days passed since last year has been started
    const numOfDaysInLastYear = Math.floor (numOfSecondsInLastYear / SEC_IN_DAY);

    // count months
    let month = 0;
    let dayCount = numOfDaysInLastYear + 1;
    
    for (month = 0; month < 12; ++ month) {
        const monthSize = month != 1 ? MONTH_SIZE [month] : (isLeapYear ? 29 : 28);

        if (dayCount <= monthSize) break;

        dayCount -= monthSize;
    }

    // Get number of seconds in last day
    const numOfSecondsInLastDay = timestamp % SEC_IN_DAY;

    // Get an hour
    const hour = Math.floor (numOfSecondsInLastDay / 3600);

    // Get a minute
    const minute = Math.floor ((numOfSecondsInLastDay % 3600) / 60);

    // Get a second
    const second = numOfSecondsInLastDay % 60;

    return {
        year: yearsPassed + 1970,
        month: month,
        day: dayCount,
        hours: hour,
        minutes: minute,
        seconds: second,
        isLeap: isLeapYear,
    };
}

function formatIntLeadingZeros (value, numOfDigits) {
    let result = value.toString ();

    for (let i = result.length; i < numOfDigits; ++ i) result = '0' + result;

    return result;
}

function formatFloatLeadingZeros (value, integralLen, fractalLen) {
    let result = value.toFixed (fractalLen);
    let dotPos = result.indexOf ('.');

    while (dotPos < integralLen) {
        result = '0' + result;
        
        ++ dotPos;
    }

    return result;
}

function deformatUnixTimestamp (dateTimeString) {
    const [date, time] = dateTimeString.split (' ');
    let separatorChar = '-';
    let firstSeparatorPos = date.indexOf (separatorChar);
    let year, month, day;

    if (firstSeparatorPos < 0) {
        separatorChar = '/';
        firstSeparatorPos = date.indexOf (separatorChar);
    }

    if (firstSeparatorPos < 0) {
        separatorChar = '.';
        firstSeparatorPos = date.indexOf (separatorChar);
    }

    if (firstSeparatorPos < 0) {
        console.log (`Invalid date format ${date}`); return 0;
    }

    const dateParts = date.split (separatorChar);

    if (dateParts.length < 3) {
        console.log (`Invalid date format ${date}`); return 0;
    }

    if (dateParts [0].length === 4) {
        // YYYY MM DD
        year = parseInt (dateParts [0]);
        month = parseInt (dateParts [1]);
        day = parseInt (dateParts [2]);
    } else if (dateParts [2].length === 4) {
        if (separatorChar === '.') {
            // German format DD.MM.YYYY
            year = parseInt (dateParts [2]);
            month = parseInt (dateParts [1]);
            day = parseInt (dateParts [0]);
        } else {
            // MM DD YYYY
            year = parseInt (dateParts [2]);
            month = parseInt (dateParts [0]);
            day = parseInt (dateParts [1]);
        }
    } else if (separatorChar === '.') {
        // German format DD.MM.YY
        year = parseInt (dateParts [2] + 2000);
        month = parseInt (dateParts [1]);
        day = parseInt (dateParts [0]);
    } else {
        // MM DD YY
        year = parseInt (dateParts [2] + 2000);
        month = parseInt (dateParts [0]);
        day = parseInt (dateParts [1]);
    }

    const timeParts = time.split (':');

    const hours = parseInt (timeParts [0]);
    const minutes = timeParts.length > 1 ? parseInt (timeParts [1]) : 0;
    const seconds = timeParts.length > 2 ? parseInt (timeParts [2]) : 0;

    let numOfLeapYears = Math.floor ((year - 1968) / 4);
    const isLeap = ((year - 1968) % 4) == 0;
    
    if (isLeap && month > 2) ++ numOfLeapYears;

    let timestamp = ((year - 1970) * 365 + numOfLeapYears) * SEC_IN_DAY;

    for (let i = 1; i < month; ++ i) {
        timestamp += MONTH_SIZE [i-1] * SEC_IN_DAY;

        if (isLeap && i == 2) timestamp += SEC_IN_DAY;
    }

    timestamp += hours * 3600 + minutes * 60 + seconds;
    
    return timestamp;
}

function formatUnixTimestamp (timestamp, options) {
    const dateTime = parseUnixTimestamp (timestamp);

    if (!options) options = {};

    ['formatDate', 'formatTime', 'showSeconds'].forEach (option => {
        if (!(option in options)) options [option] = true;
    });

    let result = options.formatDate ? (
        formatIntLeadingZeros (dateTime.day, 2) + '.' +
        formatIntLeadingZeros (dateTime.month + 1, 2) + '.' + 
        dateTime.year
    ) : '';
    
    if (options.formatTime) {
        if (result.length > 0) result += ' ';

        result += (
            formatIntLeadingZeros (dateTime.hours, 2) + ':' +
            formatIntLeadingZeros (dateTime.minutes, 2) + 
            (options.showSeconds ? (':' + formatIntLeadingZeros (dateTime.seconds, 2)) : '')
        );
    }

    return result;
}

function formatLat (value) {
    const absValue = Math.abs (value);
    const deg      = Math.floor (absValue);
    const min      = (absValue - deg) * 60;

    return formatIntLeadingZeros (deg, 2) + ' ' + formatFloatLeadingZeros (min, 2, 3) + (value >= 0 ? 'N' : 'S');
}

function formatLon (value) {
    const absValue = Math.abs (value);
    const deg      = Math.floor (absValue);
    const min      = (absValue - deg) * 60;

    return formatIntLeadingZeros (deg, 3) + ' ' + formatFloatLeadingZeros (min, 2, 3) + (value >= 0 ? 'E' : 'W');
}
