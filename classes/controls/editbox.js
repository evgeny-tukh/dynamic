class EditBox extends BaseControl {
    constructor () {
        super (...arguments);

        const number = stringToBool (this.properties.number);
        const password = stringToBool (this.properties.password);

        this.tag = 'input';
        this.attributes = `value="${super.getText ()}" type="${this.getType ()}"`;
        
        if (number && this.properties.min)
            this.attributes += ` min="${this.properties.min}"`;

        if (number && this.properties.max)
            this.attributes += ` max="${this.properties.max}"`;

        if (number && this.properties.step)
            this.attributes += ` step="${this.properties.step}"`;

        if (this.properties.name)
            this.attributes += ` name="${this.properties.name}"`;

        this.attributes += ` autocomplete="${this.properties.autocomplete ? 'on' : 'new-password'}"`;
    }

    getType () {
        const number = stringToBool (this.properties.number);
        const password = stringToBool (this.properties.password);

        if (number) {
            return 'number';
        } else if (password) {
            return 'password';
        } else {
            return 'text';
        }
    }

    getBasicStyle () {
        let result = super.getBasicStyle ();

        if (result.length > 0 && result.substr (result.length - 1, 1) !== ';')
            result += ';';

        return `
            ${result}
            background-color: white;
            border: solid 1px black;
            border-radius: 5px;
        `;
    }

    getText () {
        return '';
    }

    getAttributes () {
        return this.attributes;
    }
}

registerComponentClass (EditBox);
