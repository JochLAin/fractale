'use strict';

const EventListener = require('../event_listener');
const Provider = require('./providers');

let providers = {
    local: Provider.LocalProvider,
    session: Provider.SessionProvider,
    cookie: Provider.CookieProvider,
};

module.exports = class Table extends EventListener {
    constructor(memory, entity, provider) {
        super();
        this.memory = memory;
        this.entity = entity;
        this.data = new Map();
        if (provider) {
            this.provider = provider;
            this.addEventListener('create', ({ item }) => {
                if (this.provider) this.provider.onCreate(item);
            });
            this.addEventListener('update', ({ item }) => {
                if (this.provider) this.provider.onUpdate(item);
            });
            this.addEventListener('delete', ({ item }) => {
                if (this.provider) this.provider.onDelete(item);
            });
        }
    }

    clear(uuid) {
        if (uuid) this.data.delete(uuid);
        else for (let idx = 0, keys = [...this.data.keys()]; idx < keys.length; idx++) {
            this.delete(keys[idx]);
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

    set provider(Provider) {
        if (!Provider) this._provider = undefined;
        return this._provider = new Provider(this.entity);
    }

    get provider() {
        return this._provider;
    }

    toJSON() {
        return Array.from(this.data.values());
    }
};
