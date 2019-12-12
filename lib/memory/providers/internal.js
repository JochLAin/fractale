'use strict';

const Provider = require('./index');

module.exports = class InternalProvider extends Provider {
    constructor() {
        super(Table);
    }
};

const Table = module.exports.Table = class InternalTable extends Provider.Table {
    constructor(model) {
        super(model);
        this.data = new Map();
    }

    create(item) {
        this.data.set(item.uuid, item);
        return item;
    }

    read(uuid) {
        return this.data.get(uuid);
    }

    update(item) {
        this.data.set(item.uuid, item);
        return item;
    }

    delete(uuid) {
        const item = this.data.get(uuid);
        this.data.delete(uuid);
        return item;
    }

    keys() {
        return Array.from(this.data.keys());
    }

    has(uuid) {
        return this.data.has(uuid);
    }
};
