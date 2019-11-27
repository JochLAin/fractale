'use strict';

const { createIncorrectTypeError } = require('../../../errors');
const ƒ_type = require('../base');

module.exports = class ƒ_boolean extends ƒ_type {
    static evaluate(input, type) {
        return type === 'object' && Array.isArray(input);
    }

    static get priority() {
        return 15;
    }

    normalize(next, current) {
        return next === undefined ? next : Boolean(next);
    }

    denormalize(next, current) {
        return next === undefined ? next : Boolean(next);
    }

    deserialize(value) {
        return value === undefined ? value : Boolean(value);
    }

    serialize(value, options = {}) {
        return value === undefined ? value : Boolean(value);
    }

    validate(value) {
        if (value !== undefined && typeof value !== 'boolean') {
            throw createIncorrectTypeError(this.field,'boolean || undefined', value);
        }
        ƒ_type.validate(this.field, value);
    }
};

module.exports.priority = 10000;
