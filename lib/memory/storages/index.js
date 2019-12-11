'use strict';

const Table = module.exports = class Table {
    constructor(model) {
        if (new.target === Table) {
            throw new Error(`Cannot construct Table instances directly`);
        }
        this.model = model;
    }

    create(item) {
        throw new Error(`Method "create" is not implemented in ${this.constructor.name}`);
    }

    read(uuid) {
        throw new Error(`Method "read" is not implemented in ${this.constructor.name}`);
    }

    update(item) {
        throw new Error(`Method "update" is not implemented in ${this.constructor.name}`);
    }

    delete(uuid) {
        throw new Error(`Method "delete" is not implemented in ${this.constructor.name}`);
    }

    keys() {
        throw new Error(`Method "keys" is not implemented in ${this.constructor.name}`);
    }

    has(uuid) {
        return this.keys().includes(uuid);
    }

    clear(uuid) {
        if (uuid) {
            this.delete({ uuid });
            return true;
        }
        for (let idx = 0, keys = this.keys(); idx < keys.length; idx++) {
            this.delete(keys[idx]);
        }
        return true;
    }

    get key() {
        return `ƒ_${this.model.slug}`;
    }
};
