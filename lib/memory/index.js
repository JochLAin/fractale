'use strict';

const EventListener = require('../event_listener');
const library = require('../library');
const Provider = require('./providers');
const Table = require('./table');

let providers = {
    local: Provider.LocalProvider,
    session: Provider.SessionProvider,
    cookie: Provider.CookieProvider,
};

module.exports = new class Memory extends EventListener {
    constructor() {
        super();
        this.tables = new Map;
    }

    createTable(entity) {
        let table = this.getTable(entity.slug);
        if (table instanceof Table) {
            return table;
        }

        table = new Table(this, entity);
        table.addEventListener('create', ({ item }) => {
            this.emit('create', { name: entity.name, item });
        });
        table.addEventListener('update', ({ item }) => {
            this.emit('update', { name: entity.name, item });
        });
        table.addEventListener('delete', ({ item }) => {
            this.emit('delete', { name: entity.name, item });
        });

        this.tables.set(entity, table);
        return table;
    }

    getTable(name) {
        const entity = library.get(name);
        if (this.tables.has(entity)) {
            return this.tables.get(entity);
        }
    }

    create(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.create(...args);
    }

    clear(name) {
        if (name) {
            const table = this.getTable(name);
            if (!table) return;
            return table.clear();
        } else {
            for (let index = 0, keys = Array.from(this.tables.keys()), length = keys.length; index < length; index++) {
                this.tables.get(keys[index]).clear();
            }
        }
    }

    read(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.read(...args);
    }

    update(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.update(...args);
    }

    delete(name, ...args) {
        const table = this.getTable(name);
        if (!table) return;
        return table.delete(...args);
    }

    get provider() {
        return this._provider;
    }

    set provider(provider) {
        if (!provider) {
            provider = undefined;
        } else {
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
        this._provider = provider;

        for (let idx = 0, keys = Array.from(this.tables.keys()); idx < keys.length; idx++) {
            this.tables.get(keys[idx]).provider = provider;
        }
    }

    toJSON() {
        return Array.from(this.tables.entries()).reduce((accu, [entity, table]) => {
            return Object.assign({}, accu, { [entity.name]: table });
        }, {});
    }
};
