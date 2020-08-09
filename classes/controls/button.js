class SimpleButton extends BaseControl {
    constructor () {
        super (...arguments);

        this.tag = 'button';

        this.properties.cursor = 'pointer';
        this.properties.textalign = 'center';
    }
}

registerComponentClass (SimpleButton);
