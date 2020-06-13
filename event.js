class ActionEvent {
    constructor (id, payload) {
        this.id = id;
        this.payload = payload;
    }

    static create (id, payload) {
        return new ActionEvent (id, payload);
    }
}