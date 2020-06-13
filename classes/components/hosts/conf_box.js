class ConfirmationBoxHost extends Component {
    constructor () {
        super (...arguments);

        this.activeConfirmation = null;
    }

    onStoreChanged (state) {
        if (state.confirmation !== this.activeConfirmation) {
            this.activeConfirmation = state.confirmation;

            this.forceUpdate ();
        }
    }

    render () {
        return this.activeConfirmation ? `
            <ConfirmationBox 
                title="${this.activeConfirmation.title}" 
                actions="${this.activeConfirmation.actions.join (',')}"
                callback="${this.activeConfirmation.callback ? this.activeConfirmation.callback : ''}"
                data="${this.activeConfirmation.data}"
            >
                ${this.activeConfirmation.text}
            </ConfirmationBox>
        ` : '';
    }
}

registerComponentClass (ConfirmationBoxHost);