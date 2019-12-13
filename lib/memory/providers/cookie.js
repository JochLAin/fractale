const CookieStorage = require('../storages/cookie');
const StoreProvider = require('./store');

module.exports = class CookieProvider extends StoreProvider {
    constructor(model) {
        if (!window || !document) {
            throw new Error('You search to use CookieStorage on non-window script.');
        }
        const store = new CookieStorage(CookieProvider.getKey(model));
        super(model, store);
    }
};
