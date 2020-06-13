var CollapsedMenuContainer = Styled.Div`
    left: 20px;
    top: 20px;
    width: fit-content;
    height: fit-content;
    border: solid 2px black;
    border-radius: 4px;
    background-color: white;
`;

var ExpandedMenuContainer = Styled.Div`
    display: block;
    position: absolute;
    left: 20px;
    top: 20px;
    width: 300px;
    bottom: 20px;
    border: solid 2px black;
    border-radius: 6px;
    background-color: cyan;
    color: black;
    padding: 20px;
    padding-top: 40px;
    font-size: 25px;
    font-weight: bold;
`;

MenuCtlItemContainer = Styled.Div`
    display: block;
    left: 0;
    width: 100%;
    height: fit-content;
    margin: 0;
    margin-top: 5px;
    margin: 5px;
`;

CollapsedMenuContainer.hover = 'background-color: yellow; cursor: pointer;';
ExpandedMenuContainer.hover = 'background-color: white';
MenuCtlItemContainer.hover = 'color: blue; cursor: pointer;';

class MenuControlItem extends Component {
    constructor () {
        super (...arguments);
    }

    onClick (params) {
        if (params && params.event) {
            if (params.payload) {
                this.store.dispatch (ActionEvent.create (params.event, params.payload));
            } else {
                this.store.dispatch (ActionEvent.create (params.event));
            }
        }
    }

    render () {
        let action;

        if (this.properties.event) {
            if (this.properties.payload) {
                action = `,{
                    event: '${this.properties.event}',
                    payload: '${this.properties.payload}',
                }`;
            } else {
                action = `,{
                    event: '${this.properties.event}',
                }`;
            }
        } else {
            action = '';
        }

        return `
            <MenuCtlItemContainer onclick="Component.invokeMethod('${this.id}','onClick'${action});">${this.properties.name}</MenuCtlItemContainer>
        `;
    }
}

class MenuControl extends Component {
    constructor () {
        super (...arguments);

        this.stateKey = this.properties.statekey ? this.properties.statekey : 'menuExpanded';
        this.eventName = this.properties.event ? this.properties.event : 'ExpandMenu';
        this.expanded = this.store.state [this.stateKey];
        this.items = [];

        const items = this.properties.items.split (';');

        items.forEach (item => {
            if (item === '-') {
                this.items.push ({ separator: true });
            } else {
                const parts = item.split ('=');

                if (parts.length > 1) {
                    const item = { name: parts [0] };
                    const params = parts [1].split (',');

                    item.event = params [0];

                    if (params.length > 1)
                        item.payload = params [1];

                    this.items.push (item);
                }
            }
        });
    }

    onCollapsedMenuClick () {
        this.store.dispatch (ActionEvent.create (this.eventName, !this.expanded));
    }

    onStoreChanged (state) {
        if (state [this.stateKey] !== this.expanded) {
            this.expanded = state [this.stateKey];

            this.forceUpdate ();
        }
    }

    collapse () {
        this.store.dispatch (ActionEvent.create (this.eventName, false));
    }

    render () {
        let size = 48;

        if (this.properties.size) size = parseInt (this.properties.size);

        if (size !== 48 && size !== 64 && size !== 72 && size !== 96) size = 48;

        if (this.expanded) {
            let items = '';

            this.items.forEach (item => {
                if (item.separator) {
                    items += '<br/>';
                } else if (item.payload) {
                    items += `<MenuControlItem name="${item.name}" event="${item.event}" payload="${item.payload}"></MenuControlItem>\n`;
                } else {
                    items += `<MenuControlItem name="${item.name}" event="${item.event}"></MenuControlItem>\n`;
                }
            });

            return `
                <ExpandedMenuContainer>
                    <CloseIcon color="black" onclick="${this.id}.collapse"></CloseIcon>
                    ${items}
                </ExpandedMenuContainer>
            `;
        } else {
            return `
                <CollapsedMenuContainer onclick="Component.invokeMethod('${this.id}','onCollapsedMenuClick');">
                    <img src="res/hb${size}.png">
                </CollapsedMenuContainer>
            `;
        }
    }
}

registerComponentClass (MenuControl);
registerComponentClass (MenuControlItem);
registerComponentClass (MenuCtlItemContainer);
registerComponentClass (CollapsedMenuContainer);
registerComponentClass (ExpandedMenuContainer);