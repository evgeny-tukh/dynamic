var OptionsContainer = Styled.Div`
    flex-direction: column;
    -webkit-flex-direction: column;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    height: fit-content;
    align-items: center;
`;

var OptionsItemContainer = Styled.Div`
    display: -webkit-inline-flex;
    display: inline-flex;
`;

//OptionsItemContainer.hover = 'color: #444444;';

class OptionsItem extends Component {
    constructor () {
        super (...arguments);

        this.selectedColor = this.properties.selectedcolor ? this.properties.selectedcolor : 'white';
        this.color = this.properties.color ? this.properties.color : 'black';
        this.hiliteColor = this.properties.hilitecolor ? this.properties.hilitecolor : '#444444';
        this.fontsize = this.properties.fontsize ? this.properties.fontsize : '16pt';
    }

    render () {
        const hiliteColor = this.properties.selected !== undefined ? this.selectedColor : this.hiliteColor;
        const color = this.properties.selected !== undefined ? this.selectedColor : this.color;
        const style = `style="color: ${color}; font-size: ${this.fontsize};"`;

        return `
            <OptionsItemContainer
                onmouseenter="event.target.style.color='${hiliteColor}';" 
                onmouseleave="event.target.style.color='${color}';"  
                ${style}
            >
                ${this.properties.title}
            </OptionsItemContainer>\n
        `;
    }
}

class Options extends Component {
    constructor () {
        super (...arguments);

        const separator = this.properties.separator ? this.properties.separator : ';';

        this.items = this.properties.options.split (';');
        this.selectedColor = this.properties.selectedcolor ? this.properties.selectedcolor : 'white';
        this.color = this.properties.color ? this.properties.color : 'black';
        this.hiliteColor = this.properties.hilitecolor ? this.properties.hilitecolor : '#444444';
        this.fontsize = this.properties.fontsize ? this.properties.fontsize : '16pt';
    }

    selectItem (event) {
        const optionsItem = event.target.parentElement.parentElement;
        const optionsContainer = this.element.firstElementChild;
        const optionsContainerDiv = optionsContainer.firstElementChild;

        for (let i = 0; i < optionsContainerDiv.childElementCount; ++ i) {
            if (optionsContainerDiv.children [i] === optionsItem) {
                this.properties.selection = i;

                this.forceUpdate (); 
                
                if (this.properties.onchange)
                    Component.launchMethod (this.properties.onchange, i);

                break;
            }
        }
    }

    render () {
        let style = 'background-color: transparent; border-style: none;';
        const selection = this.properties.selection === undefined ? -1 : parseInt (this.properties.selection);

        if (this.properties.fontsize)
            style += `font-size: ${this.properties.fontsize};`;

        if (this.properties.color)
            style += `color: ${this.properties.color};`;

        if (this.properties.fontsize)
            style += `fontsize: ${this.properties.fontsize};`;

        if (style.length > 0)
            style = `style="${style}"`;

        let result = `<OptionsContainer ${style}>`;

        for (let i = 0; i < this.items.length; ++ i) {
            const selected = selection == i ? 'selected' : '';

            result += `
                <OptionsItem
                    color="${this.color}" 
                    selectedColor="${this.selectedColor}" 
                    hiliteColor="${this.hiliteColor}" 
                    fontsize="${this.fontsize}"
                    onclick="${this.id}.selectItem" 
                    ${selected} 
                    title="${this.items[i]}"
                >
                </OptionsItem>\n
            `;
        }

        return result + '</OptionsContainer>';

        /*function selectItem (item) {
            if (this.properties.onchange) {
                this.properties.onchange (item);
            }
        }*/
    }
}

registerComponentClass (Options);
registerComponentClass (OptionsContainer);
registerComponentClass (OptionsItem);
registerComponentClass (OptionsItemContainer);