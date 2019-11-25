const { createIncorrectTypeError } = require('../../errors');
const MixedType = require('./mixed');

module.exports = class BooleanType extends MixedType {
    static normalize(field, next, current) {
        return next === undefined ? next : Boolean(next);
    }

    static denormalize(field, next, current) {
        return next === undefined ? next : Boolean(next);
    }

    static deserialize(field, value) {
        return value === undefined ? value : Boolean(value);
    }

    static serialize(field, value, options = {}) {
        return value === undefined ? value : Boolean(value);
    }

    static validate(field, value) {
        if (value !== undefined && typeof value !== 'boolean') {
            throw createIncorrectTypeError(field,'boolean || undefined', value);
        }
        MixedType.validate(field, value);
    }
};
