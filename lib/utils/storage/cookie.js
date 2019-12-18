

const _ = module.exports = new Proxy({}, {
    get(target, property) {
        if (['setItem', 'set'].includes(property)) {
            return (key, value, options) => {
                return _[key] = { value, options };
            };
        }
        if (['removeItem', 'remove'].includes(property)) {
            return (key) => {
                return delete _[key];
            };
        }
        if (['getItem', 'get'].includes(property)) {
            return (key) => {
                return _[key];
            };
        }
        const cookies = document.cookie ? document.cookie.split('; ') : [];
        for (let idx = 0; idx < cookies.length; idx++) {
            let cookie = cookies[idx].slice(1);
            if (cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }
            const parts = cookie.split('=');
            const name = parts[0].replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
            if (name === property) {
                return parts[1].replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
            }
        }
    },

    set(target, property, { value, options }) {
        if (!options) options = {};
        const expires = new Date(Date.now() + options.expires || 6048e5);
        property = encodeURIComponent(property).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
        value = encodeURIComponent(value).replace(/%(2[346BF]|3[ACDEF]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
        return document.cookie = `${property}=${value}; expires=${expires.toUTCString()}; path=/`;
    },

    deleteProperty(target, property) {
        property = encodeURIComponent(property).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
        return document.cookie = `${property}=; expires=-1; path=/`;
    },

    ownKeys() {
        const keys = [];
        const cookies = document.cookie ? document.cookie.split('; ') : [];
        for (let idx = 0; idx < cookies.length; idx++) {
            let cookie = cookies[idx].slice(1);
            if (cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }
            const parts = cookie.split('=');
            keys.push(parts[0].replace(/(%[\dA-F]{2})+/gi, decodeURIComponent));
        }
        return keys;
    }
});
