const library = require('../../library');
const _ = require('../../utils/storage/idb');
const Provider = require('./index');

/**
 * Provider that save entities into an IndexedDB
 *
 * @class IndexedDBProvider
 * @extends Provider
 */
class IndexedDBProvider extends Provider {
    constructor(model, options) {
        if (!window) {
            throw new Error('You search to use IndexedDBStorage on non-window script.');
        }
        super(model, options);
        this.db = _(options.database || 'ƒ_database', library.names);
    }

    create(item) {
        return this.db.getStore(this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.put(item, item.uuid);
                request.addEventListener('error', () => {
                    throw new Error(`Error during creation ${this.key}<${item.uuid}>`);
                });
                request.addEventListener('success', () => {
                    resolve(item);
                });
            });
        });
    }

    update(item) {
        return this.db.getStore(this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.put(item, item.uuid);
                request.addEventListener('error', () => {
                    throw new Error(`Error during update ${this.key}<${item.uuid}>`);
                });
                request.addEventListener('success', () => {
                    resolve(item);
                });
            });
        });
    }

    delete(uuid) {
        return this.db.getStore(this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.delete(uuid);
                request.addEventListener('error', () => {
                    throw new Error(`Error during delete ${this.key}<${uuid}>`);
                });
                request.addEventListener('success', () => {
                    resolve(uuid);
                });
            });
        });
    }

    clear() {
        return this.db.getStore(this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.clear();
                request.addEventListener('error', () => {
                    throw new Error(`Error during clear values ${this.key}`);
                });
                request.addEventListener('success', () => {
                    resolve(request.result);
                });
            });
        });
    }

    values() {
        return this.db.getStore(this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.getAll();
                request.addEventListener('error', () => {
                    throw new Error(`Error during read values ${this.key}`);
                });
                request.addEventListener('success', () => {
                    resolve(request.result);
                });
            });
        });
    }

    keys() {
        return this.db.getStore(this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.getAllKeys();
                request.addEventListener('error', () => {
                    throw new Error(`Error during read keys ${this.key}`);
                });
                request.addEventListener('success', () => {
                    resolve(request.result);
                });
            });
        });
    }
}

module.exports = IndexedDBProvider;
