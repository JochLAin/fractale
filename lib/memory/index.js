'use strict';

const InternalProvider = require('./providers/internal');
const Provider = require('./providers');
const Table = require('./table');

let providers = {
    cookie: require('./providers/cookie'),
    idb: require('./providers/idb'),
    local: require('./providers/local'),
    session: require('./providers/session'),
};

module.exports = new class Memory extends InternalProvider {
    constructor() {
        super(Table);
    }

    createTable(model) {
        const table = super.createTable(model);
        table.provider = this.provider;
        return table;
    }

    get provider() {
        return this._provider;
    }

    set provider(provider) {
        if (!provider) provider = undefined;
        else {
            if (typeof provider === 'string') {
                if (!providers[provider]) {
                    throw new Error(`Provider ${provider} doesn't exists`);
                }
                provider = providers[provider];
            }
            if (!(provider instanceof Function) || !provider.constructor) {
                throw new Error(`Provider passed is not a class`);
            }
            if (!(provider instanceof Provider)) {
                throw new Error(`Provider ${provider.constructor.name} is not a Fractale.Provider`);
            }
        }
        if (!provider && !this._provider) return;
        this._provider = provider;

        for (let idx = 0, keys = Array.from(this.tables.keys()); idx < keys.length; idx++) {
            this.tables.get(keys[idx]).provider = provider;
        }
    }
};
