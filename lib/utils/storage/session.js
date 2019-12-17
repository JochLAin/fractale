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
            return key => Object.keys(window.sessionStorage).includes(key);
        }
        return window.sessionStorage.getItem(property);
    },

    set(target, property, value) {
        return window.sessionStorage.setItem(property, value);
    },

    deleteProperty(target, property) {
        return window.sessionStorage.removeItem(property);
    },

    ownKeys(target) {
        return Object.keys(window.sessionStorage);
    }
});
