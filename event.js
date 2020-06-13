class ActionEvent {
    constructor (id, payload) {
        this.id = id;
        this.payload = payload;
    }

    static create (id, payload) {
        return new ActionEvent (id, payload);
    }
}

ActionEvent.BASE_EVENTS = {
    OPEN_CONF_BOX: 'OpenConfBox',
    CLOSE_CONF_BOX: 'CloseConfBox',
    OPEN_INPUT_BOX: 'OpenInputBox',
    CLOSE_INPUT_BOX: 'CloseInputBox',
    INPUT_BOX_CONTENT_CHANGED: 'InputBoxContextChanged',

    OPEN_WINDOW: 'OpenWindow',
    CLOSE_WINDOW: 'CloseWindow',
};
