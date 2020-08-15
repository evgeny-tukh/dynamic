var WndButtonBar = Styled.Div`
    position: absolute;
    width: 100%;
    bottom: 0px;
    height: 70px;
`;

class WndButton extends SimpleButton {
    constructor () {
        super (...arguments);

        this.updateTimer = null;
        
        if (this.properties.enabled)
            this.properties.enabled = stringToBool (this.properties.enabled);
        else
            this.properties.enabled = true;

        this.properties.y = 0;
        if (!this.properties.width) this.properties.width = '150px';
        if (!this.properties.height) this.properties.height = '60px';
        if (!this.properties.fontsize) this.properties.fontsize = '25px';
        if (!this.properties.color) this.properties.color = this.properties.enabled ? 'white' : '#333333';
        if (!this.properties.bgGrayed) this.properties.bgGrayed = '#888888';
        if (!this.properties.bg) this.properties.bg = 'blue';
        if (!this.properties.borderradius) this.properties.borderradius = '5px';
        if (!this.properties.background) this.properties.background = this.properties.enabled ? this.properties.bg : this.properties.bgGrayed;
        if (!this.properties.boxshadow) this.properties.boxshadow = '1px 1px 10px rgba(0,0,0,0.7)';
    }
}

registerComponentClass (WndButtonBar);
registerComponentClass (WndButton);
