const EventListener = require('../event_listener');

module.exports = class Table extends EventListener {
    constructor(entity) {
        super();
        this.entity = entity;
        this.data = [];
    }

    create(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index >= 0) return this.update(item);
        this.data.push(item);
        this.emit('create', { item });
        return item;
    }

    load(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index >= 0) item = this.update(item);
        else item = this.create(item);
        return item;
    }

    read(uuid) {
        const items = this.find({ filters: { uuid } });
        if (!items.length) return;
        return items[0];
    }

    update(item) {
        const index = this.data.findIndex(i => i.uuid === item.uuid);
        if (index < 0) return this.create(item);
        if (JSON.stringify(item) === JSON.stringify(this.data[index])) return;
        this.data.splice(index, 1, item);
        this.emit('update', { item });
        return item;
    }

    delete(uuid) {
        const index = this.data.findIndex(i => i.uuid === uuid);
        if (index < 0) return;
        const item = this.data.splice(index, 1);
        this.emit('delete', { item });
        return item;
    }

    find(params) {
        const { columns, filters, limit, offset, sorts, group } = params;

        const results = this.data.filter(item => {
            if (!filters) return true;
            for (let key in filters) {
                if (filters.hasOwnProperty(key)) {
                    if (item[key] !== filters[key]) {
                        return false;
                    }
                }
            }
            return true;
        }).sort((a, b) => {
            if (!sorts) return 0;
            for (let key in sorts) {
                if (sorts.hasOwnProperty(key)) {
                    if (sorts[key] === 'DESC') {
                        if (a[key] < b[key]) return -1;
                        if (a[key] > b[key]) return 1;
                    } else {
                        if (a[key] > b[key]) return -1;
                        if (a[key] < b[key]) return 1;
                    }
                }
            }
        }).map(item => {
            if (!columns) return item;
            return Object.keys(item).filter(key => columns.includes(key)).reduce((accu, key) => {
                return Object.assign({}, accu, { [key]: item[key] });
            }, {});
        });

        return results.slice(offset, limit || results.length).reduce((accu, item) => {
            if (!group || !group.length) return [].concat(accu || [], item);
            if (Array.isArray(accu)) accu = {};
            (accu[item[group]] = accu[item[group]] || []).push(item);
            return accu;
        }, []);
    }

    toJSON() {
        return this.data;
    }
};
