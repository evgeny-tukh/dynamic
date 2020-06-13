class ListViewItem extends Component {
    constructor () {
        super (...arguments);

        this.columns = JSON.parse (this.properties.columns);
        this.item = JSON.parse (this.properties.item);
        this.config = JSON.parse (this.properties.config);
        this.selected = this.properties.selected ? (this.properties.selected !== 'false' && this.properties.selected !== '0') : false;
    }

    onClick (event)  {
        if (this.config.actionName) {
            this.store.dispatch (ActionEvent.create (this.config.actionName, this.item));
        }
    }

    render () {
        let fields = '';
        const style = `
            display: inline;
            font-size: ${this.config.fontSize}px;
            font-weight: ${this.config.fontBold ? 'bold' : 'normal'};
            color: ${this.selected ? this.config.selColor : this.config.color};
            background-color: ${this.selected ? this.config.selBgColor : 'transparent'};
        `;

        this.columns.forEach ((column, index) => {
            fields += `
                <ListViewCell
                    text="${this.item.fields [index]}"
                    width="${column.width}"
                    style="${style}"
                    onclick="${this.id}.onClick"
                >
                </ListViewCell>
            `;
        });

        return `
            <div style="width: fit-content;height: ${this.config.itemHeight}px; padding: 0; margin: 0;">${fields}</div>
        `;
    }
}

registerComponentClass (ListViewItem);