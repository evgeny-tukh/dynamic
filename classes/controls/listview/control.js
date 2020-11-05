class ListView extends Component {
    constructor () {
        super (...arguments);

        this.columns = [];
        this.items = [];
        this.config = {
            itemHeight: this.properties.itemheight ? parseInt (this.properties.itemheight) : 23,
            lineHeight: this.properties.lineheight ? parseInt (this.properties.lineheight) : 20,
            fontSize: this.properties.fontsize ? parseInt (this.properties.fontsize) : 20,
            fontBold: false,
            titleFontSize: this.properties.titlefontsize ? parseInt (this.properties.titlefontsize) : 22,
            titleFontBold: false,
            titleColor: this.properties.titlecolor ? this.properties.titlecolor : '#dddddd',
            color: this.properties.color ? this.properties.color : '#dddddd',
            selColor: this.properties.selcolor ? this.properties.selcolor : 'white',
            selBgColor: this.properties.selbgcolor ? this.properties.selbgcolor : 'transparent',
            maxHeight: this.properties.maxheight ? this.properties.maxheight : 'auto',
            width: this.properties.width ? this.properties.width : 'auto',
            itemSeparator: this.properties.itemsep ? this.properties.itemsep : ';;',
            columnSeparator: this.properties.colsep ? this.properties.colsep : ';',
            dataSeparator: this.properties.datasep ? this.properties.datasep : ':',
            fieldSeparator: this.properties.fieldSep ? this.properties.fieldSep : ';',
        };

        if (this.properties.onitemclick) this.config.onItemClick = this.properties.onitemclick;
        
        if (this.properties.columns) {
            const columns = this.properties.columns.split (this.config.columnSeparator);

            columns.forEach (column => {
                const parts = column.split (this.config.dataSeparator);

                if (parts.length > 1) {
                    this.addColumn (parts [0], parseInt (parts [1]));
                } else {
                    this.addColumn (parts [0], 100);
                }
            });
        }

        if (this.properties.items) {
            const items = this.properties.items.split (this.config.itemSeparator);

            items.forEach (item => {
                const parts = item.split (this.config.dataSeparator);

                if (parts.length === 1) {
                    this.addItem (parts [0].split (this.config.fieldSeparator));
                } else {
                    this.addItem (parts [0].split (this.config.fieldSeparator), parts [1]);
                }
            });
        }

        if (this.properties.action) this.config.actionName = this.properties.action;
        if (this.properties.selector) this.config.selector = this.properties.selector;
    }

    resetContent () {
        this.items = [];
    }

    isItemSelected (item) {
        if (this.config.selector) {
            return Component.callbacks.invoke (this.config.selector, item);
        } else {
            return false;
        }
    }

    addColumn (title, width) {
        this.columns.push ({
            title: title,
            width: width,
        });
    }

    addItem (fields, data) {
        this.items.push ({
            fields: fields,
            data: data,
        });
    }

    onScroll (div) {
        if (this.properties.scrollevent) {
            this.store.dispatch (ActionEvent.create (this.properties.scrollevent, div.scrollTop));
        }
    }

    render () {
        let items = '';
        const columns = JSON.stringify (this.columns);
        const config = JSON.stringify (this.config);

        this.items.forEach (item => {
            items += `
                <ListViewItem columns='${columns}' config='${config}' item='${JSON.stringify (item)}' selected='${this.isItemSelected (item) ? 1 : 0}'></ListViewItem>
            `;
        });

        return `
            <ListViewHeader columns='${columns}' config='${config}'></ListViewHeader>
            <div
                style="width:${this.config.width};height:${this.config.maxHeight};overflow-y:scroll;"
                onscroll="Component.all['${this.id}'].onScroll(this);");"
            >
                ${items}
            </div>
        `;
    }

    pastRender (parent, instance) {
        if (instance.properties.scroller) {
            try {
                const div = parent.children [1];

                if (div) {
                    div.scrollTop = Component.callbacks.invoke (this.properties.scroller, this);
            }
            } catch (error) {
                console.log (`Invalid scrolltop: ${error.message}`);
            }
        }
    }
}

registerComponentClass (ListView);
