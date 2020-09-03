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

Store.BASE_STATE = {
    mobile: false,
    landscape: false,

    progressIndicator: {
        visible: false,
        status: 0,
    },

    confirmation: null,
    input: null,

    windows: {
        lastChange: 0,
        list: [],
    },

    requests: {
        count: 0,
        queue: [],
    },

    user: {
        loggedIn: false,
        userID: null,
        userName: '',
        password: '',
        loginFailed: false,
    },
};

Store.openWindow = (state, componentName) => {
    state.windows.lastChange = getTimestamp ();
    state.windows.list.push (componentName);
};

Store.findWindow = (state, componentName) => {
    return state.windows.list.findIndex (window => {
        return window.component === componentName || window && !window.component && window === componentName;
    });
}
Store.closeWindow = (state, componentName) => {
    const index = Store.findWindow (state, componentName);

    if (index >= 0) {
        state.windows.lastChange = getTimestamp ();
        
        state.windows.list.splice (index, 1);
    }
}

Store.openInputBox = (state, data) => {
    state.input = data;
};

Store.openConfBox = (state, data) => {
    state.confirmation = data;
};

Store.closeConfBox = state => {
    state.confirmation = null;
};

Store.closeInputBox = state => {
    state.input = null;
};

Store.onInputBoxContentChanged = (state, data) => {
    if (state.input.data) {
        state.input.data = data;
    }
};

Store.processBaseEvent = (state, event) => {
    let result = true;

    switch (event.id) {
        case Events.OPEN_INPUT_BOX: {
            Store.openInputBox (state, event.payload); break;
        }

        case Events.OPEN_CONF_BOX: {
            Store.openConfBox (state, event.payload); break;
        }

        case Events.CLOSE_CONF_BOX: {
            Store.closeConfBox (state); break;
        }
        
        case Events.CLOSE_INPUT_BOX: {
            Store.closeInputBox (state); break;
        }

        case Events.INPUT_BOX_CONTENT_CHANGED: {
            Store.onInputBoxContentChanged (state, event.payload); break;
        }
        
        case Events.OPEN_WINDOW: {
            Store.openWindow (state, event.payload); break;
        }

        case Events.CLOSE_WINDOW: {
            Store.closeWindow (state, event.payload); break;
        }

        case Events.LOGGED_IN: {
            state.user.userID = event.payload.userID;
            state.user.userName = event.payload.userName;
            state.user.roles = event.payload.roles;
            state.user.loggedIn = true;
            state.user.loginFailed = false;

            break;
        }

        case Events.LOGGED_OUT: {
            state.user.userID = null;
            state.user.loggedIn = false;

            break;
        }

        case Events.USER_NAME_CHANGED: {
            state.user.userName = event.payload; break;
        }

        case Events.PASSWORD_CHANGED: {
            state.user.password = event.payload; break;
        }

        case Events.LOGIN_FAILED: {
            state.user.loginFailed = true; break;
        }

        case Events.SHOW_PROGRESS_INDICATOR: {
            state.progressIndicator.visible = event.payload; break;
        }

        default: {
            result = false;
        }
    }

    return result;
};