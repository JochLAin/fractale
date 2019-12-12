'use strict';

const idb = require('../../utils/storage/idb');
const Provider = require('./index');

module.exports = class IndexedDBProvider extends Provider {
    constructor() {
        super(Table);
    }
};

const Table = module.exports.Table = class IndexedDBTable extends Provider.Table {
    constructor(model) {
        super(model);
        idb.createStore('ƒ_database', this.key, { keyPath: 'uuid' });

        // TODO: Check if needed to set index on all fields
        // for (let idx = 0, keys = this.model.schema.values; idx < keys.length; idx++) {
        //     if (!store.indexNames.contains(keys[idx])) {
        //         store.createIndex(keys[idx], keys[idx], { unique: false });
        //     }
        // }
    }

    keys() {
        return idb.getStore('ƒ_database', this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.getAllKeys();
                request.addEventListener('error', () => throw new Error(`Error on reading keys ${this.model.name}`));
                request.addEventListener('success', () => resolve(request.result));
            });
        });
    }

    has(uuid) {
        return idb.getStore('ƒ_database', this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.get(uuid);
                request.addEventListener('error', () => throw new Error(`Error on testing ${this.model.name}<${uuid}>`));
                request.addEventListener('success', () => resolve(!!request.result));
            });
        });
    }

    create(item) {
        return this.set(item);
    }

    read(uuid) {
        return idb.getStore('ƒ_database', this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.get(uuid);
                request.addEventListener('error', () => throw new Error(`Error on reading ${this.model.name}<${uuid}>`));
                request.addEventListener('success', () => resolve(request.result));
            });
        });
    }

    update(item) {
        return this.set(item);
    }

    delete(uuid) {
        return idb.getStore('ƒ_database', this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.delete(uuid);
                request.addEventListener('error', () => throw new Error(`Error on deleting ${this.model.name}<${uuid}>`));
                request.addEventListener('success', () => resolve());
            });
        });
    }

    set(item) {
        return idb.getStore('ƒ_database', this.key).then((store) => {
            return new Promise((resolve) => {
                const request = store.put(item);
                request.addEventListener('error', () => throw new Error(`Error on creating/updating ${this.model.name}<${item.uuid}>`));
                request.addEventListener('success', () => resolve(item));
            });
        });
    }
};
