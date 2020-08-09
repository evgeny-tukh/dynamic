class ListBox extends ComboBox {
    constructor () {
        super (...arguments);

        this.itemsVisible = this.properties.itemsvisible ? this.properties.itemsvisible : 2;
        this.checkBoxes = this.properties.checkboxes ? stringToBool (this.properties.checkboxes) : false;
    }

    getPrefix (item) {
        if (this.checkBoxes && this.properties.checker) {
            return (Component.callbacks.invoke (this.properties.checker, item) ? Symbols.checked : Symbols.unchecked) + ' ';
        } else {
            return '';
        }
    }

    getOptionClickHandler () {
        if (this.checkBoxes && this.properties.ontoggle) {
            return `onclick="handleOptionClick('${this.properties.ontoggle}',this);"`
        } else {
            return '';
        }
    }

    getAttributes () {
        return `size="${this.itemsVisible}"`;
    }
}

ListBox.checkItem = (checked, option, text) => {
    option.innerText = (checked ? Symbols.checked : Symbols.unchecked) + ' ' + text;
};

function handleOptionClick (externalHandler, option) {
    let data;

    switch (option.innerText.substr (0, 1)) {
        case Symbols.checked: {
            data = {
                checked: true,
                item: option.innerText.substr (2),
            };

            break;
        }

        case Symbols.unchecked: {
            data = {
                checked: false,
                item: option.innerText.substr (2),
            };

            break;
        }
        
        default: {
            data = {
                item: this.option.innerText,
            };
        }
    }

    data.option = option;

    Component.callbacks.invoke(externalHandler, data);
}

registerComponentClass (ListBox);
