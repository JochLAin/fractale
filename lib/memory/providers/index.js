'use strict';

const OPT = require('../../options');

const Provider = module.exports = class Provider {
    constructor(entity) {
        this.entity = entity;
    }

    onCreate(item) {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "onCreate"`);
    }

    onUpdate(item) {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "onUpdate"`);
    }

    onDelete(item) {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "onDelete"`);
    }

    get key() {
        return `ƒ_${this.entity.slug}`;
    }
};

const cookieStorage = new Proxy({}, {
    get(target, property) {
        if ('setItem' === property) {
            return (key, value) => {
                cookieStorage[key] = value;
            }
        } else if ('removeItem' === property) {
            return (key) => {
                delete cookieStorage[key];
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

class StorageProvider extends Provider {
    constructor(entity, storage) {
        super(entity);
        this.storage = storage;
    }

    onCreate(item) {
        const data = JSON.parse(this.storage.getItem(this.key) || '[]');
        this.set(data, item);
        return item;
    }

    onUpdate(item) {
        const data = JSON.parse(this.storage.getItem(this.key) || '[]');
        this.set(data, item);
        return item;
    }

    onDelete(uuid) {
        const data = JSON.parse(this.storage.getItem(this.key) || '[]');
        const index = data.findIndex(i => i.uuid === uuid);
        if (index < 0) return;
        const item = data.splice(index, 1);
        this.storage.setItem(this.key, JSON.stringify(data));
        return item;
    }

    set(data, item) {
        const index = data.findIndex(i => i.uuid === item.uuid);
        if (index >= 0 ) {
            data.splice(index, 1, item);
            this.storage.setItem(this.key, JSON.stringify(data));
        } else {
            this.storage.setItem(this.key, JSON.stringify(data.concat([item])));
        }
    }
}

class LocalProvider extends StorageProvider {
    constructor(entity) {
        if (!window || !window.localStorage) {
            throw new Error('You search to use LocalStorage on non-window script.');
        }
        super(entity, window.localStorage);
    }
}

class SessionProvider extends StorageProvider {
    constructor(entity) {
        if (!window || !window.sessionStorage) {
            throw new Error('You search to use SessionStorage on non-window script.');
        }
        super(entity, window.sessionStorage);
    }
}

class CookieProvider extends StorageProvider {
    constructor(entity) {
        if (!document) {
            throw new Error('You search to use Cookies on non-document script.');
        }
        super(entity, cookieStorage);
    }
}

Provider.LocalProvider = LocalProvider;
Provider.SessionProvider = SessionProvider;
Provider.CookieProvider = CookieProvider;
