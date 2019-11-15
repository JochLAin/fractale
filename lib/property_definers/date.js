const moment = require('moment');
const Model = require('../model');
const MixedPropertyDefiner = require('./mixed');

class DatePropertyDefiner extends MixedPropertyDefiner {
    normalize(value) {
        if (!value) return undefined;
        return value.toISOString();
    }

    denormalize(value) {
        if (!value) return undefined;
        return moment(value);
    }

    validate(value) {
        if (value === undefined) return true;
        if (value instanceof Date) return true;
        if (moment.isMoment(value)) return true;

        const type = value instanceof Model ? value.constructor.name : typeof value;
        throw DatePropertyDefiner.createIncorrectTypeError(this,'date || moment || undefined', type);
    }
}

module.exports = DatePropertyDefiner;
