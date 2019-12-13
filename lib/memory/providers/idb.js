const logger = require('../../utils/logger');
const Ᵽ = require('../../utils/promise');
const _ = require('../../utils/storage/idb');
const IndexedDBStorage = require('../storages/idb');
const StoreProvider = require('./store');

module.exports = class IndexedDBProvider extends StoreProvider {
    constructor(model) {
        if (!window) {
            throw new Error('You search to use IndexedDBStorage on non-window script.');
        }
        const key = IndexedDBProvider.getKey(model);
        const store = new IndexedDBStorage(key);
        super(model, store);
        this.key = key;
    }

    keys() {
        return _.getStore(this.key, {
            title: `${this.key}.keys`,
            callback: (store) => {
                return new Promise((resolve) => {
                    const request = store.getAllKeys();
                    request.addEventListener('error', () => {
                        throw new Error(`Error on reading keys ${this.key}`);
                    });
                    request.addEventListener('success', () => resolve(request.result));
                });
            }
        });
    }

    clear(uuid) {
        if (uuid) return this.delete(uuid);
        const key = IndexedDBProvider.getKey(this.model);
        return _.deleteDatabase(key, {
            title: `Deleting database ${key}`,
            callback: () => {
                logger.debug('deleting database');
                return uuid;
            },
        });
    }
};
