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
        const numberProp = this.activeInput && this.activeInput.number ? `number="${this.activeInput.number}"` : '';
        const minProp = this.activeInput && this.activeInput.min ? `number="${this.activeInput.min}"` : '';
        const maxProp = this.activeInput && this.activeInput.max ? `number="${this.activeInput.max}"` : '';
        const stepProp = this.activeInput && this.activeInput.step ? `number="${this.activeInput.step}"` : '';

        return this.activeInput ? `
            <InputBox
                title="${this.activeInput.title}"
                actions="${this.activeInput.actions.join (',')}"
                callback="${this.activeInput.callback ? this.activeInput.callback : ''}"
                prompt="${this.activeInput.prompt}"
                ${numberProp} ${minProp} ${maxProp} ${stepProp}
            >
                ${this.activeInput.data}
            </InputBox>
        ` : '';
    }
}

registerComponentClass (InputBoxHost);