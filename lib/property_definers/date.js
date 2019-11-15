const moment = require('moment');
const Fractale = require('../index');
const Model = require('../model');
const MixedPropertyDefiner = require('./mixed');

class DatePropertyDefiner extends MixedPropertyDefiner {
    normalize(value) {
        if (!value) return undefined;
        return value.toISOString();
    }

    denormalize(value) {
        if (!value) return undefined;
        if (Fractale.getOption('moment')) {
            return moment(value);
        }
        return new Date(value);
    }

    validate(value) {
        if (value !== undefined && !(value instanceof Date) && !moment.isMoment(value)) {
            const type = value instanceof Model ? value.constructor.name : typeof value;
            throw DatePropertyDefiner.createIncorrectTypeError(this,'date || moment || undefined', type);
        }

        MixedPropertyDefiner.prototype.validate.call(this, value);
        if (this.field.options.validator) {
            const validator = this.field.options.validator;
            if (typeof validator === 'object') {
                if (validator.hasOwnProperty('lt')) {
                    if (!(validator.lt instanceof Date) && !moment.isMoment(validator.lt)) {
                        throw new Error(`Expected date or moment as value for "lt" validator, got ${JSON.stringify(typeof validator.lt)}`);
                    }
                    if (value && !moment(value).isBefore(validator.lt)) {
                        throw new Error(`Expected value lower than ${validator.lt}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('lte')) {
                    if (!(validator.lte instanceof Date) && !moment.isMoment(validator.lte)) {
                        throw new Error(`Expected date or moment as value for "lte" validator, got ${JSON.stringify(typeof validator.lte)}`);
                    }
                    if (value && !moment(value).isSameOrBefore(validator.lte)) {
                        throw new Error(`Expected value lower than or equal to ${validator.lte}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('gt')) {
                    if (!(validator.gt instanceof Date) && !moment.isMoment(validator.gt)) {
                        throw new Error(`Expected date or moment as value for "gt" validator, got ${JSON.stringify(typeof validator.gt)}`);
                    }
                    if (value && !moment(value).isAfter(validator.gt)) {
                        throw new Error(`Expected value greater than ${validator.gt}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('gte')) {
                    if (!(validator.gte instanceof Date) && !moment.isMoment(validator.gte)) {
                        throw new Error(`Expected date or moment as value for "gte" validator, got ${JSON.stringify(typeof validator.gte)}`);
                    }
                    if (value && !moment(value).isSameOrAfter(validator.gte)) {
                        throw new Error(`Expected value greater than or equal to ${validator.gte}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('between')) {
                    if (!Array.isArray(validator.between)) {
                        throw new Error(`Expected array as value for "between" validator, got ${JSON.stringify(typeof validator.between)}`);
                    }
                    if (validator.between.length > 2) {
                        throw new Error(`Expected array with min and/or max only as value for "between" validator, got ${validator.between.length} items`);
                    }
                    if (validator.between.reduce((accu, item) => accu && !(item instanceof Date) && !moment.isMoment(item), true)) {
                        throw new Error(`Expected array of dates or moments as value for "between" validator, got ${JSON.stringify(typeof validator.between.find(item => !(item instanceof Date) && !moment.isMoment(item)))}`);
                    }
                    if (value && !moment(value).isBetween(validator.between[0], validator.between[1])) {
                        throw new Error(`Expected value between ${validator.between[0]} and ${validator.between[1]}, got ${JSON.stringify(value)}`);
                    }
                }
            }
        }
        return true;
    }
}

module.exports = DatePropertyDefiner;
