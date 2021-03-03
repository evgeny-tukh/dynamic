class BaseControl extends Component {
    constructor () {
        super (...arguments);

        this.tag = 'base';
        this.id = `bctl${BaseControl.count++}`;
        this.onClickEvent = BaseControl.decodeEvent (this.properties.onclickevent);
        this.onChangeEvent = BaseControl.decodeEvent (this.properties.onchangeevent);
        this.onBlurEvent = BaseControl.decodeEvent (this.properties.onblurevent);
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
        const textAlign = this.properties.textalign ? this.properties.textalign : 'inherit';
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
        //const width = this.properties.width ? this.properties.width : 'fit-content';
        //const height = this.properties.height ? this.properties.height : 'fit-content';
        const padding = this.properties.padding ? this.properties.padding : 'initial';
        const paddingLeft = this.properties.paddingleft ? this.properties.paddingleft : padding;
        const paddingRight = this.properties.paddingright ? this.properties.paddingright : padding;
        const paddingTop = this.properties.paddingtop ? this.properties.paddingtop : padding;
        const paddingBottom = this.properties.paddingbottom ? this.properties.paddingbottom : padding;
        const margin = this.properties.margin ? this.properties.margin : 'initial';
        const marginLeft = this.properties.marginleft ? this.properties.marginleft : margin;
        const marginRight = this.properties.marginright ? this.properties.marginright : margin;
        const marginTop = this.properties.margintop ? this.properties.margintop : margin;
        const marginBottom = this.properties.marginbottom ? this.properties.marginbottom : margin;
        const cursor = this.properties.cursor ? this.properties.cursor : 'default';
        const display = this.properties.display ? this.properties.display : 'initial';
        const zIndex = this.properties.zindex ? this.properties.zindex : 'initial';
        const position = this.properties.position ? this.properties.position : 'initial';
        const boxShadow = this.properties.boxshadow ? this.properties.boxshadow : 'initial';

        return `
            outline-style: none;
            user-select: none;
            -moz-user-select: none;
            text-align: ${textAlign};
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
            padding: ${padding};
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
            display: ${display};
            z-index: ${zIndex};
            position: ${position};
            box-shadow: ${boxShadow};
        `;
    }

    getPosition () {
        let position = '';

        if (isNotNothing (this.properties.x) && isNotNothing (this.properties.y)) {
            position = `
                position:absolute;
                left:${this.properties.x};
                top:${this.properties.y};
            `;

            if (this.properties.width) {
                position += `width:${this.properties.width};`;
            } else if (this.properties.right) {
                position += `right:${this.properties.right};`;
            }

            if (this.properties.height) {
                position += `height:${this.properties.height};`;
            } else if (this.properties.bottom) {
                position += `bottom:${this.properties.bottom};`;
            }
        } else {
            if (this.properties.width) position += `width:${this.properties.width};`;
            if (this.properties.height) position += `height:${this.properties.height};`;
            if (this.properties.right) position += `width:${this.properties.right};`;
            if (this.properties.bottom) position += `height:${this.properties.bottom};`;
        }

        return position;
    }

    getValueToDispatch (event) {
        return event.target.value;
    }

    dispatchEvent (event) {
        switch (event.type) {
            case 'click': {
                if (this.oncClickEvent)
                    this.store.dispatch (ActionEvent.create (this.onClickEvent, this.getValueToDispatch (event)));

                break;
            }
            case 'change': {
                if (event.target.tagName === 'SELECT') break;
                if (['text', 'password', 'number'].indexOf (event.target.type) >= 0) break;
            }
            case 'input': {
                if (event.target.tagName === 'SELECT' && this.properties.validateselection && !Component.callbacks.invoke (this.properties.validateselection, event)) {
                    event.stopPropagation (); break;
                }
                if (this.onChangeEvent)
                    this.store.dispatch (ActionEvent.create (this.onChangeEvent, this.getValueToDispatch (event)));

                break;
            }
            case 'blur': {
                if (this.onBlurEvent) {
                    this.store.dispatch (ActionEvent.create (this.onBlurEvent, this.getValueToDispatch (event)));
                } else {
                    event.stopPropagation ();
                }
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
                onblur="dispatchBaseCtlEvent (event);"
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
    let target = event.target;

    if (target.tagName.toUpperCase () === 'OPTION')
        target = target.parentElement;

    Component.all [target.parentElement.id].dispatchEvent (event);
}
