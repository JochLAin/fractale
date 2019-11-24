const { EVENT_KEY } = require('./constants');

/**
 * Enable event listener
 * @class EventListener
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class EventListener {
    constructor() {
        this.ƒ_events = {};
    }

    /**
     * Proxy to dispatchEvent method
     *
     * @method
     */
    emit(...args) { return this.dispatchEvent.apply(this, args); }

    /**
     * Proxy to addEventListener method
     *
     * @method
     * @throws Error
     */
    on(...args) { return this.addEventListener.apply(this, args); }

    /**
     * Proxy to removeEventListener method
     *
     * @method
     */
    off(...args) { return this.removeEventListener.apply(this, args); }

    /**
     * Add an event listener on an event
     *
     * @param {String} name - Event name
     * @param {Function} callback - Callback called on event
     *
     * @return {undefined}
     * @throws Error
     */
    addEventListener(name, callback) {
        // Check if the callback is not a function
        if (typeof callback !== 'function') {
            throw new Error(`The listener callback must be a function, the given type is ${typeof callback}`);
        }
        // Check if the name is not a string
        if (typeof name !== 'string') {
            throw new Error(`The event name must be a string, the given type is ${typeof name}`);
        }

        // Create the event if not exists
        if (this.ƒ_events[name] === undefined) {
            this.ƒ_events[name] = [];
        }
        this.ƒ_events[name].push(callback);
    }

    /**
     * Remove an event listener on an event
     *
     * @param {String} name - Event name
     * @param {Function} callback - Callback called on event
     *
     * @return {undefined}
     */
    removeEventListener(name, callback) {
        // Check if this event not exists
        if (this.ƒ_events[name] === undefined) {
            return;
        }

        this.ƒ_events[name] = this.ƒ_events[name].filter(listener => {
            return listener.toString() !== callback.toString();
        });
    }

    /**
     * Dispatch an event
     *
     * @param {String} name - Event name
     * @param {Object} details - Parameter send to callback
     *
     * @return {undefined}
     */
    dispatchEvent(name, details) {
        // Check if this event not exists
        if (this.ƒ_events[name] === undefined) return;
        for (let index = 0, length = this.ƒ_events[name].length; index < length; index++) {
            this.ƒ_events[name][index](details);
        }
    }
};
