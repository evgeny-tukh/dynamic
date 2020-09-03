function registerComponentClass (componentClass) {
    const name = componentClass.name ? componentClass.name : findVariableName (componentClass);

    Component.list.push ({
        name: name,
        ctor: componentClass,
        upperCaseName: name.toUpperCase (),
    });
}

// Determine name of the referenced object variable
// Non-applicable for non-objects
function findVariableName (variable, object) {
    let result = null;
    const type = typeof (variable);

    if (type === 'object' || type === 'function') {
        if (!object)
            object = window;

        const keys = Object.keys (object);

        for (let i = 0; i < keys.length; ++ i) {
            const key = keys [i];

            if (key === 'webkitStorageInfo') continue;

            if (key in object && object [key] === variable) {
                result = key; break;
            }
        }
    }

    return result;
}

function findVariableByName (name, object, caseInsensitive) {
    const type = typeof (object);
    let result = null;

    if (!caseInsensitive)
        caseInsensitive = false;

    if (caseInsensitive)
        name = name.toLowerCase ();

    if (type === 'object' || type === 'function') {
        if (!object)
            object = window;

        const keys = Object.keys (object);

        for (let i = 0; i < keys.length; ++ i) {
            let key = keys [i];
            
            if (caseInsensitive)
                key = key.toLowerCase ();

            if (key === name) {
                result = object [keys [i]]; break;
            }
        }
    }

    return result;
}

function createCssClass (className, css) {
    var head         = document.getElementsByTagName ('head') [0];
    var styleElement = document.createElement ('style');
    var rules;
    
    rules = document.createTextNode (`.${className} { ${css} }`);

    rules.id = className;
    
    styleElement.type = 'text/css';
    
    if (styleElement.styleSheet)
        styleElement.styleSheet.cssText = rules.nodeValue;
    else
        styleElement.appendChild (rules);
    
    head.appendChild (styleElement);
    
    return styleElement;
};

function Styled (css, tag, element) {
    let style = '';

    if (!element.styleName || !document.getElementById (element.styleName)) {
        element.styleName = `_sty_comp_${(Styled.instanceCounter++)}`;

        createCssClass (element.styleName, css);

        const instance = findVariableByName (element.tagName, window, true);

        if (instance && instance.hover) {
            createCssClass (element.styleName + ':hover', instance.hover);
        }

        if (instance && instance.before) {
            createCssClass (element.styleName + '::before', instance.before);
        }

        if (instance && instance.hoverBefore) {
            createCssClass (element.styleName + ':hover::before', instance.hoverBefore);
        }

        if (instance) {
            if (instance.styleGetter) {
                style = `style="${instance.styleGetter (element)}"`;
            } else if (instance.style) {
                style = `style="${instance.style}"`;
            }
        }
    }

    if (!element.content)
        element.content = '';

    return `<${tag} id=${element.styleName} class=${element.styleName} ${style}>${element.content}</${tag}>`;
}

['Div', 'Span', 'A', 'Input', 'Button', 'Img', 'TextArea'].forEach (
    tag => {
        Styled [tag] = css => {
            return function (element) {
                if (!element.classInfo)
                    element.classInfo = {};

                this.element = element;
                this.render = () => {
                    if (!element.content)
                        // Remember inner HTML for future renders
                        element.content = this.element.innerHTML;

                    const result = Styled (css, tag.toUpperCase (), element);

                    return result;
                };
            };
        };
    }
);

Styled.instanceCounter = 0;

class Component {
    constructor (element) {
        this.store = Component.store;
        this.element = element;
        this.properties = {};
        this.id = `_comp_${(Component.instanceCounter++).toString ()}`;
        
        Component.all [this.id] = this;
        Component.allArr.push (this);

        for (let i = 0; i < element.attributes.length; ++ i) {
            const attr = element.attributes [i];
            const attrName = attr.name;
            const attrValue = attr.value;

            switch (attrName) {
                case 'onwheel': 
                case 'onmousewheel': 
                case 'onmouseout': 
                case 'onmousemove':
                case 'onmouseup':
                case 'onmousedown':
                case 'onclick': {
                    Component.setupLaunch (element, attrValue, attrName);

                    break;
                }

                default: {
                    this.properties [attr.name] = attr.value;
                }
            }
        }

        if (!this.properties.id)
            this.properties.id = this.id;
    }

