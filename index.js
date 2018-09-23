

module.exports = class BasicModel {
    constructor(props = {}) {
        this.events = {};
        this.props = props;
    }

    addEventListener(event, callback) {
        // Check if the callback is not a function
        if (typeof callback !== 'function') {
            throw new Error(`The listener callback must be a function, the given type is ${typeof callback}`);
        }
        // Check if the event is not a string
        if (typeof event !== 'string') {
            throw new Error(`The event name must be a string, the given type is ${typeof event}`);
        }

        // Create the event if not exists
        if (this.events[event] === undefined) {
            this.events[event] = {
                listeners: []
            }
        }

        this.events[event].listeners.push(callback);
    }

    removeEventListener(event, callback) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            return false;
        }
            
        this.events[event].listeners = this.events[event].listeners.filter(listener => {
            return listener.toString() !== callback.toString(); 
        });
    }

    dispatchEvent(event, details) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners.forEach((listener) => {
            listener(details);
        });
    }
}
