const Model = require('../model');
const MixedPropertyDefiner = require('./mixed');

class BooleanPropertyDefiner extends MixedPropertyDefiner {
    normalize(value) {
        return value === undefined ? value : Boolean(value);
    }

    denormalize(value) {
        return value === undefined ? value : Boolean(value);
    }

    validate(value) {
        if (value === undefined) return true;
        if (typeof value === 'boolean') return true;

        const type = value instanceof Model ? value.constructor.name : typeof value;
        throw BooleanPropertyDefiner.createIncorrectTypeError(this, 'boolean || undefined', type);
    }
}

module.exports = BooleanPropertyDefiner;
