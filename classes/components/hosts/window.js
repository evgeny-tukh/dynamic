class WindowHost extends Component {
    constructor () {
        super (...arguments);

        this.activeConfirmation = null;
        this.lastChange = this.store.state.windows.lastChange;
    }

    onStoreChanged (state) {
        if (state.windows.lastChange !== this.lastChange) {
            this.lastChange = state.windows.lastChange;

            this.forceUpdate ();
        }
    }

    render () {
        let result = '';

        this.store.state.windows.list.forEach (window => {
            if (window.component) {
                result += `<${window.component} ${window.props}></${window.component}>\n`;
            } else {
                result += `<${window}></${window}>\n`;
            }
        });

        return result;
    }
}

registerComponentClass (WindowHost);