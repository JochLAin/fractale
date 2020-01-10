const { stringify } = require('../../utils');
const ƒ_type = require('./index');

module.exports = class ƒ_bigint extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, BigInt, input, options);
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
        return property.value === undefined ? property.value : this.generator(property.value);
    }

    flatten(value) {
        return value === undefined ? value : this.generator(value);
    }

    shape(value, options) {
        return value === undefined ? value : this.generator(value);
    }

    parseValidator(validator) {
        validator = super.parseValidator(validator);
        if (typeof validator !== 'object') return validator;
        if (Object.prototype.hasOwnProperty.call(validator, 'eq')) {
            if (typeof validator.eq !== 'bigint') {
                throw this.createIncorrectValidatorTypeError('eq', 'bigint', typeof validator.eq);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'neq')) {
            if (typeof validator.neq !== 'bigint') {
                throw this.createIncorrectValidatorTypeError('neq', 'bigint', typeof validator.neq);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'lt')) {
            if (typeof validator.lt !== 'bigint') {
                throw this.createIncorrectValidatorTypeError('lt', 'bigint', typeof validator.lt);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'lte')) {
            if (typeof validator.lte !== 'bigint') {
                throw this.createIncorrectValidatorTypeError('lte', 'bigint', typeof validator.lte);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'gt')) {
            if (typeof validator.gt !== 'bigint') {
                throw this.createIncorrectValidatorTypeError('gt', 'bigint', typeof validator.gt);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'gte')) {
            if (typeof validator.gte !== 'bigint') {
                throw this.createIncorrectValidatorTypeError('gte', 'bigint', typeof validator.gte);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'between')) {
            if (!Array.isArray(validator.between)) {
                throw this.createIncorrectValidatorTypeError('between', 'array', typeof validator.between);
            }
            if (validator.between.length !== 2) {
                throw this.createIncorrectValidatorTypeError('between', 'array with min and max only', `${validator.between.length} items`);
            }
            for (let idx = 0; idx < validator.between.length; idx++) {
                if (typeof validator.between[idx] !== 'bigint') {
                    throw this.createIncorrectValidatorTypeError(`between[${idx}]`, 'bigint', typeof validator.between[idx]);
                }
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'in')) {
            for (let idx = 0; idx < validator.in.length; idx++) {
                if (typeof validator.in[idx] !== 'bigint') {
                    throw this.createIncorrectValidatorTypeError(`in[${idx}]`, 'bigint', typeof validator.in[idx]);
                }
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'notin')) {
            for (let idx = 0; idx < validator.notin.length; idx++) {
                if (typeof validator.notin[idx] !== 'bigint') {
                    throw this.createIncorrectValidatorTypeError(`notin[${idx}]`, 'bigint', typeof validator.notin[idx]);
                }
            }
        }
        return validator;
    }

    validate(value) {
        if (this.options.required && value === undefined || value === null) {
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (typeof value !== 'bigint') {
            throw this.createIncorrectTypeError('bigint || undefined', value);
        }

        if (!this.validator) return;
        super.validate(value);
        if (typeof this.validator === 'object') {
            if (Object.prototype.hasOwnProperty.call(this.validator, 'lt')) {
                if (value >= this.validator.lt) {
                    throw this.createValidatorError('lt', value, `lower than ${this.validator.lt}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'lte')) {
                if (value > this.validator.lte) {
                    throw this.createValidatorError('lte', value, `lower than or equal to ${this.validator.lte}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'gt')) {
                if (value <= this.validator.gt) {
                    throw this.createValidatorError('gt', value, `greater than ${this.validator.gt}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'gte')) {
                if (value < this.validator.gte) {
                    throw this.createValidatorError('gte', value, `greater than or equal ${this.validator.gte}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'between')) {
                if (value < this.validator.between[0] || value > this.validator.between[1]) {
                    throw this.createValidatorError('between', value, `between ${this.validator.between[0]} and ${this.validator.between[1]}`);
                }
            }
        }
    }

    toBasic(replacer) {
        const value = BigInt;
        if (replacer instanceof Function) return replacer(value, this);
        return value;
    }

    toJSON() {
        if (Object.keys(this.options).length) {
            return `Fractale.with(${this.generator.name}, ${stringify(this.options, (k, v) => typeof v === 'bigint' ? v.toString() : v)})`;
        }
        return this.generator.name;
    }
};
