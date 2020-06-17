class BaseControl extends Component {
    constructor () {
        super (...arguments);

        this.tag = 'base';
        this.id = `bctl${BaseControl.count++}`;
        this.onClickEvent = BaseControl.decodeEvent (this.properties.onclickevent);
        this.onChangeEvent = BaseControl.decodeEvent (this.properties.onchangeevent);
    }

    static decodeEvent (eventID) {
        let result;

        if (!eventID) {
            result = null;
        } else {
            result = parseInt (eventID);

            if (isNaN (result)) result = eventID;
        }

        return result;
    }

    getAttributes () {
        return '';
    }

    getBasicStyle () {
        const float = this.properties.float ? this.properties.float : 'initial';
        const fontSize = this.properties.fontsize ? this.properties.fontsize : '20px';
        const fontWeight = stringToBool (this.properties.bold) ? 'bold' : 'normal';
        const fontItalic = stringToBool (this.properties.italic) ? 'italic' : 'normal';
        const fontFamily = this.properties.font ? `font-family:'${this.properties.font}';` : '';
        const color = this.properties.color ? this.properties.color : 'black';
        const bg = this.properties.background ? this.properties.background : 'initial';
        const borderRadius = this.properties.borderradius ? this.properties.borderradius : 'initial';
        const borderWidth = this.properties.borderwidth ? this.properties.borderwidth : 'initial';
        const borderColor = this.properties.bordercolor ? this.properties.bordercolor : 'initial';
        const borderStyle = this.properties.borderstyle ? this.properties.borderstyle : 'initial';
        const width = this.properties.width ? this.properties.width : 'fit-content';
        const height = this.properties.height ? this.properties.height : 'fit-content';
        const paddingLeft = this.properties.paddingleft ? this.properties.paddingleft : 'initial';
        const paddingRight = this.properties.paddingright ? this.properties.paddingright : 'initial';
        const paddingTop = this.properties.paddingtop ? this.properties.paddingtop : 'initial';
        const paddingBottom = this.properties.paddingbottom ? this.properties.paddingbottom : 'initial';
        const marginLeft = this.properties.marginleft ? this.properties.marginleft : 'initial';
        const marginRight = this.properties.marginright ? this.properties.marginright : 'initial';
        const marginTop = this.properties.margintop ? this.properties.margintop : 'initial';
        const marginBottom = this.properties.marginbottom ? this.properties.marginbottom : 'initial';
        const cursor = this.properties.cursor ? this.properties.cursor : 'default';

        return `
            font-size: ${fontSize};
            font-weight: ${fontWeight};
            font-style: ${fontItalic};
            ${fontFamily}
            color: ${color};
            background: ${bg};
            border-radius: ${borderRadius};
            border-style: ${borderStyle};
            border-color: ${borderColor};
            border-width: ${borderWidth};
            padding-left: ${paddingLeft};
            padding-right: ${paddingRight};
            padding-top: ${paddingTop};
            padding-bottom: ${paddingBottom};
            margin-left: ${marginLeft};
            margin-right: ${marginRight};
            margin-top: ${marginTop};
            margin-bottom: ${marginBottom};
            float: ${float};
            cursor: ${cursor};
        `;
    }

    getPosition () {
        let position = '';

        if (isNotNothing (this.properties.x) && isNotNothing (this.properties.y)) {
            position = `
                position:absolute;
                left:${this.properties.x};
                top:${this.properties.y};
                width:${this.properties.width};
                height:${this.properties.height};
            `;
        } else {
            if (this.properties.width) position += `width:${this.properties.width};`;
            if (this.properties.height) position += `height:${this.properties.height};`;
        }

        return position;
    }

    getValueToDispatch () {
        return event.target.value;
    }

    dispatchEvent (event) {
        switch (event.type) {
            case 'click': {
                if (this.oncClickEvent)
                    this.store.dispatch (ActionEvent.create (this.oncClickEvent, this.getValueToDispatch ()));

                break;
            }

            case 'change':
            case 'input': {
                if (this.onChangeEvent)
                    this.store.dispatch (ActionEvent.create (this.onChangeEvent, this.getValueToDispatch ()));

                break;
            }
        }
    }

    render () {
        return `
            <${this.tag}
                ${this.getAttributes ()}
                id="${this.id}"
                style="${this.getBasicStyle ()} ${this.getPosition ()}"
                onchange="dispatchBaseCtlEvent (event);"
                oninput="dispatchBaseCtlEvent (event);"
                onclick="dispatchBaseCtlEvent (event);"
            >
                ${this.getText ()}
            </${this.tag}>
        `;
    }
}

BaseControl.count = 1;

registerComponentClass (BaseControl);

function dispatchBaseCtlEvent (event) {
    const handlerName = `on${event.type}`;

    Component.all [event.target.parentElement.id].dispatchEvent (event);
}
