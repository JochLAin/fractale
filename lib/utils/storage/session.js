module.exports = new Proxy({}, {
    get(target, property) {
        if (property === 'setItem') {
            return window.sessionStorage.setItem.bind(window.sessionStorage);
        } if (property === 'removeItem') {
            return window.sessionStorage.removeItem.bind(window.sessionStorage);
        } if (property === 'getItem') {
            return window.sessionStorage.getItem.bind(window.sessionStorage);
        }
        return window.sessionStorage.getItem(property);
    },

    set(target, property, value) {
        return window.sessionStorage.setItem(property, value);
    },

    deleteProperty(target, property) {
        return window.sessionStorage.removeItem(property);
    },
});
