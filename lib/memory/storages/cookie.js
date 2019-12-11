'use strict';

const cookie = require('../../utils/storage/cookie');
const { Table } = require('../index');

module.exports = class CookieTable extends Table {
    constructor(model) {
        if (!window || !document) {
            throw new Error('You search to use CookieStorage on non-window script.');
        }
        super(model);
    }

    keys() {
        const data = JSON.parse(cookie[this.key] || '[]');
        return data.map(item => item.uuid);
    }

    has(uuid) {
        const data = JSON.parse(cookie[this.key] || '[]');
        return data.some(item => item.uuid = uuid);
    }

    create(item) {
        return this.set(item);
    }

    read(uuid) {
        const data = JSON.parse(cookie[this.key] || '[]');
        return data.find(item => item.uuid === uuid);
    }

    update(item) {
        return this.set(item);
    }

    delete(uuid) {
        const data = JSON.parse(cookie[this.key] || '[]');
        const index = data.findIndex(item => item.uuid === uuid);
        const item = data.splice(index, 1);
        cookie[this.key] = JSON.stringify(data);
        return item;
    }

    set(item) {
        const data = JSON.parse(cookie[this.key] || '[]');
        const index = data.findIndex(element => element.uuid === item.uuid);
        if (index >= 0) data.splice(index, 1, item);
        else data.push(item);
        cookie[this.key] = JSON.stringify(data);
        return item;
    }
};
