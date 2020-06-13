class InputBoxHost extends Component {
    constructor () {
        super (...arguments);

        this.activeInput = null;
    }

    onStoreChanged (state) {
        if (state.input !== this.activeInput) {
            this.activeInput = state.input;

            this.forceUpdate ();
        }
    }

    render () {
        return this.activeInput ? `
            <InputBox
                title="${this.activeInput.title}"
                actions="${this.activeInput.actions.join (',')}"
                callback="${this.activeInput.callback ? this.activeInput.callback : ''}"
                prompt="${this.activeInput.prompt}"
            >
                ${this.activeInput.data}
            </InputBox>
        ` : '';
    }
}

registerComponentClass (InputBoxHost);