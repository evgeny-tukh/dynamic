var CloseIconContainer = Styled.Div`
    position: absolute;
    padding: 0;
    margin: 0;
    right: 7px;
    top: 0;
    width: fit-content;
    height: fit-content;
    font-size: 30px;
    color: white;
    background: transparent;
    cursor: pointer;
`;

var WndClient = Styled.Div`
    position: absolute;
    padding: 0;
    margin: 0;
    top: 40px;
    bottom: 0px;
    width: 100%;
`;

var WndClientContainer = Styled.Div`
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

//CloseIconContainer.hover = 'color: white';

class CloseIcon extends Component {
    constructor () {
        super (...arguments);
    }

    render () {
        return `
            <CloseIconContainer>✖</CloseIconContainer>
        `;
    }
}

var WndContainer = Styled.Div`
    left: 10%;
    top: 10%;
    width: 80%;
    height: 80%;
    border-style: solid;
    border-color: white;
    border-width: 2px;
    border-radius: 5px;
    background-color: blue;
    position: absolute;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #eeeeee;
`;

class Wnd extends Component {
    constructor () {
        super (...arguments);

        this.componentName = 'Wnd';
    }

    onClose () {
        this.store.dispatch (ActionEvent.create (Events.CLOSE_WINDOW, this.componentName));
    }

    styleGetter () {
        return '';
    }

    renderChildren () {
        return '';
    }

    render () {
        WndContainer.styleGetter = this.styleGetter;

        const children = this.renderChildren ();
        
        return `
            <WndContainer>
                ${this.properties.title}
                <CloseIcon onclick="${this.id}.onClose"></CloseIcon>
                <WndClient>
                    ${children}
                </WndClient>
            </WndContainer>
        `;
    }
}

registerComponentClass (CloseIcon);
registerComponentClass (Wnd);
registerComponentClass (CloseIconContainer);
registerComponentClass (WndContainer);
registerComponentClass (WndClient);
registerComponentClass (WndClientContainer);
