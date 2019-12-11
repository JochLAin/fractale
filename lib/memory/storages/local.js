'use strict';

const local = require('../../utils/storage/local');
const { Table } = require('../index');

module.exports = class LocalTable extends Table {
    constructor(model) {
        if (!window) {
            throw new Error('You search to use LocalStorage on non-window script.');
        }
        if (!window.localStorage) {
            throw new Error('LocalStorage is not implemented in your navigator.');
        }
        super(model);
    }

    keys() {
        const data = JSON.parse(local[this.key] || '[]');
        return data.map(item => item.uuid);
    }

    has(uuid) {
        const data = JSON.parse(local[this.key] || '[]');
        return data.some(item => item.uuid = uuid);
    }

    create(item) {
        return this.set(item);
    }

    read(uuid) {
        const data = JSON.parse(local[this.key] || '[]');
        return data.find(item => item.uuid === uuid);
    }

    update(item) {
        return this.set(item);
    }

    delete(uuid) {
        const data = JSON.parse(local[this.key] || '[]');
        const index = data.findIndex(item => item.uuid === uuid);
        data.splice(index, 1);
        local[this.key] = JSON.stringify(data);
    }

    set(item) {
        const data = JSON.parse(local[this.key] || '[]');
        const index = data.findIndex(element => element.uuid === item.uuid);
        if (index >= 0) data.splice(index, 1, item);
        else data.push(item);
        local[this.key] = JSON.stringify(data);
    }
};
