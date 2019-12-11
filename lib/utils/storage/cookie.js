'use strict';

const CookieHelper = module.exports = new Proxy({}, {
    get(target, property) {
        if ('setItem' === property) {
            return (key, value) => {
                CookieHelper[key] = value;
            }
        } else if ('removeItem' === property) {
            return (key) => {
                delete CookieHelper[key];
            }
        } else if ('getItem' === property) {
            return (key) => {
                return CookieHelper[key];
            }
        } else {
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
        }
    },

    set(target, property, value) {
        const expires = new Date(Date.now() + OPT.get('cookie_expires'));
        property = encodeURIComponent(property).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
        value = encodeURIComponent(value).replace(/%(2[346BF]|3[ACDEF]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
        document.cookie = `${property}=${value}; expires=${expires.toUTCString()}; path=/`;
    },

    deleteProperty(target, property) {
        property = encodeURIComponent(property).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
        document.cookie = `${property}=; expires=-1; path=/`;
    },
});
