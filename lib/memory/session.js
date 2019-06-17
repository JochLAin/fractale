
const BaseMemory = require('./base');

module.exports = class SessionMemory extends BaseMemory {
    constructor(parent, key) {
        super(parent, key);
        if (!global.sessionStorage) {
            throw new Error('You search to use SessionStorage on non-window script.');
        }
    }

    onCreate(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index >= 0 ) return this.update(item);
        this.data = this.data.concat([item]);
        return item;
    }

    onRead(uuid) {
        const items = this.find({ filters: { uuid } });
        if (!items.length) return;
        return items[0];
    }

    onUpdate(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index < 0 ) return this.create(item);
        const data = this.data;
        data.splice(index, 1, item);
        this.data = data;
        return item;
    }

    onDelete(uuid) {
        const index = this.data.findIndex(i => i.uuid === uuid);
        if (index < 0) return Promise.reject();
        const data = this.data;
        const item = data.splice(index, 1);
        this.data = data;
        return item;
    }

    onFind(params) {
        return BaseMemory.find(this.data, params);
    }

    get data() {
        return JSON.parse(sessionStorage.getItem(this.key) || '[]');
    }

    set data(data) {
        sessionStorage.setItem(this.key, JSON.stringify(data));
        return data;
    }
};
