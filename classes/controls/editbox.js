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

        if (this.properties.autocomplete)
            this.attributes += ' autocomplete="on"';
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

    getText () {
        return '';
    }

    getAttributes () {
        return this.attributes;
    }
}

registerComponentClass (EditBox);
