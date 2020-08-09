class InputBox extends ConfirmationBox {
    constructor () {
        super (...arguments);

        this.data = this.store.state.input.data;
        this.closeEvent = Events.CLOSE_INPUT_BOX;
    }

    onStoreChanged (state) {
        if (state.input && state.input.data != this.data)
            this.data = state.input.data;
    }

    getText () {
        const numberProp = this.properties.number ? `number="${this.properties.number}"` : '';
        const minProp = this.properties.min ? `number="${this.properties.min}"` : '';
        const maxProp = this.properties.max ? `number="${this.properties.max}"` : '';
        const stepProp = this.properties.step ? `number="${this.properties.step}"` : '';

        return `
            <div style="width:100%;background-color:yellow;height:fit-content;">
                <Label x="10px" y="10px" fontSize="25px">${this.properties.prompt}</Label>
                <EditBox
                    onchangeevent="${Events.INPUT_BOX_CONTENT_CHANGED}"
                    float="right"
                    marginRight="10px"
                    width="200px"
                    fontSize="25px"
                    background="white"
                    color="black"
                    paddingLeft="2px"
                    ${numberProp} ${minProp} ${maxProp} ${stepProp}>
                    ${super.getText ()}
                </EditBox>
            </div>
        `;
    }
}

registerComponentClass (InputBox);

