class ListViewHeader extends Component {
    constructor () {
        super (...arguments);

        this.columns = JSON.parse (this.properties.columns);
        this.config = JSON.parse (this.properties.config);
    }

    render () {
        let fields = '';
        const style = `
            display: inline;
            font-size: ${this.config.titleFontSize}px;
            font-weight: ${this.config.titleFontBold ? 'bold' : 'normal'};
            color: ${this.config.titleColor};
        `;

        this.columns.forEach (column => {
            fields += `
                <ListViewCell
                    text="${column.title}"
                    width="${column.width}"
                    style="${style}"
                >
                </ListViewCell>
            `;
        });

        return `
            <div style="width: fit-content;height: fit-content;">${fields}</div>
        `;
    }
}

registerComponentClass (ListViewHeader);