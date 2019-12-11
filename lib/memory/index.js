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

    static get Provider() {
        return Provider;
    }

    createTable(entity) {
        let table = this.getTable(entity.slug);
        if (table instanceof Table) {
            return table;
        }

        table = new Table(entity);
        table.addEventListener('create', ({ item }) => {
            this.emit('create', { name: entity.name, item });
            if (table.provider) table.provider.onCreate(entity, item);
            else if (this.provider) this.provider.onCreate(entity, item);
        });
        table.addEventListener('update', ({ item }) => {
            this.emit('update', { name: entity.name, item });
            if (table.provider) table.provider.onUpdate(entity, item);
            else if (this.provider) this.provider.onUpdate(entity, item);
        });
        table.addEventListener('delete', ({ item }) => {
            this.emit('delete', { name: entity.name, item });
            if (table.provider) table.provider.onDelete(entity, item);
            else if (this.provider) this.provider.onDelete(entity, item);
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

    addProvider(name, memory, setup = false) {
        if (providers[name]) {
            throw new Error(`Memory ${name} already exists`);
        }
        if (!(memory.prototype instanceof Provider)) {
            throw new Error('The memory added must extends Provider');
        }
        const methods = [ 'onCreate', 'onRead', 'onUpdate', 'onDelete', 'onFind' ];
        for (const index in methods) {
            if (methods.hasOwnProperty(index)) {
                if (!(memory.prototype[methods[index]] instanceof Function)) {
                    throw new Error(`Method ${methods[index]} not found in ${memory.name} class`);
                }
            }
        }
        providers[name] = memory;
        if (setup) this.provider = name;
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
        return this.kind && providers[this.kind];
    }

    set provider(name) {
        if (!providers[name]) {
            throw new Error(`Provider ${name} doesn't exists.`);
        }
        this.kind = name;

        const entities = Array.from(this.tables.keys());
        for (const index in entities) {
            entities[index].memory = this.createTable(entities[index]);
        }
    }

    toJSON() {
        return Array.from(this.tables.entries()).reduce((accu, [entity, table]) => {
            return Object.assign({}, accu, { [entity.name]: table });
        }, {});
    }
};
