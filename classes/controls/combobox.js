class ComboBox extends BaseControl {
    constructor () {
        super (...arguments);

        const number = stringToBool (this.properties.number);

        const items = super.getText ();

        this.items = items.length > 0 ? items.split (',') : [];

        this.tag = 'select';
        this.selection = this.properties.selection ? parseInt (this.properties.selection) : -1;
    }

    getText () {
        const instance = this;
        let result = '';

        this.items.forEach ((item, index) => {
            result += `<option value="${index}" ${index === instance.selection || item === instance.selection ? "selected" : ""}>${item}</option>\n`;
        });

        return result;
    }

    getAttributes () {
        return "size=1";
    }
}

registerComponentClass (ComboBox);
