class DataHolder extends Label {
    constructor () {
        super (...arguments);
    }

    getText () {
        return (this.element.innerText === 'null' || this.element.innerText.length === 0) ? null : this.element.innerText;
    }
}

registerComponentClass (DataHolder);
