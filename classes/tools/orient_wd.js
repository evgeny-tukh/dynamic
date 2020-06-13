class OrientationWatchdog extends Component {
    constructor () {
        super (...arguments);

        const instance = this;

        this.landscape = app.landscapeMode;

        window.addEventListener (
            'onorientationchange', 
            event => {
                instance.store.dispacth (ActionEvent.create (Events.ORIENTATION_CHANGED));
            }
        );
    }

    onStoreChanged (state) {
        if (this.landscape !== state.landscape) {
            this.landscape = state.landscape;

            setBodyClass ();
        }
    }

    render () {
        return '';
    }
}

registerComponentClass (OrientationWatchdog);
