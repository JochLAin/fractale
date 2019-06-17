
const EventListener = require('../event_listener');
const { promisified } = require('../helpers/promise');

module.exports = class BaseMemory extends EventListener {
    constructor(parent, name) {
        super();
        this.parent = parent;
        this.name = name;
        this.key = `${name}__fractalememorykey`;
    }

    create() {
        if (!(this.onCreate instanceof Function)) {
            throw new Error(`Memory "${this.constructor.name}" doesn't implements method "create"`);
        }

        return promisified(this.onCreate.apply(this, arguments), item => {
            this.dispatchEvent('create', { item });
            this.parent.dispatchEvent('create', { name: this.name, item });
            return item;
        });
    }

    read() {
        if (!(this.onRead instanceof Function)) {
            throw new Error(`Memory "${this.constructor.name}" doesn't implements method "read"`);
        }

        return this.onRead.apply(this, arguments);
    }

    update() {
        if (!(this.onUpdate instanceof Function)) {
            throw new Error(`Memory "${this.constructor.name}" doesn't implements method "update"`);
        }

        return promisified(this.onUpdate.apply(this, arguments), item => {
            this.dispatchEvent('update', { item });
            this.parent.dispatchEvent('update', { name: this.name, item });
            return item;
        });
    }

    delete() {
        if (!(this.onDelete instanceof Function)) {
            throw new Error(`Memory "${this.constructor.name}" doesn't implements method "delete"`);
        }

        return promisified(this.onDelete.apply(this, arguments), item => {
            this.dispatchEvent('delete', { item });
            this.parent.dispatchEvent('delete', { name: this.name, item });
            return item;
        });
    }

    find() {
        if (!(this.onFind instanceof Function)) {
            throw new Error(`Memory "${this.constructor.name}" doesn't implements method "find"`);
        }

        return this.onFind.apply(this, arguments);
    }

    get encyclopedia() {
        return require('../library').get(this.name);
    }

    get entity() {
        return this.encyclopedia.entity;
    }
};

module.exports.query = (data, params) => {
    const { columns, filters, limit, offset, sorts, group } = params;

    const results = data.filter(item => {
        if (!filters) return true;
        for (let key in filters) {
            if (item[key] !== filters[key]) {
                return false;
            }
        }
        return true;
    }).sort((a, b) => {
        if (!sorts) return 0;
        for (let key in sorts) {
            if (sorts[key] == 'DESC') {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
            } else {
                if (a[key] > b[key]) return -1;
                if (a[key] < b[key]) return 1;
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
};