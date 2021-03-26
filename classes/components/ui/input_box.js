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
        const editBoxWidth = `width=${this.properties.editboxwidth ? this.properties.editboxwidth : "200px"}`;
        const fontSize = /*this.properties.fontsize ? this.properties.fontsize :*/ '25px';
        let layoutDependentStyle;

        if (dynMobileApp () && dynIsPortrait ()) {
            layoutDependentStyle = `
                x="10px"
                y="40px"
            `;
        } else {
            layoutDependentStyle = `
                float="right"
                marginRight="10px"
            `;
        }

        return `
            <div style="width:100%;background-color:yellow;height:fit-content;">
                <Label x="10px" y="10px" fontSize="${fontSize}">${this.properties.prompt}</Label>
                <EditBox
                    onchangeevent="${Events.INPUT_BOX_CONTENT_CHANGED}"
                    ${editBoxWidth}
                    ${layoutDependentStyle}
                    fontSize="${fontSize}"
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

