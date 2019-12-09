'use strict';

const ƒ_type = require('./index');
const IS_REGEXP = /^\/(.+)\/([gmixXsuUAJD]*)?$/;

module.exports = class ƒ_regexp extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = RegExp;
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof RegExp
            || type === 'string' && IS_REGEXP.test(input)
            || type === 'function' && input === RegExp
        ;
    }

    static get priority() {
        return 5;
    }

    expose(property) {
        if (property.value === undefined) return property.value;
        const match = property.value.match(IS_REGEXP);
        return new RegExp(match[1], match[2]);
    }

    flatten(value) {
        if (value === undefined) return value;
        if (value instanceof RegExp) return value.toString();
        return value;
    }

    serialize(value, options) {
        return value === undefined ? value : value.toString();
    }

    validate(value) {
        if (value === undefined) return;
        if (!value instanceof RegExp && !(typeof value === 'string' && IS_REGEXP.test(value))) {
            throw this.createIncorrectTypeError('RegExp || string || undefined', value);
        }

        if (!this.options.validator) return;
        ƒ_type.prototype.validate.call(this, value);
    }

    toJSON() {
        return this.input.name;
    }
};
