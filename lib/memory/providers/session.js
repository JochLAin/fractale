const SessionStorage = require('../storages/session');
const StoreProvider = require('./store');

module.exports = class SessionProvider extends StoreProvider {
    constructor(model) {
        if (!window) {
            throw new Error('You search to use SessionStorage on non-window script.');
        }
        if (!window.localStorage) {
            throw new Error('SessionStorage is not implemented in your navigator.');
        }
        const store = new SessionStorage(SessionProvider.getKey(model));
        super(model, store);
    }
};
