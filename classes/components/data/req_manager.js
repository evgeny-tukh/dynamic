class RequestManager extends Component {
    constructor () {
        super (...arguments);

        this.count = this.store.state.requests.count;
    }

    onStoreChanged (state) {
        if (state.requests.count !== this.count) {
            const request = state.requests.queue.splice (0, 1);

            this.count = state.requests.count;
        }
    }
}

registerComponentClass (RequestManager);
