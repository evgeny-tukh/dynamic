class EditBox extends BaseControl {
    constructor () {
        super (...arguments);

        const number = stringToBool (this.properties.number);

        this.tag = 'input';
        this.attributes = `value="${super.getText ()}" type="${number ? 'number' : 'text'}"`;
        
        if (number && this.properties.min)
            this.attributes += ` min="${this.properties.min}"`;

        if (number && this.properties.max)
            this.attributes += ` max="${this.properties.max}"`;

        if (number && this.properties.step)
            this.attributes += ` step="${this.properties.step}"`;
    }

    getText () {
        return '';
    }

    getAttributes () {
        return this.attributes;
    }
}

registerComponentClass (EditBox);
