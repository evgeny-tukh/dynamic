class Store {
    constructor () {
        // The state hash
        this.state = {};

        // event dispatchers
        this.dispatchers = [];
    }

    // Setting up the state (normally initial)
    setState (state) {
        this.state = state;
    }

    // Add state item or sub-state
    addStateItem (stateName, stateValue) {
        this.state [stateName] = stateValue;
    }

    // Add one more event dispatcher
    addDispatcher (dispatcher) {
        this.dispatchers.push (dispatcher);
    }

    // Event dispatcher
    dispatch (event, noHooks) {
        if (!noHooks) {
            Component.notifyEvent (event);
        }

        this.dispatchers.forEach (dispatcher => { 
            if (dispatcher (this.state, event) && !noHooks) {
                Component.notifyStoreChanged (this.state);
            }
        });
    }
}