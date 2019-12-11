'use strict';

const EventListener = require('../event_listener');
const Provider = require('./providers');

let providers = {
    local: Provider.LocalProvider,
    session: Provider.SessionProvider,
    cookie: Provider.CookieProvider,
};

module.exports = class Table extends EventListener {
    constructor(entity) {
        super();
        this.entity = entity;
        this.data = new Map();
    }

    clear(uuid) {
        if (uuid) {
            this.data.delete(uuid);
        } else {
            this.data = new Map();
        }
    }

    contains(uuid) {
        return this.data.has(uuid);
    }

    load(item) {
        if (this.contains(item.uuid)) {
            return this.update(item);
        }
        return this.create(item);
    }

    create(item) {
        this.data.set(item.uuid, item);
        this.emit('create', { item });
        return item;
    }

    read(uuid) {
        return this.data.get(uuid);
    }

    update(item) {
        this.data.set(item.uuid, item);
        this.emit('update', { item });
        return item;
    }

    delete(uuid) {
        const item = this.data.get(uuid);
        this.data.delete(uuid);
        this.emit('delete', { item });
        return item;
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
        return this.data;
    }
};
