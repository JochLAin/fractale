
const BaseMemory = require('./base');

module.exports = class PageMemory extends BaseMemory {
    constructor(key) {
        super(key);
        this.data = [];
    }

    create(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index >= 0 ) return this.update(item);
        this.data.push(item);
        return item;
    }

    read(uuid) {
        const items = this.find({ filters: { uuid } });
        if (!items.length) return;
        return items[0];
    }

    update(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index < 0 ) return this.create(item);
        this.data.splice(index, 1, item);
        return item;
    }

    delete(uuid) {
        const index = this.data.findIndex(i => i.uuid === uuid);
        if (index < 0) return Promise.reject();
        return this.data.splice(index, 1);
    }

    find(params) {
        return BaseMemory.find(this.data, params);
    }
};
