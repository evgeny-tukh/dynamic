class App extends Component {
    constructor () {
        super (...arguments);

        window.addEventListener(
            "orientationchange", 
            () => {
                document.body.className = App.isLandscape () ? BODY_MOBILE_LANDSCAPE_CLASS : BODY_MOBILE_PORTRAIT_CLASS;

                this.store.dispatch (ActionEvent.create (Events.ORIENTATION_CHANGED, App.isLandscape ()));
            }
        );

        this.store.dispatch (ActionEvent.create (Events.SET_MOBILE, App.mobileApp));
    }

    render () {
        return '';
    }
}

class TurnableComponent extends Component {
    constructor () {
        super (...arguments);

        this.mobile = this.store.state.mobile;
        this.landscape = this.store.state.landscape;
    }

    onOrientationChanged () {
        this.forceUpdate ();
    }

    onStoreChanged (state) {
        if (this.landscape !== state.landscape) {
            this.landscape = state.landscape;

            this.onOrientationChanged ();
        }
    }
}

registerComponentClass (App);
registerComponentClass (TurnableComponent);

App.paramInfo = { raw: window.location.search.toLowerCase (), params: {}, parts: [] };

if (App.paramInfo.raw.length > 0 && App.paramInfo.raw[0] === '?') {
    App.paramInfo.parts = App.paramInfo.raw.substr (1).split ('&')

    App.paramInfo.parts.forEach (param => {
        const keyValue = param.split ('=');
    
        if (keyValue.length > 1) {
            App.paramInfo.params[keyValue[0]] = keyValue[1];
        } else {
            App.paramInfo.params[keyValue[0]] = true;
        }
    });
}

App.mobileApp = 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) ||
    parseInt (App.paramInfo.params.fm) === 1;

App.isLandscape = () => {
    let result;

    if (App.mobileApp) {
        let angle;

        if ('orientation' in screen) {
            angle = screen.orientation.angle;
        } else if ('orientation' in window) {
            angle = window.orientation.angle;
        } else {
            angle = 0;
        }

        result = Math.abs (angle) === 90;
    } else {
        result = App.paramInfo.params.fl;
    }

    return result;

    //return App.mobileApp && 'orientation' in window && Math.abs (window.orientation) === 90 || App.paramInfo.params.fl === 1;
};

//const app = new App;
