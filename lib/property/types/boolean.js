'use strict';

const ƒ_type = require('./index');

module.exports = class ƒ_boolean extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = Boolean;
    }

    static evaluate(input, type) {
        return type === 'boolean'
            || type === 'string' && ['bool', 'boolean'].includes(input)
            || type === 'function' && input === Boolean
        ;
    }

    static get priority() {
        return 10;
    }

    expose(property) {
        return property.value === undefined ? property.value : this.input(property.value);
    }

    flatten(value) {
        return value === undefined ? value : this.input(value);
    }

    shape(value, options) {
        return value === undefined ? value : this.input(value);
    }

    validate(value) {
        if (value === undefined) return;
        if (typeof value !== 'boolean') {
            throw this.createIncorrectTypeError('boolean || undefined', value);
        }

        if (!this.options.validator) return;
        ƒ_type.prototype.validate.call(this, value);
    }

    toJSON() {
        return this.input.name;
    }
};
