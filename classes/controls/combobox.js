class ComboBox extends BaseControl {
    constructor () {
        super (...arguments);

        const number = stringToBool (this.properties.number);

        const items = super.getText ();

        this.items = [];
        this.values = [];

        items.split (',').forEach ((item, index) => {
            const parts = item.split ('=');

            if (parts.length > 1) {
                this.items.push (parts [0]);
                this.values.push (parts [1]);
            } else {
                this.items.push (item);
                this.values.push (index);
            }
        });

        this.tag = 'select';
        this.selection = this.properties.selection ? parseInt (this.properties.selection) : -1;
    }

    getPrefix () {
        return '';
    }

    getOptionClickHandler () {
        return '';
    }

    getText () {
        const instance = this;
        let result = '';

        this.items.forEach ((item, index) => {
            result += `
                <option
                    ${this.getOptionClickHandler ()}
                    style="text-align:left;"
                    value="${instance.values [index]}"
                    ${index === instance.selection || item === instance.selection ? "selected" : ""}
                >
                    ${instance.getPrefix (item)}${item}
                </option>\n
            `;
        });

        return result;
    }

    getAttributes () {
        return "size=1";
    }
}

registerComponentClass (ComboBox);
