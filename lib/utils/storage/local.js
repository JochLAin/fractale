'use strict';

module.exports = new Proxy(window && window.localStorage, {
    get(target, property) {
        if ('setItem' === property) {
            return target.setItem.bind(target);
        } else if ('removeItem' === property) {
            return target.removeItem.bind(target);
        } else if ('getItem' === property) {
            return target.getItem.bind(target);
        }
        return target.getItem(property);
    },

    set(target, property, value) {
        target.setItem(property, value);
    },

    deleteProperty(target, property) {
        target.removeItem(property);
    },
});
