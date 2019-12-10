'use strict';

const { DependencyNotFoundError } = require("../../errors");
const OPT = require('../../options');
const ƒ_type = require('./index');

let moment;
try { moment = require('moment'); } catch (error) {}

module.exports = class ƒ_date extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = Date;
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
        if (OPT.get('use_moment')) {
            return moment(property.value);
        }
        return new Date(property.value);
    }

    flatten(value) {
        if (!value) return undefined;
        return moment(value).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }

    shape(value, options) {
        if (!value) return undefined;
        return moment(value).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }

    parseValidator(validator) {
        validator = super.parseValidator(validator);
        if (typeof validator !== 'object') return validator;
        if (validator.hasOwnProperty('eq')) {
            if (!DateHelper.is(validator.eq)) {
                throw this.createIncorrectValidatorTypeError('eq', 'string || date [ || moment ]', typeof validator.eq);
            }
            validator.eq = moment ? moment(validator.eq) : new Date(validator.eq);
        }
        if (validator.hasOwnProperty('neq')) {
            if (!DateHelper.is(validator.neq)) {
                throw this.createIncorrectValidatorTypeError('neq', 'string || date [ || moment ]', typeof validator.neq);
            }
            validator.neq = moment ? moment(validator.neq) : new Date(validator.neq);
        }
        if (validator.hasOwnProperty('lt')) {
            if (!DateHelper.is(validator.lt)) {
                throw this.createIncorrectValidatorTypeError('lt', 'string || date [ || moment ]', typeof validator.lt);
            }
            validator.lt = moment ? moment(validator.lt) : new Date(validator.lt);
        }
        if (validator.hasOwnProperty('lte')) {
            if (!DateHelper.is(validator.lte)) {
                throw this.createIncorrectValidatorTypeError('lte', 'string || date [ || moment ]', typeof validator.lte);
            }
            validator.lte = moment ? moment(validator.lte) : new Date(validator.lte);
        }
        if (validator.hasOwnProperty('gt')) {
            if (!DateHelper.is(validator.gt)) {
                throw this.createIncorrectValidatorTypeError('gt', 'string || date [ || moment ]', typeof validator.gt);
            }
            validator.gt = moment ? moment(validator.gt) : new Date(validator.gt);
        }
        if (validator.hasOwnProperty('gte')) {
            if (!DateHelper.is(validator.gte)) {
                throw this.createIncorrectValidatorTypeError('gte', 'string || date [ || moment ]', typeof validator.gte);
            }
            validator.gte = moment ? moment(validator.gte) : new Date(validator.gte);
        }
        if (validator.hasOwnProperty('between')) {
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
                if (!DateHelper.is(validator.between[idx])) {
                    throw this.createIncorrectValidatorTypeError(`between[${idx}]`, 'string || date [ || moment ]', typeof validator.between[idx]);
                }
                validator.between[idx] = moment ? moment(validator.between[idx]) : new Date(validator.between[idx]);
            }
        }
        if (validator.hasOwnProperty('in')) {
            for (let idx = 0; idx < validator.in.length; idx++) {
                if (!DateHelper.is(validator.in[idx])) {
                    throw this.createIncorrectValidatorTypeError(`in[${idx}]`, 'string || date [ || moment ]', typeof validator.in[idx]);
                }
                validator.in[idx] = moment ? moment(validator.in[idx]) : new Date(validator.in[idx]);
            }
        }
        if (validator.hasOwnProperty('notin')) {
            for (let idx = 0; idx < validator.notin.length; idx++) {
                if (!DateHelper.is(validator.notin[idx])) {
                    throw this.createIncorrectValidatorTypeError(`notin[${idx}]`, 'string || date [ || moment ]', typeof validator.notin[idx]);
                }
                validator.notin[idx] = moment ? moment(validator.notin[idx]) : new Date(validator.notin[idx]);
            }
        }
        return validator;
    }

    validate(value) {
        if (value === undefined) return;
        if (typeof value !== 'string' && !(value instanceof Date) && !(moment && moment.isMoment(value))) {
            throw this.createIncorrectTypeError('date || string [ || moment ] || undefined', value);
        }

        if (!this.validator) return;
        if (typeof this.validator === 'object') {
            if (this.validator.hasOwnProperty('eq')) {
                if (!DateHelper.eq(value, this.validator.eq)) {
                    throw this.createValidatorError('eq', DateHelper.format(value), `lower than ${DateHelper.format(this.validator.eq)}`);
                }
            }
            if (this.validator.hasOwnProperty('neq')) {
                if (!DateHelper.neq(value, this.validator.neq)) {
                    throw this.createValidatorError('neq', DateHelper.format(value), `lower than ${DateHelper.format(this.validator.neq)}`);
                }
            }
            if (this.validator.hasOwnProperty('lt')) {
                if (!DateHelper.lt(value, this.validator.lt)) {
                    throw this.createValidatorError('lt', DateHelper.format(value), `lower than ${DateHelper.format(this.validator.lt)}`);
                }
            }
            if (this.validator.hasOwnProperty('lte')) {
                if (!DateHelper.lte(value, this.validator.lte)) {
                    throw this.createValidatorError('lte', DateHelper.format(value), `lower than or equal to ${DateHelper.format(this.validator.lte)}`);
                }
            }
            if (this.validator.hasOwnProperty('gt')) {
                if (!DateHelper.gt(value, this.validator.gt)) {
                    throw this.createValidatorError('gt', DateHelper.format(value), `greater than ${DateHelper.format(this.validator.gt)}`);
                }
            }
            if (this.validator.hasOwnProperty('gte')) {
                if (!DateHelper.gte(value, this.validator.gte)) {
                    throw this.createValidatorError('gte', DateHelper.format(value), `greater than or equal to ${DateHelper.format(this.validator.gt)}`);
                }
            }
            if (this.validator.hasOwnProperty('between')) {
                if (!DateHelper.between(value, this.validator.between[0], this.validator.between[1])) {
                    throw this.createValidatorError('between', DateHelper.format(value), `between ${DateHelper.format(this.validator.between[0])} and ${DateHelper.format(this.validator.between[1])}`);
                }
            }
            if (this.validator.hasOwnProperty('in')) {
                if (!this.validator.in.find((date) => DateHelper.eq(value, date))) {
                    throw this.createValidatorError('notin', DateHelper.format(value), `in ${this.validator.in.map(date => DateHelper.format(date)).join(', ')}`);
                }
            }
            if (this.validator.hasOwnProperty('notin')) {
                if (!this.validator.notin.every((date) => DateHelper.neq(value, date))) {
                    throw this.createValidatorError('notin', DateHelper.format(value), `not in ${this.validator.notin.map(date => DateHelper.format(date)).join(', ')}`);
                }
            }
        }
    }

    toJSON() {
        return this.input.name;
    }
};

