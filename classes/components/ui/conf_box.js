var ConfirmationBoxTextContainer = Styled.Div`
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background-color: lightgray;
    color: black;
    font-size: 25px;
    font-weight: normal;
    padding-top: 10px;
`;

class ConfirmationBox extends Wnd {
    constructor () {
        super (...arguments);

        this.confirmed = false;
        this.actions = this.parseActionList ();
        this.data = this.properties.data ? this.properties.data : null;
        this.callback = (this.properties.callback && this.properties.callback.length > 0) ? this.properties.callback : null;

        this.properties.width = 600;
        this.properties.height = 300;
        this.closeEvent = Events.CLOSE_CONF_BOX;
    }

    parseActionList () {
        let result;

        if (this.properties.actions) {
            result = this.properties.actions.split (',').map (action => { 
                const val = parseInt (action);

                // Return either numeric value or string value, depends on content
                return isNaN (val) ? action : val; 
            });
        } else if (this.action) {
            let val = parseInt (this.properties.action);

            // Insert number or string, depends on content
            if (isNaN (val)) val = this.properties.action;

            result = [val];
        } else {
            result = null;
        }

        return result;
    }

    styleGetter () {
        return "left:30%;width:40%;top:30%;height:200px;";
    }

    onOk () {
        this.confirmed = true;

        this.onClose ();
    }

    onCancel () {
        this.false = true;

        this.onClose ();
    }

    onClose () {
        this.store.dispatch (ActionEvent.create (this.closeEvent));

        if (this.confirmed) {
            if (this.actions) {
                this.actions.forEach (action => { this.store.dispatch (ActionEvent.create (action, this.data)) });
            }

            if (this.callback) {
                Component.callbacks.invokeAsync (this.callback, this.data);
            }
        }
    }

    renderChildren () {
        return `
            <WndClientContainer>${this.getText ()}</WndClientContainer>
            <WndButtonBar>
                <WndButton x="10px" onclick="${this.id}.onOk">Ok</WndButton>
                <WndButton x="170px" onclick="${this.id}.onCancel">Cancel</WndButton>
            </WndButtonBar>
        `;
    }
}

registerComponentClass (ConfirmationBox);
registerComponentClass (ConfirmationBoxTextContainer);
