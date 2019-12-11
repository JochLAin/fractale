'use strict';

const Provider = require('./index');
const InternalTable = require('../storages/internal');

module.exports = class InternalProvider extends Provider {
    constructor() {
        super(InternalTable);
    }

    static get synchronous() {
        return true;
    }
};
