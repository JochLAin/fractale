const base64 = require('../../../utils/base64');
const ƒ_type = require('../index');

module.exports = class ƒ_array_buffer extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, ArrayBuffer, input, options);
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof ArrayBuffer
            || type === 'function' && input === ArrayBuffer
        ;
    }

    static get priority() {
        return 3;
    }

    expose(property) {
        if (property.value === undefined) return property.value;
        return base64.decode(property.value);
    }

    flatten(value) {
        if (value === undefined) return value;
        if (typeof value === 'string') return value;
        return base64.encode(value);
    }

    validate(value) {
        if (value === undefined) return;
        if (!(value instanceof this.generator) && !(typeof value === 'string' && base64.test(value))) {
            throw this.createIncorrectTypeError('ArrayBuffer || base64 || undefined', value);
        }
    }

    toJSON() {
        return this.generator.name;
    }
};
