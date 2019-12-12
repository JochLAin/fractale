'use strict';

let connection;
module.exports.getConnection = (key) => {
    if (connection) return Promise.resolve(connection);
    return new Promise((resolve) => {
        if (!window) {
            throw new Error('You search to use IndexedDB on non-window script.');
        }
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!window.indexedDB) {
            throw new Error('IndexedDB is not implemented in your navigator.');
        }
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        connection = window.indexedDB.open(key, 4);
        connection.addEventListener('error', () => {
            throw new Error(`Error during database's load`);
        });
        connection.addEventListener('success', () => {
            resolve(connection);
        });
    });
};

module.exports.createStore = (key, name, options) => {
    return module.exports.getConnection().then((connection) => {
        if (connection.result.objectStoreNames.contains(name)) {
            return connection.result.transaction(key, 'readwrite').objectStore(name);
        }
        return connection.result.createObjectStore(name, options);
    });
};

module.exports.getTransaction = (key) => {
    return module.exports.getConnection().then((connection) => {
        const tx = connection.result.transaction(key, 'readwrite');
        tx.addEventListener('error', () => throw tx.error);
        return tx;
    });
};

module.exports.getStore = (key, name) => {
    return module.exports.getTransaction(key).then((tx) => {
        return tx.objectStore(name);
    });
};
