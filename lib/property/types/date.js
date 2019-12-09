'use strict';

const moment = require('moment');
const OPT = require('../../options');
const ƒ_type = require('./index');

module.exports = class ƒ_date extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = Date;
    }

    static evaluate(input, type) {
        return type === 'string' && ['date'].includes(input)
            || type === 'function' && (input === Date || input === moment)
            || type === 'object' && (input instanceof Date || moment.isMoment(input))
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
            if (typeof validator.eq !== 'string' && !(validator.eq instanceof Date) && !moment.isMoment(validator.eq)) {
                throw this.createIncorrectValidatorTypeError('eq', 'string || date || moment', typeof validator.eq);
            }
        }
        if (validator.hasOwnProperty('neq')) {
            if (typeof validator.neq !== 'string' && !(validator.neq instanceof Date) && !moment.isMoment(validator.neq)) {
                throw this.createIncorrectValidatorTypeError('neq', 'string || date || moment', typeof validator.neq);
            }
        }
        if (validator.hasOwnProperty('lt')) {
            if (typeof validator.lt !== 'string' && !(validator.lt instanceof Date) && !moment.isMoment(validator.lt)) {
                throw this.createIncorrectValidatorTypeError('lt', 'string || date || moment', typeof validator.lt);
            }
        }
        if (validator.hasOwnProperty('lte')) {
            if (typeof validator.lte !== 'string' && !(validator.lte instanceof Date) && !moment.isMoment(validator.lte)) {
                throw this.createIncorrectValidatorTypeError('lte', 'string || date || moment', typeof validator.lte);
            }
        }
        if (validator.hasOwnProperty('gt')) {
            if (typeof validator.gt !== 'string' && !(validator.gt instanceof Date) && !moment.isMoment(validator.gt)) {
                throw this.createIncorrectValidatorTypeError('gt', 'string || date || moment', typeof validator.gt);
            }
        }
        if (validator.hasOwnProperty('gte')) {
            if (typeof validator.gte !== 'string' && !(validator.gte instanceof Date) && !moment.isMoment(validator.gte)) {
                throw this.createIncorrectValidatorTypeError('gte', 'string || date || moment', typeof validator.gte);
            }
        }
        if (validator.hasOwnProperty('between')) {
            if (!Array.isArray(validator.between)) {
                throw this.createIncorrectValidatorTypeError('between', 'array', typeof validator.between);
            }
            for (let idx = 0; idx < validator.between.length; idx++) {
                if (typeof validator.between[idx] !== 'string' && !(validator.between[idx] instanceof Date) && !moment.isMoment(validator.between[idx])) {
                    throw this.createIncorrectValidatorTypeError(`between[${idx}]`, 'string || date || moment', typeof validator.between[idx]);
                }
            }
        }
        if (validator.hasOwnProperty('in')) {
            for (let idx = 0; idx < validator.in.length; idx++) {
                if (typeof validator.in[idx] !== 'string' && !(validator.in[idx] instanceof Date) && !moment.isMoment(validator.in[idx])) {
                    throw this.createIncorrectValidatorTypeError(`in[${idx}]`, 'string || date || moment', typeof validator.in[idx]);
                }
            }
        }
        if (validator.hasOwnProperty('notin')) {
            for (let idx = 0; idx < validator.notin.length; idx++) {
                if (typeof validator.notin[idx] !== 'string' && !(validator.notin[idx] instanceof Date) && !moment.isMoment(validator.notin[idx])) {
                    throw this.createIncorrectValidatorTypeError(`notin[${idx}]`, 'string || date || moment', typeof validator.notin[idx]);
                }
            }
        }
        return validator;
    }

    validate(value) {
        if (value === undefined) return;
        if (typeof value !== 'string' && !(value instanceof Date) && !moment.isMoment(value)) {
            throw this.createIncorrectTypeError('date || moment || string || undefined', value);
        }

        if (!this.validator) return;
        super.validate(value);
        if (typeof this.validator === 'object') {
            if (this.validator.hasOwnProperty('eq')) {
                if (!moment(value).isSame(this.validator.eq)) {
                    throw this.createValidatorError('eq', moment(value).format('DD/MM/YYYY-HH:mm:ss'), `lower than ${moment(this.validator.eq).format('DD/MM/YYYY-HH:mm:ss')}`);
                }
            }
            if (this.validator.hasOwnProperty('neq')) {
                if (moment(value).isSame(this.validator.neq)) {
                    throw this.createValidatorError('neq', moment(value).format('DD/MM/YYYY-HH:mm:ss'), `lower than ${moment(this.validator.neq).format('DD/MM/YYYY-HH:mm:ss')}`);
                }
            }
            if (this.validator.hasOwnProperty('lt')) {
                if (!moment(value).isBefore(this.validator.lt)) {
                    throw this.createValidatorError('lt', moment(value).format('DD/MM/YYYY-HH:mm:ss'), `lower than ${moment(this.validator.lt).format('DD/MM/YYYY-HH:mm:ss')}`);
                }
            }
            if (this.validator.hasOwnProperty('lte')) {
                if (!moment(value).isSameOrBefore(this.validator.lte)) {
                    throw this.createValidatorError('lte', moment(value).format('DD/MM/YYYY-HH:mm:ss'), `lower than or equal to ${moment(this.validator.lte).format('DD/MM/YYYY-HH:mm:ss')}`);
                }
            }
            if (this.validator.hasOwnProperty('gt')) {
                if (!moment(value).isAfter(this.validator.gt)) {
                    throw this.createValidatorError('gt', moment(value).format('DD/MM/YYYY-HH:mm:ss'), `greater than ${moment(this.validator.gt).format('DD/MM/YYYY-HH:mm:ss')}`);
                }
            }
            if (this.validator.hasOwnProperty('gte')) {
                if (!moment(value).isSameOrAfter(this.validator.gte)) {
                    throw this.createValidatorError('gte', moment(value).format('DD/MM/YYYY-HH:mm:ss'), `greater than or equal to ${moment(this.validator.gt).format('DD/MM/YYYY-HH:mm:ss')}`);
                }
            }
            if (this.validator.hasOwnProperty('between')) {
                if (!moment(value).isBetween(this.validator.between[0], this.validator.between[1])) {
                    throw this.createValidatorError('between', moment(value).format('DD/MM/YYYY-HH:mm:ss'), `between ${moment(this.validator.between[0]).format('DD/MM/YYYY-HH:mm:ss')} and ${moment(this.validator.between[1]).format('DD/MM/YYYY-HH:mm:ss')}`);
                }
            }
        }
    }

    toJSON() {
        return this.input.name;
    }
};
