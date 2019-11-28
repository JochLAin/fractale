'use strict';

const ƒ_type = require('./index');

module.exports = class ƒ_mixed extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = undefined;
    }

    static evaluate(input, type) {
        return input === null || input === undefined;
    }
};
