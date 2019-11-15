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
        if (value !== undefined && typeof value !== 'boolean') {
            const type = value instanceof Model ? value.constructor.name : typeof value;
            throw BooleanPropertyDefiner.createIncorrectTypeError(this, 'boolean || undefined', type);
        }
        MixedPropertyDefiner.prototype.validate.call(this, value);
        return true;
    }
}

module.exports = BooleanPropertyDefiner;
