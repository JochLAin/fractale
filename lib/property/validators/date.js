const moment = require('moment');
const MixedValidator = require('./mixed');

module.exports = class DateValidator extends MixedValidator {
    static validate(field, value) {
        if (value !== undefined && typeof value !== 'string' && !(value instanceof Date) && !moment.isMoment(value)) {
            throw DateValidator.createIncorrectTypeError('date || moment || string || undefined', value);
        }

        MixedValidator.validate(field, value);
        if (value && field.options.validator) {
            const validator = field.options.validator;
            if (typeof validator === 'object') {
                if (validator.hasOwnProperty('lt')) {
                    if (typeof validator.lt !== 'string' && !(validator.lt instanceof Date) && !moment.isMoment(validator.lt)) {
                        throw new Error(`Expected string || date || moment as value for "lt" validator, got ${JSON.stringify(typeof validator.lt)}`);
                    }
                    if (!moment(value).isBefore(validator.lt)) {
                        throw new Error(`Expected value lower than ${moment(validator.lt).toISOString()}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('lte')) {
                    if (typeof validator.lte !== 'string' && !(validator.lte instanceof Date) && !moment.isMoment(validator.lte)) {
                        throw new Error(`Expected string || date || moment as value for "lte" validator, got ${JSON.stringify(typeof validator.lte)}`);
                    }
                    if (!moment(value).isSameOrBefore(validator.lte)) {
                        throw new Error(`Expected value lower than or equal to ${moment(validator.lte).toISOString()}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('gt')) {
                    if (typeof validator.gt !== 'string' && !(validator.gt instanceof Date) && !moment.isMoment(validator.gt)) {
                        throw new Error(`Expected string || date || moment as value for "gt" validator, got ${JSON.stringify(typeof validator.gt)}`);
                    }
                    if (!moment(value).isAfter(validator.gt)) {
                        throw new Error(`Expected value greater than ${moment(validator.gt).toISOString()}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('gte')) {
                    if (typeof validator.gte !== 'string' && !(validator.gte instanceof Date) && !moment.isMoment(validator.gte)) {
                        throw new Error(`Expected string || date || moment as value for "gte" validator, got ${JSON.stringify(typeof validator.gte)}`);
                    }
                    if (!moment(value).isSameOrAfter(validator.gte)) {
                        throw new Error(`Expected value greater than or equal to ${moment(validator.gte).toISOString()}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('between')) {
                    if (!Array.isArray(validator.between)) {
                        throw new Error(`Expected array as value for "between" validator, got ${JSON.stringify(typeof validator.between)}`);
                    }
                    if (validator.between.length > 2) {
                        throw new Error(`Expected array with min and/or max only as value for "between" validator, got ${validator.between.length} items`);
                    }
                    if (validator.between.reduce((accu, item) => accu && typeof value !== 'string' && !(item instanceof Date) && !moment.isMoment(item), true)) {
                        throw new Error(`Expected array of string || date || moment as value for "between" validator, got ${JSON.stringify(typeof validator.between.find(item => !(item instanceof Date) && !moment.isMoment(item)))}`);
                    }
                    if (!moment(value).isBetween(validator.between[0], validator.between[1])) {
                        throw new Error(`Expected value between ${moment(validator.between[0]).toISOString()} and ${moment(validator.between[1]).toISOString()}, got ${JSON.stringify(value)}`);
                    }
                }
            }
        }
    }
};
