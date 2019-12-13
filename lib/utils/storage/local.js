module.exports = new Proxy({}, {
    get(target, property) {
        if (property === 'setItem') {
            return window.localStorage.setItem.bind(window.localStorage);
        } if (property === 'removeItem') {
            return window.localStorage.removeItem.bind(window.localStorage);
        } if (property === 'getItem') {
            return window.localStorage.getItem.bind(window.localStorage);
        }
        return window.localStorage.getItem(property);
    },

    set(target, property, value) {
        return window.localStorage.setItem(property, value);
    },

    deleteProperty(target, property) {
        return window.localStorage.removeItem(property);
    },
});
