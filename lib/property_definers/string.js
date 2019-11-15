const Model = require('../model');
const MixedPropertyDefiner = require('./mixed');

class StringPropertyDefiner extends MixedPropertyDefiner {
    normalize(value) {
        return value && String(value);
    }

    denormalize(value) {
        return value && String(value);
    }

    validate(value) {
        if (value === undefined) return true;
        if (typeof value === 'string') return true;

        const type = value instanceof Model ? value.constructor.name : typeof value;
        throw StringPropertyDefiner.createIncorrectTypeError(this,'string || undefined', type);
    }
}

module.exports = StringPropertyDefiner;
