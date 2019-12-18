const ƒ_type = require('./index');

module.exports = class ƒ_number extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, Number, input, options);
    }

    static evaluate(input, type) {
        return type === 'number'
            || type === 'string' && ['number'].includes(input)
            || type === 'function' && input === Number
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
            if (typeof validator.eq !== 'number') {
                throw this.createIncorrectValidatorTypeError('eq', 'number', typeof validator.eq);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'neq')) {
            if (typeof validator.neq !== 'number') {
                throw this.createIncorrectValidatorTypeError('neq', 'number', typeof validator.neq);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'lt')) {
            if (typeof validator.lt !== 'number') {
                throw this.createIncorrectValidatorTypeError('lt', 'number', typeof validator.lt);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'lte')) {
            if (typeof validator.lte !== 'number') {
                throw this.createIncorrectValidatorTypeError('lte', 'number', typeof validator.lte);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'gt')) {
            if (typeof validator.gt !== 'number') {
                throw this.createIncorrectValidatorTypeError('gt', 'number', typeof validator.gt);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'gte')) {
            if (typeof validator.gte !== 'number') {
                throw this.createIncorrectValidatorTypeError('gte', 'number', typeof validator.gte);
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
                if (typeof validator.between[idx] !== 'number') {
                    throw this.createIncorrectValidatorTypeError(`between[${idx}]`, 'number', typeof validator.between[idx]);
                }
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'in')) {
            for (let idx = 0; idx < validator.in.length; idx++) {
                if (typeof validator.in[idx] !== 'number') {
                    throw this.createIncorrectValidatorTypeError(`in[${idx}]`, 'number', typeof validator.in[idx]);
                }
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'notin')) {
            for (let idx = 0; idx < validator.notin.length; idx++) {
                if (typeof validator.notin[idx] !== 'number') {
                    throw this.createIncorrectValidatorTypeError(`notin[${idx}]`, 'number', typeof validator.notin[idx]);
                }
            }
        }
        return validator;
    }

    validate(value) {
        if (value === undefined) {
            if (!this.options.required) return;
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (typeof value !== 'number') {
            throw this.createIncorrectTypeError('number || undefined', value);
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

    toJSON() {
        return this.generator.name;
    }
};