    postRender (element) {        
    }

    getText () {
        return this.element.innerText;
    }

    forceUpdate () {
        this.element.innerHTML = this.render ();

        Component.renderAll (this.element);
    }

    render () {
        return null;
    }

    _render () {
        let props = '';

        for (const key in this.properties) {
            if (props.length > 0)
                props += '; ';

            props += `${key}=${this.properties[key]}`;
        }

        return `${this.render ()}`;
    }

    onStoreChanged (state) {
    }

    onEvent (event) {        
    }

    static launchMethod (launchRule, param) {
        let object, method;
    
        if (launchRule.indexOf ('.') >= 0) {
            const parts = launchRule.split ('.');
    
            if (parts [0] === 'this')
                object = Component.all [this.id];
            else
                object = Component.all [parts [0]];
    
            method = parts [1];
        } else {
            object = Component.all [this.id];
            method = launchRule;
        }
    
        object [method] (param);
    }
    
    static setupLaunch (element, launchRule, eventName) {
        let object, method;
    
        if (launchRule.indexOf ('.') >= 0) {
            const parts = launchRule.split ('.');
    
            if (parts [0] === 'this')
                object = Component.all [this.id];
            else
                object = Component.all [parts [0]];
    
            method = parts [1];
        } else {
            object = Component.all [this.id];
            method = launchRule;
        }
    
        if (eventName) {
            element [eventName] = event => {
                const handler = object [method];

                switch (typeof (handler)) {
                    case 'function':
                        object [method] (event);
                        event.stopPropagation ();

                        break;
                }
            };
        }
    }
    
    static renderAll (owner, thisOnly) {
        Component.renderCount ++;

        const cb = element => {
            if (!element.component)
                element.component = Component.findComponent (element);
    
            if (element.component) {
                const instance = new element.component (element);
                
                element.innerHTML = instance.render ();
                element.instance  = instance;
                
                for (const propName in instance.properties)
                    element.setAttribute (propName, instance.properties[propName]);
                    
                // Children components need to be reattached and re-rendered
                Component.attachAll (element);
                Component.renderAll (element);
    
                if (instance.postRender)
                    instance.postRender (element);
            }
    
            // Do not go inside component; the componennt renders itself
            return element.component;
        }
    
        if (thisOnly) {
            cb (owner);
        } else {
            Component.htmlWalker (cb, owner);
        }

        Component.renderCount --;
    }
    
    // Walks through all HTML elements, calls cb(element) for each one
    // Processes children recursively is cb(element) returns false|null|undefined
    static htmlWalker (cb, element) {
        if (!cb)
            return;
    
        if (!element)
            element = document.getElementsByTagName ('body')[0];
    
        for (let i = 0; i < element.childElementCount; ++ i) {
            const child = element.children[i];
    
            if (!cb (child))
                Component.htmlWalker (cb, child);
        }
    }
    
    static attachStore (store) {
        Component.store = store;
    
        Component.enumAllComponents (component => {
            component.store = store;
        });
    }
    
    static findComponent (element) {
        let result = null;
        const tagName = element.tagName.toUpperCase ();
    
        for (let i = 0; i < Component.list.length; ++ i) {
            if (tagName === Component.list [i].upperCaseName) {
                result = Component.list [i].ctor; break;
            }
        }
    
        return result;
    };    
    // By default starts from <body>
    static attachAll (owner) {
        const attachElement = (element) => {
            const component = Component.findComponent (element);
            
            if (component)
                element.component = component;
        };
    
        Component.htmlWalker (attachElement, owner);
    }
    
    static enumAllComponents (cb) {
        Component.allArr.forEach (cb);
    }
    
