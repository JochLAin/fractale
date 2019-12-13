const queue = new (require('../queue'));

const getIndexedDB = () => {
    if (!window) {
        throw new Error('You search to use IndexedDB on non-window script.');
    }
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!window.indexedDB) {
        throw new Error('IndexedDB is not implemented in your navigator.');
    }
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    return window.indexedDB;
};

const initStore = (name, options) => {
    return new Promise((resolve) => {
        let created = false;
        const connection = getIndexedDB().open(name, 1);

        connection.addEventListener('error', (event) => {
            throw event.target.error;
        });
        connection.addEventListener('upgradeneeded', (event) => {
            const db = event.target.result;
            const store = db.createObjectStore(name, options);
            store.transaction.addEventListener('complete', () => {
                resolve(store);
                created = true;
            });
        });
        connection.addEventListener('success', (event) => {
            const db = event.target.result;
            if (db.objectStoreNames.contains(name) && !created) {
                resolve(db.transaction(name, 'readwrite').objectStore(name));
            }
        });
    });
};

const deleteDatabase = (name) => {
    return new Promise((resolve) => {
        const request = getIndexedDB().deleteDatabase(name);
        request.addEventListener('error', () => {
            throw new Error(`Error on deleting ${name}`);
        });
        request.addEventListener('success', () => {
            resolve(request.result)
        });
    });
};

module.exports.getStore = (name, { title, callback }, params) => {
    const tx = queue.push({ title, handler: () => initStore(name, params).then(store => callback(store)) });
    return tx.after();
};

module.exports.deleteDatabase = (name, { title, callback }) => {
    const tx = queue.push({ title, handler: () => deleteDatabase(name).then(result => callback(result)), });
    return tx.after();
};
