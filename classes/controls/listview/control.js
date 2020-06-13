class ListView extends Component {
    constructor () {
        super (...arguments);

        this.columns = [];
        this.items = [];
        this.config = {
            itemHeight: 23,
            fontSize: 20,
            fontBold: false,
            titleFontSize: 22,
            titleFontBold: false,
            titleColor: '#dddddd',
            color: '#dddddd',
            selColor: 'white',
            selBgColor: 'transparent',
        };
    }

    resetContent () {
        this.items = [];
    }

    isItemSelected (item) {
        return false;
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
            ${items}
        `;
    }
}

registerComponentClass (ListView);
