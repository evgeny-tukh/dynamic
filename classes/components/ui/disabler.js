class Disabler extends Component {
    constructor () {
        super (...arguments);

        this.active = Component.callbacks.invoke (this.properties.checker, this.store.state);
    }

    onEvent (event) {
        if (event.id === this.properties.event) {
            const active = Component.callbacks.invoke (this.properties.checker, this.store.state);

            if (active !== this.active) {
                this.active = active;

                this.forceUpdate ();
            }
        }
    }

    render () {
        return this.active ? `
            <div
                style="
                    position: absolute;
                    left: ${this.properties.x ? this.properties.x : 0};
                    top: ${this.properties.y ? this.properties.y : 0};
                    width: ${this.properties.width ? this.properties.width : '100%'};
                    height: ${this.properties.height ? this.properties.height : '100%'};
                    background-color: ${this.properties.color ? this.properties.color : 'lightgray'};
                "
            />
        ` : '';
    }
}

registerComponentClass (Disabler);
