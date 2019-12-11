'use strict';

const Provider = require('./index');
const CookieTable = require('../storages/cookie');

module.exports = class CookieProvider extends Provider {
    constructor() {
        super(CookieTable);
    }

    static get synchronous() {
        return true;
    }
};
