'use strict';

const { createIncorrectTypeError } = require('../../../errors');
const ƒ_type = require('../base');

module.exports = class ƒ_boolean extends ƒ_type {
    constructor(field, input) {
        super(field, input);
        this.value = Boolean;
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

    normalize(next) {
        return next === undefined ? next : Boolean(next);
    }

    denormalize(next) {
        return next === undefined ? next : Boolean(next);
    }

    deserialize(value) {
        return value === undefined ? value : Boolean(value);
    }

    serialize(value) {
        return value === undefined ? value : Boolean(value);
    }

    validate(value) {
        if (value !== undefined && typeof value !== 'boolean') {
            throw createIncorrectTypeError(this.field,'boolean || undefined', value);
        }
        ƒ_type.prototype.validate.call(this, value);
    }
};

module.exports.priority = 10000;
