const Provider = require('./index');

module.exports = class InternalProvider extends Provider {
    constructor(model) {
        super(model);
        this.data = new Map();
    }

    create(item) {
        this.data.set(item.uuid, item);
        return item;
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

    values() {
        return Array.from(this.data.values());
    }

    keys() {
        return Array.from(this.data.keys());
    }

    clear() {
        return this.data.clear();
    }
};
