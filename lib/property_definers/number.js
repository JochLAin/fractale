const Model = require('../model');
const MixedPropertyDefiner = require('./mixed');

class NumberPropertyDefiner extends MixedPropertyDefiner {
    normalize(value) {
        return value === undefined ? value : Number(value);
    }

    denormalize(value) {
        return value === undefined ? value : Number(value);
    }

    validate(value) {
        if (value === undefined) return true;
        if (typeof value === 'number') return true;

        const type = value instanceof Model ? value.constructor.name : typeof value;
        throw NumberPropertyDefiner.createIncorrectTypeError(this,'number || undefined', type);
    }
}

module.exports = NumberPropertyDefiner;
