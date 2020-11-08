const modules = ['event', 'renderer', 'store'];

function loadScript (path, onLoad, param) {
    const script = document.createElement ('script');

    script.src = path;
    script.async = true;
    script.onload = event => { onLoad (param); };

    document.body.appendChild (script);
}

function dynamicLoader (userScripts, onLoad, param) {
    let moduleIndex = -1;
    let scriptIndex = -1;

    if (!userScripts)
        userScripts = [];

    const loadNextModule = () => {
        if ((++moduleIndex) < modules.length)
            loadScript (`./${modules [moduleIndex]}.js`, loadNextModule, param);
        else
            loadNextScript ();
    }

    const loadNextScript = () => {
        if ((++scriptIndex) < userScripts.length)
            loadScript (userScripts [scriptIndex], loadNextScript);
        else if (onLoad)
            onLoad (param);
    }

    loadNextModule ();
}

function stringToBool (value) {
    let result;

    switch (typeof (value)) {
        case 'string':
            value = value.toLowerCase ();
            result = value === 'true' || value === 'yes' || value === 'on' || parseInt (value) > 0;

            break;

        case 'number':
            result = parseInt (value) != 0; break;

        default:
            result = false;
    }

    return result;
}

function formatIntWithLeadingZeros (value, numOfDigits) {
    let result = value.toString ();

    while (result.length < numOfDigits)
        result = '0' + result;

    return result;
}

function formatFloatWithLeadingZeros (value, numOfIntegralDigits, numOfFractalDigits) {
    const absValue = Math.abs (value);
    const integralPart = Math.trunc (absValue);
    let fractalPart = absValue - integralPart;
    const sign = value < 0 ? '-' : '';

    for (let i = 0; i < numOfFractalDigits; ++ i) {
        fractalPart *= 10;
    }

    return `${sign}${formatIntWithLeadingZeros (integralPart, numOfIntegralDigits)}.${formatIntWithLeadingZeros (Math.trunc (fractalPart), numOfFractalDigits)}`;
}

function formatCoord (angle, numOfDegChars, hsChars) {
    const absAngle = Math.abs (angle);
    const deg = Math.trunc (absAngle);
    const min = (absAngle - deg) * 60;
    const hsChar = angle > 0 ? hsChars.substr (0, 1) : hsChars.substr (1, 1);

    return `${formatIntWithLeadingZeros (deg, numOfDegChars)} ${formatFloatWithLeadingZeros (min, 2, 3)}${hsChar}`;
}

function checkNullableString (value) {
    return (value === 'null' || value.length === 0) ? null : value;
}

function isNotNothing (value) {
    return value || typeof (value) !== 'undefined' && value !== null;
}

function getTimestamp () {
    return new Date ().getTime ();
}

function recursiveCopyObject (source) {
    return JSON.parse (JSON.stringify (source));
}

function recursiveCopyObjectContent (dest, source) {
    for (const key in source) {
        if (typeof (source [key]) === 'object') {
            if (!dest [key] && source [key] && typeof (source [key]) === 'object') {
                dest [key] = {};
            }

            recursiveCopyObjectContent (dest [key], source [key]);

        } else {
            dest [key] = source [key];
        }
    }

    for (const key in dest) {
        if (!(key in source)) delete dest [key];
    }
}