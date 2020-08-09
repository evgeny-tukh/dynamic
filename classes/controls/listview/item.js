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

        if (this.config.onItemClick) {
            Component.callbacks.invoke (this.config.onItemClick, {
                column: parseInt (event.target.parentElement.instance.properties ['subitem']),
                item: this.item,
            });
        }
    }

    render () {
        let fields = '';
        const style = `
            display: inline;
            font-size: ${this.config.fontSize}px;
            font-weight: ${this.config.fontBold ? 'bold' : 'normal'};
            line-height: ${this.config.lineHeight}px;
            color: ${this.selected ? this.config.selColor : this.config.color};
            background-color: ${this.selected ? this.config.selBgColor : 'transparent'};
            padding: 0;
        `;

        this.columns.forEach ((column, index) => {
            fields += `
                <ListViewCell
                    text="${this.item.fields [index]}"
                    width="${column.width}"
                    style="${style}"
                    onclick="${this.id}.onClick"
                    subitem="${index}"
                >
                </ListViewCell>
            `;
        });

        return `
            <div style="width:fit-content;height:${this.config.itemHeight}px;padding:0;margin:0;line-height:10px;">${fields}</div>
        `;
    }
}

registerComponentClass (ListViewItem);