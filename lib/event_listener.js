/**
 * Enable event listener
 * @class EventListener
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class EventListener {
    constructor() {
        this.__events = {};
    }

    /**
     * Proxy to dispatchEvent method
     * @method
     */
    emit() { this.dispatchEvent(arguments); }

    /**
     * Proxy to addEventListener method
     * @method
     */
    on() { this.addEventListener(arguments); }

    /**
     * Proxy to removeEventListener method
     * @method
     */
    off() { this.removeEventListener(arguments); }

    /**
     * Add an event listener on an event
     * @param {String} name - Event name
     * @param {Function} callback - Callback called on event
     */
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
        if (this.__events[event] === undefined) {
            this.__events[event] = {
                listeners: []
            }
        }

        this.__events[event].listeners.push(callback);
    }

    /**
     * Remove an event listener on an event
     * @param {String} event - Event name
     * @param {Function} callback - Callback called on event
     * @returns {boolean}
     */
    removeEventListener(event, callback) {
        // Check if this event not exists
        if (this.__events[event] === undefined) {
            return false;
        }

        this.__events[event].listeners = this.__events[event].listeners.filter(listener => {
            return listener.toString() !== callback.toString();
        });
    }

    /**
     * Dispatch an event
     * @param {String} event - Event name
     * @param {Object} details - Parameter send to callback
     */
    dispatchEvent(event, details) {
        // Check if this event not exists
        if (this.__events[event] === undefined) {
            return false;
        }
        this.__events[event].listeners.forEach((listener) => {
            listener(details);
        });
    }
};
