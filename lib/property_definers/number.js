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
        if (value !== undefined && typeof value !== 'number') {
            const type = value instanceof Model ? value.constructor.name : typeof value;
            throw NumberPropertyDefiner.createIncorrectTypeError(this,'number || undefined', type);
        }

        MixedPropertyDefiner.prototype.validate.call(this, value);
        if (this.field.options.validator) {
            const validator = this.field.options.validator;
            if (typeof validator === 'object') {
                if (validator.hasOwnProperty('lt')) {
                    if (typeof validator.lt !== 'number') {
                        throw new Error(`Expected number as value for "lt" validator, got ${JSON.stringify(typeof validator.lt)}`);
                    }
                    if (value && value >= validator.lt) {
                        throw new Error(`Expected value lower than ${validator.lt}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('lte')) {
                    if (typeof validator.lte !== 'number') {
                        throw new Error(`Expected number as value for "lte" validator, got ${JSON.stringify(typeof validator.lte)}`);
                    }
                    if (value && value > validator.lte) {
                        throw new Error(`Expected value lower than or equal to ${validator.lte}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('gt')) {
                    if (typeof validator.gt !== 'number') {
                        throw new Error(`Expected number as value for "gt" validator, got ${JSON.stringify(typeof validator.gt)}`);
                    }
                    if (value && value <= validator.gt) {
                        throw new Error(`Expected value greater than ${validator.gt}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('gte')) {
                    if (typeof validator.gte !== 'number') {
                        throw new Error(`Expected number as value for "gte" validator, got ${JSON.stringify(typeof validator.gte)}`);
                    }
                    if (value && value < validator.gte) {
                        throw new Error(`Expected value greater than or equal to ${validator.gte}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('between')) {
                    if (!Array.isArray(validator.between)) {
                        throw new Error(`Expected array as value for "between" validator, got ${JSON.stringify(typeof validator.between)}`);
                    }
                    if (validator.between.length !== 2) {
                        throw new Error(`Expected array with min and max only as value for "between" validator, got ${validator.between.length} items`);
                    }
                    if (validator.between.reduce((accu, item) => accu && typeof item === 'number', true)) {
                        throw new Error(`Expected array of numbers as value for "between" validator, got ${JSON.stringify(typeof validator.between.find(item => typeof item !== 'number'))}`);
                    }
                    if (value && (value > validator.between[0] || value < validator.between[1])) {
                        throw new Error(`Expected value between ${validator.between[0]} and ${validator.between[1]}, got ${JSON.stringify(value)}`);
                    }
                }
            }
        }
        return true;
    }
}

module.exports = NumberPropertyDefiner;
