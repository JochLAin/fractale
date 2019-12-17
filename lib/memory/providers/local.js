const local = require('../../utils/storage/local');
const _ = require('../../utils');
const Provider = require('./index');

module.exports = class LocalProvider extends Provider {
    constructor(model) {
        if (!window) {
            throw new Error('You search to use LocalStorage on non-window script.');
        }
        if (!window.localStorage) {
            throw new Error('LocalStorage is not implemented in your navigator.');
        }
        super(model);
        this.key = LocalProvider.getKey(model);
    }

    create(item) {
        this.update(item);
    }

    update(item) {
        const data = _.parse(local.get(this.key) || '[]');
        const index = data.findIndex(element => element.uuid === item.uuid);
        if (index >= 0) data.splice(index, 1, item);
        else data.push(item);
        local.set(this.key, _.stringify(data));
        return item;
    }

    delete(uuid) {
        const data = _.parse(local.get(this.key) || '[]');
        const index = data.findIndex(item => item.uuid === uuid);
        const item = data.splice(index, 1);
        local.set(this.key, _.stringify(data));
        return item;
    }

    values() {
        return Object.values(local);
    }

    keys() {
        return Object.keys(local);
    }

    clear(uuid) {
        if (uuid) return this.delete(uuid);
        local.remove(this.key);
    }
};
