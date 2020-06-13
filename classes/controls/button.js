class SimpleButton extends BaseControl {
    constructor () {
        super (...arguments);

        this.tag = 'button';
    }
}

registerComponentClass (SimpleButton);
