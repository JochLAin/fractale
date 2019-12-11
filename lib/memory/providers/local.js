'use strict';

const Provider = require('./index');
const LocalTable = require('../storages/local');

module.exports = class LocalProvider extends Provider {
    constructor() {
        super(LocalTable);
    }

    static get synchronous() {
        return true;
    }
};
