class SafeThread {
    constructor (func, pause, context) {
        this.context = context ? context : window;
        this.func = func ? func : context => {};
        this.pause = pause ? pause : 1000;
        this.timer = null;
    }

    start () {
        const instance = this;

        stop ();

        this.timer = setInterval (context => {
            if (instance.func) {
                instance.func (context);
            }
        }, this.pause, this.context);
    }

    stop () {
        if (this.timer) clearInterval (this.timer);
    }
}