'use strict';

const Provider = require('./index');

let connection;
module.exports = class IndexedDBProvider extends Provider {
    constructor(model) {
        if (!window) {
            throw new Error('You search to use IndexedDB on non-window script.');
        }
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!window.indexedDB) {
            throw new Error('IndexedDB is not implemented in your navigator.');
        }
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        super(model);
        this.initialize();
        connection.addEventListener('upgradeneeded', ({ target: { result: db }}) => {
            db.addEventListener('error', () => {
                throw new Error(`Error during add new ${this.entity.name}`);
            });
            db.addEventListener('abort', () => {
                console.warn(`Connection aborted during add new ${this.entity.name}`);
            });

            if (!db.objectStoreNames.contains(this.key)) {
                const store = db.createObjectStore(this.key, { keyPath: 'uuid' });
                for (let idx = 0, keys = this.model.schema.values; idx < keys.length; idx++) {
                    store.createIndex(keys[idx], keys[idx], { unique: false });
                }
            }
        });
    }

    initialize() {
        if (connection) return;
        connection = window.indexedDB.open('ƒ_database', 4);
        connection.addEventListener('error', () => {
            throw new Error(`Error during database's load`);
        });
    }

    async onCreate(item) {
        if (!connection) return console.log('Database is not loaded yet');
        const transaction = connection.result.transaction(['ƒ_database'], 'readwrite');
        transaction.onerror = () => throw transaction.error;
        transaction.objectStore(this.key).add(item);
        return item;
    }

    async onUpdate(item) {
        if (!connection) return console.log('Database is not loaded yet');
        const transaction = connection.result.transaction(['ƒ_database'], 'readwrite');
        transaction.onerror = () => throw transaction.error;
        transaction.objectStore(this.key).add(item);
        return item;
    }

    async onRead(uuid) {

    }

    async onDelete(uuid) {
        if (!connection) return console.log('Database is not loaded yet');
        const transaction = connection.result.transaction(['ƒ_database'], 'readwrite');
        transaction.onerror = () => throw transaction.error;
        transaction.objectStore(this.key).delete(uuid);
    }
};
