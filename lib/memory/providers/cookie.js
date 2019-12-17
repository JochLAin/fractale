const cookie = require('../../utils/storage/cookie');
const _ = require('../../utils');
const Provider = require('./index');

module.exports = class CookieProvider extends Provider {
    constructor(model) {
        if (!window || !document) {
            throw new Error('You search to use CookieStorage on non-window script.');
        }
        super(model);
        this.key = CookieProvider.getKey(model);
    }

    create(item) {
        this.update(item);
    }

    update(item) {
        const data = _.parse(cookie.get(this.key) || '[]');
        const index = data.findIndex(element => element.uuid === item.uuid);
        if (index >= 0) data.splice(index, 1, item);
        else data.push(item);
        cookie.set(this.key, _.stringify(data));
        return item;
    }

    delete(uuid) {
        const data = _.parse(cookie.get(this.key) || '[]');
        const index = data.findIndex(item => item.uuid === uuid);
        const item = data.splice(index, 1);
        cookie.set(this.key, _.stringify(data));
        return item;
    }

    values() {
        return Object.values(cookie);
    }

    keys() {
        return Object.keys(cookie);
    }

    clear(uuid) {
        if (uuid) return this.delete(uuid);
        cookie.remove(this.key);
    }
};
