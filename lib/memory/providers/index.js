'use strict';

const library = require('../../library');

const Provider = module.exports = class Provider {
    constructor(Table) {
        if (new.target === Provider) {
            throw new Error(`Cannot construct Provider instances directly`);
        }
        this.Table = Table;
        this.tables = new Map;
    }

    createTable(model) {
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
        return table.create(...args);
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
        for (let index = 0, keys = Array.from(this.tables.keys()), length = keys.length; index < length; index++) {
            this.tables.get(keys[index]).clear();
        }
    }

    static get synchronous() {
        return true;
    }
};
