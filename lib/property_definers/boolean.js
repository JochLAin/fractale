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
            throw BooleanPropertyDefiner.createIncorrectTypeError(this, 'boolean || undefined', value);
        }
        MixedPropertyDefiner.prototype.validate.call(this, value);
        return true;
    }
}

module.exports = BooleanPropertyDefiner;
