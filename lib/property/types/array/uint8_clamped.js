'use strict';

const ƒ_type = require('../index');
const base64 = require('../../../utils/base64');

module.exports = class ƒ_array_uint8_clamped extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = Uint8ClampedArray;
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof Uint8ClampedArray
            || type === 'function' && input === Uint8ClampedArray
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
        if (!value instanceof this.input && typeof value[Symbol.iterator] !== 'function' && !(typeof value === 'string' && base64.test(value))) {
            throw this.createIncorrectTypeError('Uint8ClampedArray || Iterable || base64 || undefined', value);
        }
    }

    toJSON() {
        return this.input.name;
    }
};
