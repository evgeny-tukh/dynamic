class ListViewCell extends Component {
    constructor () {
        super (...arguments);
    }

    render () {
        return `
            <div style="
                width: ${this.properties.width}px;
                height: fit-content;
                font-size: 20px;
                font-weight: regular;
                text-align: left;
                padding: 2px;
                padding-left: 5px;
                display: inline-block;
                margin: 0;
            ">
                ${this.properties.text}
            </div>
        `;
    }
}

registerComponentClass (ListViewCell);