class Label extends BaseControl {
    constructor () {
        super (...arguments);

        this.tag = 'div';
    }
}

registerComponentClass (Label);
