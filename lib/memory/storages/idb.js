const _ = require('../../utils/storage/idb');
const Storage = require('./index');

module.exports = class IndexedDBStorage extends Storage {
    constructor(name) {
        super(name);

        return new Proxy(this, {
            get(target, property) {
                return _.getStore(target.name, {
                    title: `${target.name}.get ${property}`,
                    callback: (store) => {
                        return new Promise((resolve) => {
                            const request = store.get(property);
                            request.addEventListener('error', () => {
                                throw new Error(`Error on reading ${target.name}<${property}>`);
                            });
                            request.addEventListener('success', () => resolve(request.result));
                        });
                    }
                });
            },
            set(target, property, value) {
                return _.getStore(target.name, {
                    title: `${target.name}.set ${property}`,
                    callback: (store) => {
                        return new Promise((resolve) => {
                            const request = store.put(value, property);
                            request.addEventListener('error', () => {
                                throw new Error(`Error on creating/updating ${target.name}<${property}>`);
                            });
                            request.addEventListener('success', () => resolve(value));
                        });
                    }
                });
            },
            deleteProperty(target, property) {
                return _.getStore(target.name, {
                    title: `${target.name}.delete ${property}`,
                    callback: (store) => {
                        return new Promise((resolve) => {
                            const request = store.delete(property);
                            request.addEventListener('error', () => {
                                throw new Error(`Error on deleting ${target.name}<${property}>`);
                            });
                            request.addEventListener('success', () => resolve());
                        });
                    },
                });
            }
        });
    }
};
