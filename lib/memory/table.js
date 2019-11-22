const EventListener = require('../event_listener');

module.exports = class Table extends EventListener {
    constructor(entity) {
        super();
        this.entity = entity;
        this.data = new Map();
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

    toJSON() {
        return this.data;
    }
};
