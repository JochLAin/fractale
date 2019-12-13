const _ = require('../../utils/storage/cookie');
const Provider = require('./index');
const Store = require('../storages');
const logger = require('../../utils/logger');

module.exports = class StoreProvider extends Provider {
    constructor(model, store) {
        super(model);
        if (!(store instanceof Store)) {
            throw new Error(`Intended store to be an instance of Storage, got ${typeof store}`);
        }
        this.store = store;
    }

    keys() {
        logger.debug('keys');
        return Object.keys(this.store);
    }

    create(item) {
        logger.debug(`create ${item.uuid}`);
        return this.store[item.uuid] = item;
    }

    update(item) {
        logger.debug(`update ${item.uuid}`);
        return this.store[item.uuid] = item;
    }

    delete(uuid) {
        logger.debug(`delete ${uuid}`);
        return delete this.store[uuid];
    }
};
