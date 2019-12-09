'use strict';

const ƒ_type = require('../index');
const { base64 } = require('./buffer');
const IS_BASE64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

module.exports = class ƒ_array_float32 extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = Float32Array;
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof Float32Array
            || type === 'function' && input === Float32Array
        ;
    }

    static get priority() {
        return 2;
    }

    expose(property) {
        if (property.value === undefined) return property.value;
        return new this.input(base64.decode(property.value));
    }

    flatten(value) {
        if (value === undefined) return value;
        if (typeof value === 'string') return value;
        return base64.encode((new this.input(value)).buffer);
    }

    validate(value) {
        if (value === undefined) return;
        if (!value instanceof this.input && typeof value[Symbol.iterator] !== 'function' && !(typeof value === 'string' && IS_BASE64.test(value))) {
            throw this.createIncorrectTypeError('Float32Array || Iterable || base64 || undefined', value);
        }
    }

    toJSON() {
        return this.input.name;
    }
};
