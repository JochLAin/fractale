'use strict';

const Provider = require('./index');
const SessionTable = require('../storages/session');

module.exports = class SessionProvider extends Provider {
    constructor() {
        super(SessionTable);
    }

    static get synchronous() {
        return true;
    }
};
