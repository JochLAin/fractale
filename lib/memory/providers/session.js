const session = require('../../utils/storage/session');
const _ = require('../../utils');
const Provider = require('./index');

/**
 * Provider that save entities into SessionStorage
 *
 * @class SessionProvider
 * @extends Provider
 */
class SessionProvider extends Provider {
    constructor(model, options) {
        if (!window) {
            throw new Error('You search to use SessionStorage on non-window script.');
        }
        if (!window.sessionStorage) {
            throw new Error('SessionStorage is not implemented in your navigator.');
        }
        super(model, options);
    }

    create(item) {
        this.update(item);
    }

    update(item) {
        const data = _.parse(session.get(this.key) || '[]');
        const index = data.findIndex(element => element.uuid === item.uuid);
        if (index >= 0) data.splice(index, 1, item);
        else data.push(item);
        session.set(this.key, _.stringify(data));
        return item;
    }

    delete(uuid) {
        const data = _.parse(session.get(this.key) || '[]');
        const index = data.findIndex(item => item.uuid === uuid);
        const item = data.splice(index, 1);
        session.set(this.key, _.stringify(data));
        return item;
    }

    values() {
        return Object.values(session);
    }

    keys() {
        return Object.keys(session);
    }

    clear(uuid) {
        if (uuid) return this.delete(uuid);
        session.remove(this.key);
    }
}

module.exports = SessionProvider;
