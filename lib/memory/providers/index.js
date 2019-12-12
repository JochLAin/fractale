'use strict';

const library = require('../../library');
const OPT = require('../../options');
const EventListener = require('../../utils/event_listener');

const Provider = module.exports = class Provider extends EventListener {
    constructor(Table) {
        if (new.target === Provider) {
            throw new Error(`Cannot construct Provider instances directly`);
        }
        super();
        this.Table = Table;
        this.tables = new Map;
    }

    createTable(model) {
        if (!model.ƒ_model) {
            throw new Error(`Expected Model as parameter, got ${typeof model}`);
        }
        let table = this.getTable(model);
        if (table instanceof this.Table) return table;

        table = new this.Table(model);
        this.tables.set(model, table);
        return table;
    }

    getTable(model) {
        if (typeof model === 'string') model = library.get(model);
        if (!model) return;
        if (!this.tables.has(model)) return;
        return this.tables.get(model);
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
            return table.clear();
        }
        const results = [];
        for (let index = 0, keys = Array.from(this.tables.keys()), length = keys.length; index < length; index++) {
            results.push(this.tables.get(keys[index]).clear());
        }
        if (results.every(result => result instanceof Promise)) {
            return Promise.all(results);
        }
        return true;
    }
};

const Table = module.exports.Table = class Table extends EventListener {
    constructor(model) {
        if (new.target === Table) {
            throw new Error(`Cannot construct Table instances directly`);
        }
        super();
        this.model = model;
    }

    ƒ_create(item) {
        const result = this.create(item);
        if (result instanceof Promise) {
            return result.then((item) => {
                this.emit('create', { key: this.model.slug, item });
                return item;
            });
        }
        this.emit('create', { key: this.model.slug, item: result });
        return result;
    }

    create(item) {
        throw new Error(`Method "create" is not implemented in ${this.constructor.name}`);
    }

    ƒ_read(uuid) {
        const result = this.read(uuid);
        if (result instanceof Promise) {
            return result.then((item) => {
                this.emit('read', { key: this.model.slug, item });
                return item;
            });
        }
        this.emit('read', { key: this.model.slug, item: result });
        return result;
    }

    read(uuid) {
        throw new Error(`Method "read" is not implemented in ${this.constructor.name}`);
    }

    ƒ_update(item) {
        const result = this.update(item);
        if (result instanceof Promise) {
            return result.then((item) => {
                this.emit('update', { key: this.model.slug, item });
                return item;
            });
        }
        this.emit('update', { key: this.model.slug, item: result });
        return result;
    }

    update(item) {
        throw new Error(`Method "update" is not implemented in ${this.constructor.name}`);
    }

    ƒ_delete(uuid) {
        const result = this.delete(uuid);
        if (result instanceof Promise) {
            return result.then((item) => {
                this.emit('delete', { key: this.model.slug, item });
                return item;
            });
        }
        this.emit('delete', { key: this.model.slug, item: result });
        return result;
    }

    delete(uuid) {
        throw new Error(`Method "delete" is not implemented in ${this.constructor.name}`);
    }

    keys() {
        throw new Error(`Method "keys" is not implemented in ${this.constructor.name}`);
    }

    has(uuid) {
        const result = this.keys();
        if (result instanceof Promise) {
            result.then((keys) => {
                return keys.includes(uuid);
            });
        }
        return result.includes(uuid);
    }

    clear(uuid) {
        if (uuid) {
            const result = this.delete({ uuid });
            if (result instanceof Promise) {
                return result;
            }
            return true;
        }
        const results = [];
        for (let idx = 0, keys = this.keys(); idx < keys.length; idx++) {
            results.push(this.delete(keys[idx]));
        }
        if (results.every(result => result instanceof Promise)) {
            return Promise.all(results).then();
        }
        return true;
    }

    get key() {
        if (this._key) return this._key;
        const prefix = OPT.get('memory_prefix');
        if (!prefix) return this._key = this.model.slug;
        return this._key = `${prefix}${this.model.slug}`;
    }
};
