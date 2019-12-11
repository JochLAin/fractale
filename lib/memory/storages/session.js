'use strict';

const session = require('../../utils/storage/session');
const { Table } = require('../index');

module.exports = class SessionTable extends Table {
    constructor(model) {
        if (!window) {
            throw new Error('You search to use SessionStorage on non-window script.');
        }
        if (!window.sessionStorage) {
            throw new Error('SessionStorage is not implemented in your navigator.');
        }
        super(model);
    }

    keys() {
        const data = JSON.parse(session[this.key] || '[]');
        return data.map(item => item.uuid);
    }

    has(uuid) {
        const data = JSON.parse(session[this.key] || '[]');
        return data.some(item => item.uuid = uuid);
    }

    create(item) {
        return this.set(item);
    }

    read(uuid) {
        const data = JSON.parse(session[this.key] || '[]');
        return data.find(item => item.uuid === uuid);
    }

    update(item) {
        return this.set(item);
    }

    delete(uuid) {
        const data = JSON.parse(session[this.key] || '[]');
        const index = data.findIndex(item => item.uuid === uuid);
        const item = data.splice(index, 1);
        session[this.key] = JSON.stringify(data);
        return item;
    }

    set(item) {
        const data = JSON.parse(session[this.key] || '[]');
        const index = data.findIndex(element => element.uuid === item.uuid);
        if (index >= 0) data.splice(index, 1, item);
        else data.push(item);
        session[this.key] = JSON.stringify(data);
        return item;
    }
};
