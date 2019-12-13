const library = require('../library');
const Provider = require('./providers');
const EventListener = require('../utils/event_listener');
const Table = require('./table');

const providers = {
    cookie: require('./providers/cookie'),
    idb: require('./providers/idb'),
    local: require('./providers/local'),
    session: require('./providers/session'),
};

module.exports = new class Memory extends EventListener {
    constructor() {
        super();
        this.tables = new Map();
    }

    createTable(model) {
        if (!model.ƒ_model) {
            throw new Error(`Expected Model as parameter, got ${typeof model}`);
        }
        let table = this.getTable(model);
        if (table instanceof Table) return table;

        table = new Table(model, this.provider);
        this.tables.set(model, table);
        return table;
    }

    getTable(model) {
        if (typeof model === 'string') model = library.get(model);
        if (!model) return;
        if (!this.tables.has(model)) return;
        return this.tables.get(model);
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
            if (!(provider.prototype instanceof Provider)) {
                throw new Error(`Provider ${provider.constructor.name} is not a Fractale.Provider`);
            }
        }
        if (!provider && !this._provider) return;
        this._provider = provider;

        for (let idx = 0, keys = Array.from(this.tables.keys()); idx < keys.length; idx++) {
            this.tables.get(keys[idx]).provider = provider;
        }
    }

    create(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.ƒ_create(...args);
    }

    read(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.ƒ_read(...args);
    }

    update(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.ƒ_update(...args);
    }

    delete(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.ƒ_delete(...args);
    }

    contains(name, uuid) {
        if (name) {
            const table = this.getTable(name);
            return table.contains(uuid);
        }
        for (let index = 0, keys = Array.from(this.tables.keys()), length = keys.length; index < length; index++) {
            if (this.tables.get(keys[index]).contains(uuid)) {
                return true;
            }
        }
        return false;
    }

    clear(name) {
        if (name) {
            const table = this.getTable(name);
            if (!table) return;
            return table.ƒ_clear();
        }
        for (let index = 0, keys = Array.from(this.tables.keys()), length = keys.length; index < length; index++) {
            if (!this.tables.get(keys[index]).ƒ_clear()) return false;
        }
        return true;
    }
}();
