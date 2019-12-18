const proxy = module.exports = new Proxy({}, {
    get(target, property) {
        if (['setItem', 'set'].includes(property)) {
            return (key, value) => proxy[key] = value;
        }
        if (['removeItem', 'remove'].includes(property)) {
            return key => delete proxy[key];
        }
        if (['getItem', 'get'].includes(property)) {
            return key => proxy[key];
        }
        if (['hasKey', 'has'].includes(property)) {
            return key => Object.keys(window.localStorage).includes(key);
        }
        return window.localStorage.getItem(property);
    },

    set(target, property, value) {
        return window.localStorage.setItem(property, value);
    },

    deleteProperty(target, property) {
        return window.localStorage.removeItem(property);
    },

    ownKeys() {
        return Object.keys(window.localStorage);
    }
});