    // Store state change hook
    static notifyStoreChanged (state) {
        Component.enumAllComponents (component => {
            component.onStoreChanged (state);
        });
    }
    
    // Event hook
    static notifyEvent (event) {
        Component.enumAllComponents (component => {
            component.onEvent (event);
        });
    }
}

Component.anonimousCbCount = 0;

Component.callbacks = {
    list: {},
    timers: {},
    listToBeCalledOnce: {},
    queue: [],
    register: (name, cb, context) => {
        if (!Component.callbacks.list [name]) {
            Component.callbacks.list [name] = { cb: cb, context: context };
        }
    },
    invoke: (name, data) => {
        const desc = Component.callbacks.list [name];

        return desc ? desc.cb (data, desc.context) : null;
    },
    invokeAsync: (name, data) => {
        const desc = Component.callbacks.list [name];

        if (desc) Component.callbacks.queue.push ({ cb: desc.cb, data: data, context: desc.context });
    },
    getCallStackInfo: levelUp => {
        if (typeof (levelUp) === 'undefined') levelUp = 1;

        const stackTrace = (new Error()).stack; // Only tested in latest FF and Chrome

        let item = stackTrace.replace(/^Error\s+/, '').split ("\n") [levelUp+1].replace ('@', ' ').replace ('(', '').replace (')', '');
        
        const parts = item.split (' ');
        const location = parts [parts.length-1];
        const locationInfo = location.split (':');
        const char = locationInfo [locationInfo.length-1];
        const line = locationInfo [locationInfo.length-2];
        
        locationInfo.splice (locationInfo.length-2, 2);
        
        const file = locationInfo.join (':');
        const caller = parts [parts.length-2];

        return { name: caller, file: file, char: parseInt (char), line: parseInt (line) };
    },
    uniqueKey: () => {
        const stackInfo = Component.callbacks.getCallStackInfo (2);
        
        return `${stackInfo.file}:${stackInfo.line}`;
    },
    bind: (cb, context) => {
        //const stackInfo = Component.callbacks.getCallStackInfo (1);
        const key = Component.callbacks.uniqueKey (); //`${stackInfo.file}:${stackInfo.line}`
        if (!Component.callbacks.listToBeCalledOnce [key]) {
            Component.callbacks.register (key, cb, context);
        }

        return key;
    },
    setTimer: (cb, interval) => {
        //const stackInfo = Component.callbacks.getCallStackInfo (1);
        const key = Component.callbacks.uniqueKey (); //`${stackInfo.file}:${stackInfo.line}`

        if (key in Component.callbacks.timers) {
            const rec = Component.callbacks.timers [key];

            // do nothing if it is the same callback and the same caller (the same key)
            if (rec.cb === cb) return;

            clearInterval (rec.timer);
        }

        Component.callbacks.timers [key] = { timer: setInterval (cb, interval), cb: cb };

        return key;
    },
    invokeAsyncOnce: (cb, arg) => {
        //const stackInfo = Component.callbacks.getCallStackInfo (1);
        const key = Component.callbacks.uniqueKey (); //`${stackInfo.file}:${stackInfo.line}`
        if (!Component.callbacks.listToBeCalledOnce [key]) {
            Component.callbacks.register (key, cb, this);
            Component.callbacks.invokeAsync (key, arg);
        }
    },
};

Component.list = [];
Component.instanceCounter = 0;
Component.all = {};
Component.allArr = [];
Component.store = null;
Component.renderCount = 0;
Component.idleProcessor = setInterval (() => {
    if (Component.renderCount <= 0 && Component.callbacks.queue.length > 0) {
        Component.callbacks.queue.forEach (invokeRecord => {
            invokeRecord.cb (invokeRecord.data, invokeRecord.context);
        });

        Component.callbacks.queue = [];
    }
}, 100);
Component.invokeMethod = (id, method, param) => {
    const component = Component.all [id];

    if (component && component [method]) {
        component [method] (param);
    }
};
