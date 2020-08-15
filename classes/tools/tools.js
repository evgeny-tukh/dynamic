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