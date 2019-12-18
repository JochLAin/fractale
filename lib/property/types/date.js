const OPT = require('../../options');
const ƒ_type = require('./index');
const DateUtils = require('../../utils/date');

let moment;
try { moment = require('moment'); } catch (error) {}

module.exports = class ƒ_date extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, Date, input, options);
    }

    static evaluate(input, type) {
        return type === 'string' && ['date'].includes(input)
            || type === 'function' && (input === Date || (moment && input === moment))
            || type === 'object' && (input instanceof Date || (moment && moment.isMoment(input)))
        ;
    }

    static get priority() {
        return 5;
    }

    expose(property) {
        if (!property.value) return undefined;
        if (OPT.get('use_moment') && moment) {
            return moment(property.value);
        }
        return new Date(property.value);
    }

    flatten(value) {
        if (!value) return undefined;
        return DateUtils.format(value);
    }

    shape(value, options) {
        if (!value) return undefined;
        return DateUtils.format(value);
    }

    parseValidator(validator) {
        validator = super.parseValidator(validator);
        if (typeof validator !== 'object') return validator;
        if (Object.prototype.hasOwnProperty.call(validator, 'eq')) {
            if (!DateUtils.is(validator.eq)) {
                throw this.createIncorrectValidatorTypeError('eq', 'string || date [ || moment ]', typeof validator.eq);
            }
            validator.eq = DateUtils.parse(validator.eq);
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'neq')) {
            if (!DateUtils.is(validator.neq)) {
                throw this.createIncorrectValidatorTypeError('neq', 'string || date [ || moment ]', typeof validator.neq);
            }
            validator.neq = DateUtils.parse(validator.neq);
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'lt')) {
            if (!DateUtils.is(validator.lt)) {
                throw this.createIncorrectValidatorTypeError('lt', 'string || date [ || moment ]', typeof validator.lt);
            }
            validator.lt = DateUtils.parse(validator.lt);
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'lte')) {
            if (!DateUtils.is(validator.lte)) {
                throw this.createIncorrectValidatorTypeError('lte', 'string || date [ || moment ]', typeof validator.lte);
            }
            validator.lte = DateUtils.parse(validator.lte);
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'gt')) {
            if (!DateUtils.is(validator.gt)) {
                throw this.createIncorrectValidatorTypeError('gt', 'string || date [ || moment ]', typeof validator.gt);
            }
            validator.gt = DateUtils.parse(validator.gt);
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'gte')) {
            if (!DateUtils.is(validator.gte)) {
                throw this.createIncorrectValidatorTypeError('gte', 'string || date [ || moment ]', typeof validator.gte);
            }
            validator.gte = DateUtils.parse(validator.gte);
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'between')) {
            if (!Array.isArray(validator.between)) {
                throw this.createIncorrectValidatorTypeError('between', 'array', typeof validator.between);
            }
            if (validator.length === 0) {
                throw this.createIncorrectValidatorTypeError('between', 'array of 1 or 2 items', '0 items');
            }
            if (validator.length === 1) {
                validator.between.push(Date.now());
            }
            for (let idx = 0; idx < validator.between.length; idx++) {
                if (!DateUtils.is(validator.between[idx])) {
                    throw this.createIncorrectValidatorTypeError(`between[${idx}]`, 'string || date [ || moment ]', typeof validator.between[idx]);
                }
                validator.between[idx] = DateUtils.parse(validator.between[idx]);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'in')) {
            for (let idx = 0; idx < validator.in.length; idx++) {
                if (!DateUtils.is(validator.in[idx])) {
                    throw this.createIncorrectValidatorTypeError(`in[${idx}]`, 'string || date [ || moment ]', typeof validator.in[idx]);
                }
                validator.in[idx] = DateUtils.parse(validator.in[idx]);
            }
        }
        if (Object.prototype.hasOwnProperty.call(validator, 'notin')) {
            for (let idx = 0; idx < validator.notin.length; idx++) {
                if (!DateUtils.is(validator.notin[idx])) {
                    throw this.createIncorrectValidatorTypeError(`notin[${idx}]`, 'string || date [ || moment ]', typeof validator.notin[idx]);
                }
                validator.notin[idx] = DateUtils.parse(validator.notin[idx]);
            }
        }
        return validator;
    }

    validate(value) {
        if (value === undefined) {
            if (!this.options.required) return;
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (!DateUtils.is(value)) {
            throw this.createIncorrectTypeError('date || string [ || moment ] || undefined', value);
        }

        if (!this.validator) return;
        if (typeof this.validator === 'object') {
            if (Object.prototype.hasOwnProperty.call(this.validator, 'eq')) {
                if (!DateUtils.eq(value, this.validator.eq)) {
                    throw this.createValidatorError('eq', DateUtils.display(value), `lower than ${DateUtils.display(this.validator.eq)}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'neq')) {
                if (!DateUtils.neq(value, this.validator.neq)) {
                    throw this.createValidatorError('neq', DateUtils.display(value), `lower than ${DateUtils.display(this.validator.neq)}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'lt')) {
                if (!DateUtils.lt(value, this.validator.lt)) {
                    throw this.createValidatorError('lt', DateUtils.display(value), `lower than ${DateUtils.display(this.validator.lt)}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'lte')) {
                if (!DateUtils.lte(value, this.validator.lte)) {
                    throw this.createValidatorError('lte', DateUtils.display(value), `lower than or equal to ${DateUtils.display(this.validator.lte)}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'gt')) {
                if (!DateUtils.gt(value, this.validator.gt)) {
                    throw this.createValidatorError('gt', DateUtils.display(value), `greater than ${DateUtils.display(this.validator.gt)}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'gte')) {
                if (!DateUtils.gte(value, this.validator.gte)) {
                    throw this.createValidatorError('gte', DateUtils.display(value), `greater than or equal to ${DateUtils.display(this.validator.gt)}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'between')) {
                if (!DateUtils.between(value, this.validator.between[0], this.validator.between[1])) {
                    throw this.createValidatorError('between', DateUtils.display(value), `between ${DateUtils.display(this.validator.between[0])} and ${DateUtils.display(this.validator.between[1])}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'in')) {
                if (!this.validator.in.find(date => DateUtils.eq(value, date))) {
                    throw this.createValidatorError('notin', DateUtils.display(value), `in ${this.validator.in.map(date => DateUtils.display(date)).join(', ')}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'notin')) {
                if (!this.validator.notin.every(date => DateUtils.neq(value, date))) {
                    throw this.createValidatorError('notin', DateUtils.display(value), `not in ${this.validator.notin.map(date => DateUtils.display(date)).join(', ')}`);
                }
            }
        }
    }

    toJSON() {
        return this.generator.name;
    }
};