class DateHelper {
    static is(value) {
        return typeof value === 'string' || value instanceof Date || moment && moment.isMoment(value);
    }
    static format(value) {
        if (moment) return moment(value).format('DD/MM/YYYY-HH:mm:ss');
        const date = new Date(value);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()).padStart(2, '0')}/${String(date.getFullYear()).padStart(4, '0')}-${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }
    static eq(a, b) {
        if (moment) return moment(a).isSame(b);
        return Math.floor((new Date(a)).getTime() / 1000) === Math.floor((new Date(b)).getTime() / 1000);
    }
    static neq(a, b) {
        if (moment) return !moment(a).isSame(b);
        return Math.floor((new Date(a)).getTime() / 1000) !== Math.floor((new Date(b)).getTime() / 1000);
    }
    static lt(a, b) {
        if (moment) return moment(a).isBefore(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) < Math.floor((new Date(b)).getTime() / 1000);
    }
    static lte(a, b) {
        if (moment) return moment(a).isSameOrBefore(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) <= Math.floor((new Date(b)).getTime() / 1000);
    }
    static gt(a, b) {
        if (moment) return moment(a).isAfter(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) > Math.floor((new Date(b)).getTime() / 1000);
    }
    static gte(a, b) {
        if (moment) return moment(a).isSameOrAfter(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) >= Math.floor((new Date(b)).getTime() / 1000);
    }
    static between(a, b, c) {
        if (moment) return moment(a).isBetween(b, c);
        return Math.floor((new Date(b)).getTime() / 1000) < Math.floor((new Date(a)).getTime() / 1000)
            && Math.floor((new Date(a)).getTime() / 1000) < Math.floor((new Date(c)).getTime() / 1000)
        ;
    }
}
