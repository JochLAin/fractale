const EventListener = require('../event_listener');

module.exports = class Table extends EventListener {
    constructor(entity) {
        super();
        this.entity = entity;
        this.data = new Map();
    }

    create(item) {
        this.data.set(item.uuid, item);
        this.emit('create', { item });
        return item;
    }

    load(item) {
        if (this.data.has(item.uuid)) item = this.update(item);
        else item = this.create(item);
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
