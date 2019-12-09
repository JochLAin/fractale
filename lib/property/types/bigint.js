'use strict';

const ƒ_type = require('./index');

module.exports = class ƒ_bigint extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = BigInt;
    }

    static evaluate(input, type) {
        return type === 'bigint'
            || type === 'string' && ['bigint'].includes(input)
            || type === 'function' && input === BigInt
        ;
    }

    static get priority() {
        return 10;
    }

    expose(property) {
        return property.value === undefined ? property.value : this.input(property.value);
    }

    flatten(value) {
        return value === undefined ? value : this.input(value);
    }

    shape(value, options) {
        return value === undefined ? value : this.input(value);
    }

    validate(value) {
        if (value === undefined) return;
        if (typeof value !== 'bigint') {
            throw this.createIncorrectTypeError('bigint || undefined', value);
        }

        if (!this.options.validator) return;
        ƒ_type.prototype.validate.call(this, value);
        const { validator } = this.options;
        if (typeof validator === 'object') {
            if (validator.hasOwnProperty('lt')) {
                if (typeof validator.lt !== 'bigint') {
                    throw new Error(`Expected bigint as value for "lt" validator, got ${JSON.stringify(typeof validator.lt)}`);
                }
                if (value >= validator.lt) {
                    throw new Error(`Expected value lower than ${validator.lt}, got ${JSON.stringify(value)}`);
                }
            }
            if (validator.hasOwnProperty('lte')) {
                if (typeof validator.lte !== 'bigint') {
                    throw new Error(`Expected bigint as value for "lte" validator, got ${JSON.stringify(typeof validator.lte)}`);
                }
                if (value > validator.lte) {
                    throw new Error(`Expected value lower than or equal to ${validator.lte}, got ${JSON.stringify(value)}`);
                }
            }
            if (validator.hasOwnProperty('gt')) {
                if (typeof validator.gt !== 'bigint') {
                    throw new Error(`Expected bigint as value for "gt" validator, got ${JSON.stringify(typeof validator.gt)}`);
                }
                if (value <= validator.gt) {
                    throw new Error(`Expected value greater than ${validator.gt}, got ${JSON.stringify(value)}`);
                }
            }
            if (validator.hasOwnProperty('gte')) {
                if (typeof validator.gte !== 'bigint') {
                    throw new Error(`Expected bigint as value for "gte" validator, got ${JSON.stringify(typeof validator.gte)}`);
                }
                if (value < validator.gte) {
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
                if (!validator.between.reduce((accu, item) => accu && typeof item === 'bigint', true)) {
                    throw new Error(`Expected array of bigints as value for "between" validator, got ${JSON.stringify(typeof validator.between.find(item => typeof item !== 'bigint'))}`);
                }

                if (value < validator.between[0] || value > validator.between[1]) {
                    throw new Error(`Expected value between ${validator.between[0]} and ${validator.between[1]}, got ${JSON.stringify(value)}`);
                }
            }
        }
    }

    toJSON() {
        return this.input.name;
    }
};
