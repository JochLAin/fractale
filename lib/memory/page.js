
const BaseMemory = require('./base');

module.exports = class PageMemory extends BaseMemory {
    constructor(parent, key) {
        super(parent, key);
        this.data = [];
    }

    onCreate(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index >= 0) return this.update(item);
        this.data.push(item);
        return item;
    }

    onLoad(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index >= 0) return this.onUpdate(item);
        else return this.onCreate(item);
    }

    onRead(uuid) {
        const items = this.find({ filters: { uuid } });
        if (!items.length) return;
        return items[0];
    }

    onUpdate(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index < 0) return this.create(item);
        this.data.splice(index, 1, item);
        return item;
    }

    onDelete(uuid) {
        const index = this.data.findIndex(i => i.uuid === uuid);
        if (index < 0) return;
        const item = this.data.splice(index, 1);
        return item;
    }

    onFind(params) {
        return BaseMemory.query(this.data, params);
    }
};
