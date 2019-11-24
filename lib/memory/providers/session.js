const Provider = require('./index');

module.exports = class SessionProvider extends Provider {
    constructor() {
        super();
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
        if (index < 0) return;
        const data = this.data;
        const item = data.splice(index, 1);
        this.data = data;
        return item;
    }

    get data() {
        return JSON.parse(sessionStorage.getItem(this.key) || '[]');
    }

    set data(data) {
        sessionStorage.setItem(this.key, JSON.stringify(data));
        return data;
    }

    get key() {
        return `fractable_${this.entity.slug}`;
    }
};
