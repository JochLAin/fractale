const uuid = require('uuid');
const EventListener = require('../event_listener');
const local = require('./local');

class IndexedDBTransaction extends EventListener {
    constructor(queue, handler) {
        super();
        this.queue = queue;
        this.handler = handler;
    }

    run() {
        return new Promise((resolve) => {
            this.handler().then((tx) => {
                this.emit('run', tx);

                tx.addEventListener('complete', (event) => {
                    this.emit('complete', tx, event.target.result);
                    resolve(event.target.result);
                });
                tx.addEventListener('abort', (event) => {
                    this.emit('abort', tx, event.target.result);
                    resolve(event.target.result);
                });
                tx.addEventListener('error', (event) => {
                    this.emit('error', tx, event.target.error);
                    reject(event.target.error);
                });
            });
        });
    }
}

class IndexedDBQueue extends EventListener {
    constructor() {
        super();
        this.running = false;
        this.txs = [];
    }

    next() {
        if (!this.txs.length) {
            this.running = undefined;
            return;
        }
        this.running = true;
        this.txs.shift().run().then(() => {
            this.next();
        }).catch((error) => {
            console.error(error);
        });
    }

    run() {
        if (this.running) return;
        this.next();
    }

    push(handler) {
        const tx = new IndexedDBTransaction(this, handler);
        this.txs.push(tx);
        const promise = new Promise((resolve) => {
            tx.on('run', (tx, _id) => {
                tx.addEventListener('error', (event) => {
                    throw event.target.error;
                });
                resolve(tx);
            });
        });
        this.run();
        return promise;
    }
}

let connection;
const connect = (name, version, stores) => {
    if (connection) return connection;

    return connection = new Promise((resolve) => {
        const connection = window.indexedDB.open(name, version);
        connection.addEventListener('error', (event) => {
            throw event.target.error;
        });
        connection.addEventListener('upgradeneeded', (event) => {
            const db = event.target.result;
            for (let idx = 0, keys = Object.keys(stores); idx < keys.length; idx++) {
                if (!db.objectStoreNames.contains(keys[idx])) {
                    db.createObjectStore(keys[idx], stores[keys[idx]]);
                }
            }
        });
        connection.addEventListener('success', (event) => {
            resolve(event.target.result);
        });
    });
};

let databases = [];
class Database {
    constructor(name) {
        databases.push(this);
        this.queue = new IndexedDBQueue();
        this.name = name;
    }

    connect() {
        return connect(this.name, this.version, this.options);
    }

    getTransaction(stores) {
        return this.queue.push(() => {
            return this.connect().then((db) => {
                return db.transaction(stores, 'readwrite');
            });
        });
    }

    getStore(name) {
        return this.getTransaction(name).then((tx) => {
            return tx.objectStore(name);
        });
    }

    deleteDatabase() {
        return new Promise((resolve) => {
            local.remove(`IDB_${this.name}_options`);
            local.remove(`IDB_${this.name}_version`);
            const request = window.indexedDB.deleteDatabase(this.name);
            request.addEventListener('error', (event) => {
                throw event.target.error;
            });
            request.addEventListener('success', (event) => {
                resolve(event.target.result);
            });
        });
    }

    deleteStore(key, name) {
        return this.connect().then((db) => {
            return new Promise((resolve) => {
                const request = db.deleteObjectStore(name);
                request.addEventListener('error', (event) => {
                    throw event.target.error;
                });
                request.addEventListener('success', (event) => {
                    resolve(event.target.result);
                });
            });
        });
    }

    set options(options) {
        if (Array.isArray(options)) {
            options = options.reduce((accu, key) => Object.assign(accu, { [key]: undefined }), {});
        }

        const value = JSON.stringify(options, (key, value) => value === undefined ? null : value);
        if (local.get(`IDB_${this.name}_options`) !== value) {
            connection = undefined;
            this.version += 1;
        }
        local.set(`IDB_${this.name}_options`, value);
        return this._options = options;
    }

    get options() {
        return this._options;
    }

    set version(version) {
        local.set(`IDB_${this.name}_version`, version);
    }

    get version() {
        return Number(local.get(`IDB_${this.name}_version`) || 0);
    }
}

module.exports = (name, options = {}) => {
    if (!window) throw new Error('You search to use IndexedDB on non-window script.');
    if (!window.indexedDB) {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!window.indexedDB) throw new Error('IndexedDB is not implemented in your navigator.');
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    }

    let database = databases.find(db => db.name === name);
    if (!database) database = new Database(name);
    database.options = options;
    return database;
};
