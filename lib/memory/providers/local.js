const LocalStorage = require('../storages/local');
const StoreProvider = require('./store');

module.exports = class LocalProvider extends StoreProvider {
    constructor(model) {
        if (!window) {
            throw new Error('You search to use LocalStorage on non-window script.');
        }
        if (!window.localStorage) {
            throw new Error('LocalStorage is not implemented in your navigator.');
        }
        const store = new LocalStorage(LocalProvider.getKey(model));
        super(model, store);
    }
};
