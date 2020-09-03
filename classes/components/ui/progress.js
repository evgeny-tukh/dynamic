var ProgressIndicatorContainer = Styled.Div`
    width: fit-content;
    height: fit-content;
    margin: auto;
    top: 40%;
    left: 40%;
    border: none;
    z-index: 100;
    position: absolute;
`;

class ProgressIndicator extends Wnd {
    constructor () {
        super (...arguments);

        this.active = this.store.state.progressIndicator.visible;
    }

    onStoreChanged (state) {
        if (this.active !== state.progressIndicator.visible) {
            this.active = state.progressIndicator.visible;

            this.forceUpdate ();
        }
    }

    render () {
        return this.active ? `
            <ProgressIndicatorContainer>
                <img src="${this.properties.path}" />
            </ProgressIndicatorContainer>
        ` : '';
    }
}

registerComponentClass (ProgressIndicator);
registerComponentClass (ProgressIndicatorContainer);
